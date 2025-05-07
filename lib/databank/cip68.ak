use aiken/collection/list
use aiken/crypto.{ScriptHash}
use cardano/assets.{AssetName}
use cardano/transaction.{InlineDatum, Input, Output, OutputReference}

pub type Cip68 {
  metadata: Pairs<ByteArray, Data>,
  version: Int,
  extra: Data,
}

pub fn must_consume_nonce(
  transaction_inputs: List<Input>,
  nonce: OutputReference,
) -> Bool {
  let Input { output_reference, .. } <- list.any(transaction_inputs)
  output_reference == nonce
}

pub fn must_send_ref_token_to_self_script(
  transaction_outputs: List<Output>,
  self_script: ScriptHash,
  token_name: AssetName,
) -> Bool {
  expect [ref_token_utxo] =
    transaction_outputs |> transaction.find_script_outputs(self_script)

  // output self address must not have a stake credential
  expect None = ref_token_utxo.address.stake_credential

  // ref_token inline datum must be CIP-68
  expect InlineDatum(metadata) = ref_token_utxo.datum
  expect _: Cip68 = metadata

  assets.quantity_of(ref_token_utxo.value, self_script, token_name) == 1
}
