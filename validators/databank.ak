use aiken/cbor
use aiken/collection/list
use aiken/crypto
use aiken/primitive/bytearray
use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, OutputReference, Transaction}
use utils/value
use databank/action.{Action, Burn, Mint, Update}
use databank/cip68.{Cip68, must_consume_nonce, must_send_ref_token_to_self_script}

validator databank_nfts {
  mint(redeemer action: Action, policy_id: PolicyId, tx: Transaction) {
    let mint_qty = 
      when action is {
        Mint { .. } -> 1
        Burn -> -1
        _ -> fail @"Invalid redeemer action!"
      }
    
    // Get all minted/burned tokens
    let mint_pairs = tx.mint |> value.to_pairs(policy_id)
    
    // Handle the different cases based on the action
    when action is {
      Mint(nonce_utxo) -> {
        // Calculate token name from the nonce UTXO
        let token_name = nonce_utxo |> cbor.serialise |> crypto.blake2b_224
        
        // Must mint either 2 or 3 tokens (with optional metadata)
        expect list.length(mint_pairs) == 2 || list.length(mint_pairs) == 3
        
        // Extract ref and user tokens, which are mandatory
        expect Some(ref_token) =
          mint_pairs
            |> list.find(
                fn(pair) {
                  let Pair(name, _) = pair
                  bytearray.take(name, 4) == #"000643b0"
                },
              )
        expect Some(usr_token) =
          mint_pairs
            |> list.find(
                fn(pair) {
                  let Pair(name, _) = pair
                  bytearray.take(name, 4) == #"000de140"
                },
              )
        
        // Validate ref token
        let Pair(ref_token_name, ref_token_qty) = ref_token
        expect ref_token_qty == mint_qty
        let ref_name_suffix = bytearray.drop(ref_token_name, 4)
        expect ref_name_suffix == token_name
        
        // Validate user token
        let Pair(usr_token_name, usr_token_qty) = usr_token
        expect usr_token_qty == mint_qty
        let usr_name_suffix = bytearray.drop(usr_token_name, 4)
        expect usr_name_suffix == token_name
        
        // Check metadata token if present
        let has_valid_metadata =
          when
            list.find(
              mint_pairs,
              fn(pair) {
                let Pair(name, _) = pair
                bytearray.take(name, 4) == #"000de141"
              },
            )
          is {
            Some(Pair(metadata_name, metadata_qty)) ->
              // Metadata token must have quantity of 1 and same name suffix
              metadata_qty == mint_qty && bytearray.drop(metadata_name, 4) == token_name
            None -> True
          }
        
        // Additional validations
        and {
          has_valid_metadata,
          // Consume the nonce UTXO to prevent replay attacks
          must_consume_nonce(tx.inputs, nonce_utxo),
          // Ensure ref token goes to script address for immutability
          must_send_ref_token_to_self_script(
            tx.outputs,
            policy_id,
            ref_token_name,
          ),
        }
      }
      
      Burn -> {
        // When burning, we need to verify that we're burning both ref and user tokens
        expect Some(ref_token) =
          mint_pairs
            |> list.find(
                fn(pair) {
                  let Pair(name, qty) = pair
                  bytearray.take(name, 4) == #"000643b0" && qty == mint_qty
                },
              )
        expect Some(usr_token) =
          mint_pairs
            |> list.find(
                fn(pair) {
                  let Pair(name, qty) = pair
                  bytearray.take(name, 4) == #"000de140" && qty == mint_qty
                },
              )
        
        // Ensure both tokens have the same name suffix
        let Pair(ref_token_name, _) = ref_token
        let Pair(usr_token_name, _) = usr_token
        let ref_name_suffix = bytearray.drop(ref_token_name, 4)
        let usr_name_suffix = bytearray.drop(usr_token_name, 4)
        
        // Also burn metadata token if it exists
        let has_valid_metadata_burn =
          when
            list.find(
              mint_pairs,
              fn(pair) {
                let Pair(name, qty) = pair
                bytearray.take(name, 4) == #"000de141" && qty == mint_qty
              },
            )
          is {
            Some(Pair(metadata_name, _)) ->
              bytearray.drop(metadata_name, 4) == ref_name_suffix
            None -> True
          }
        
        and {
          ref_name_suffix == usr_name_suffix,
          has_valid_metadata_burn,
        }
      }
      
      Update { .. } -> False  // We'll implement this in the spend function
    }
  }

  spend(
    _datum: Option<Cip68>,
    redeemer action: Action,
    o_ref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(ref_token_input) = tx.inputs |> transaction.find_input(o_ref)
    expect Script(policy_id) = ref_token_input.output.address.payment_credential
    
    when action is {
      Mint { .. } -> False
      
      Update(usr_token_input_idx) -> {
        // Extract the input ref_token AssetName by self PolicyID
        expect [Pair(ref_token_name, _)] = 
          ref_token_input.output.value |> value.to_pairs(policy_id)
        
        let token_name = ref_token_name |> bytearray.drop(4)
        
        // Must consume usr_token to prove ownership
        expect Some(usr_token_input) = list.at(tx.inputs, usr_token_input_idx)
        let tokens = usr_token_input.output.value |> value.to_pairs(policy_id)
        
        expect {
          let Pair(asset_name, _) <- list.any(tokens)
          and {
            asset_name != ref_token_name,
            bytearray.take(asset_name, 4) == #"000de140",
            bytearray.drop(asset_name, 4) == token_name,
          }
        }
        
        // Must resend ref_token to update the metadatum
        expect [output] = tx.outputs |> transaction.find_script_outputs(policy_id)
        expect InlineDatum(metadata) = output.datum
        expect _: Cip68 = metadata
        
        // Extract the output ref_token AssetName by self PolicyID
        expect [Pair(o_ref_token_name, _)] = 
          output.value |> value.to_pairs(policy_id)
        
        and {
          o_ref_token_name == ref_token_name,
          // Must resend ref_token with the same AssetName
          output.address == ref_token_input.output.address,
          // Prevent insufficient-staking-control vulnerability
          output.reference_script == ref_token_input.output.reference_script,
        }
      }
      
      Burn -> 
        // Must execute self minting validation
        tx.mint
          |> assets.policies
          |> list.has(policy_id)
    }
  }

  else(_) {
    fail
  }
}