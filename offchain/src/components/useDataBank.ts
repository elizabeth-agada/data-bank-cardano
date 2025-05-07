import { useState, useCallback, useEffect } from 'react'
import { blake2bHex } from "blakejs";
import {
  Constr,
  Data,
  fromHex,
  fromText,
  RedeemerBuilder,
  toText,
  toUnit,
  TxSignBuilder,
  UTxO,
} from "@lucid-evolution/lucid";

import { WalletConnection } from "./contexts/wallet/WalletContext";
import { koios } from "./providers/koios";
import { handleError, handleSuccess } from "./utils";

import { Cip68Metadatum } from "@/types/cip68";
import { Token } from "@/types/token";
import * as Script from "@/config/script";

import toast from "react-hot-toast";
import { PinataSDK } from 'pinata-web3'
import { supabase } from '@/utils/supabase';

// Type for upload options
type UploadType = 'upload' | 'mint'

async function submitTx(tx: TxSignBuilder) {
  const txSigned = await tx.sign.withWallet().complete();
  const txHash = await txSigned.submit();

  return txHash;
}

function getShortestUTxO(utxos: UTxO[]) {
  const bigint2str = (_: unknown, val: bigint | string) =>
    typeof val === "bigint" ? val.toString() : val;

  let shortestUTxO = JSON.stringify(utxos[0], bigint2str).length;
  let utxo = utxos[0];

  for (let u = 1; u < utxos.length; u++) {
    const currLen = JSON.stringify(utxos[u], bigint2str).length;

    if (currLen < shortestUTxO) {
      shortestUTxO = currLen;
      utxo = utxos[u];
    }
  }

  return utxo;
}


export async function queryAddressAssets({ lucid, address }: WalletConnection) {
  if (!lucid) throw "Uninitialized Lucid";
  if (!address) throw "Disconnected Wallet";

  const usrTokens = await koios.queryAddressAssets(
    `${address}`,
    Script.PolicyID,
  );
  const refTokens = usrTokens.map(([policyID, assetName]: string[]) => {
    return toUnit(policyID, assetName.slice(8), 100);
  });

  const utxos = await lucid.utxosAt(Script.Address);

  const nameHex = fromText("name");
  const imageHex = fromText("image");

  const tokens: Token[] = [];

  for (const refToken of refTokens) {
    const utxo = utxos.find((utxo) => utxo.assets[refToken]);

    if (!utxo) continue; // should never happen

    const { metadata } = Data.from(`${utxo.datum}`, Cip68Metadatum);

    const name = toText(`${metadata.get(nameHex)}`);
    const image = toText(`${metadata.get(imageHex)}`);

    tokens.push({ 
      name, 
      image, 
      utxo, 
      assetName: refToken.slice(64), 
      metadata: Object.fromEntries(metadata) 
    });
  }

  tokens.sort((l, r) => {
    return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
  });

  return tokens;
}

export async function mint(
  token: { 
    name: string; 
    image: string;
    metadata?: {
      [key: string]: any;
    }
  },
  { lucid, walletApi }: WalletConnection,
  metadataUrl?: string,
) {
  try {
    if (!lucid) throw "Uninitialized Lucid";
    if (!walletApi) throw "Disconnected Wallet";

    // CIP-68 standard has a 32-byte limit for token names, with 4 bytes for prefix
    if (token.name.length > 28) throw "Token Name is too long! Max 28 characters.";
    if (!token.name) throw "Token Name is required!";
    if (!token.image) throw "Image URL is required!";
    if (!token.name.match(/^[a-zA-Z0-9_]+$/)) throw "Token Name can only contain alphanumeric characters and underscores!";

    // Build CIP-68 compliant metadata
    const metadata = new Map();
    
    // Add basic metadata fields
    metadata.set(fromText("name"), fromText(token.name));
    metadata.set(fromText("image"), fromText(token.image));
    
    // Handle custom metadata if present
    if (token.metadata) {
      Object.entries(token.metadata).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle nested objects like properties
          const nestedMap = new Map();
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            nestedMap.set(fromText(nestedKey), fromText(String(nestedValue)));
          });
          metadata.set(fromText(key), nestedMap);
        } else {
          metadata.set(fromText(key), fromText(String(value)));
        }
      });
    }
    
    // Create the CIP-68 metadata structure
    const cip68: Cip68Metadatum = {
      metadata: metadata,
      version: BigInt(1),
      extra: metadataUrl ? [fromText("metadata_url"), fromText(metadataUrl)] : [],
    };
    
    const datum = Data.to(cip68, Cip68Metadatum);

    // Connect wallet if not already connected
    if (!lucid.wallet()) lucid.selectWallet.fromAPI(walletApi);
    const utxos = await lucid.wallet().getUtxos();
    if (!utxos || utxos.length === 0) throw "Empty user wallet!";

    // Get nonce UTxO for token name generation
    const nonce = getShortestUTxO(utxos);
    const nonceUTxO = new Constr(0, [
      String(nonce.txHash),
      BigInt(nonce.outputIndex),
    ]); 
    const mintAction = new Constr(0, [nonceUTxO]);
    const redeemer = Data.to(mintAction);

    // Generate asset name using Blake2b hash (CIP-68 compliant)
    const assetName = blake2bHex(fromHex(Data.to(nonceUTxO)), undefined, 28);

    // Create token units with proper CIP-68 prefixes
    const refUnit = toUnit(Script.PolicyID, assetName, 0x000643b0);  // .ref prefix (reference token)
    const usrUnit = toUnit(Script.PolicyID, assetName, 0x000de140);  // .usr prefix (user token)
    const mdtUnit = toUnit(Script.PolicyID, assetName, 0x000de141);  // .mdt prefix (metadata token)

    // Define assets to mint
    const mintAssets = {
      [refUnit]: BigInt(1),
      [usrUnit]: BigInt(1),
    };

    // Add optional metadata token if we have a metadata URL
    if (metadataUrl) {
      mintAssets[mdtUnit] = BigInt(1);
    }

    // Build and submit transaction
    let txBuilder = lucid
      .newTx()
      .collectFrom([nonce])
      .mintAssets(mintAssets, redeemer)
      .attach.MintingPolicy(Script.Cip68)
      .pay.ToContract(
        Script.Address,
        { kind: "inline", value: datum },
        {
          [refUnit]: BigInt(1),  // Reference token always goes to script
        },
      );
      
    // If minting metadata token, send it to the user (best practice)
    if (metadataUrl) {
      // User gets both the user token and metadata token
      const userAddress = await lucid.wallet().address();
      txBuilder = txBuilder.pay.ToAddress(userAddress, {
        [mdtUnit]: BigInt(1),
      });
    }
    
    const tx = await txBuilder
      .validTo(new Date().getTime() + 15 * 60_000) // 15 minutes
      .complete();

    const txHash = await submitTx(tx);

    handleSuccess(`Mint Token TxHash: ${txHash}`);

    // Create UTxO object for the reference token
    const utxo: UTxO = {
      address: Script.Address,
      assets: { [refUnit]: BigInt(1) },
      txHash,
      outputIndex: 0,
      datum,
    };

    // Return object matching your Token type
    return { 
      name: token.name,
      image: token.image,
      utxo, 
      assetName,
      metadata: {
        ...token.metadata || {},
        metadataUrl,
        refUnit,
        usrUnit,
        mdtUnit: metadataUrl ? mdtUnit : undefined
      }
    };
  } catch (error) {
    handleError(error as { [key: string]: any; info?: string; message?: string });(error as { [key: string]: any; info?: string; message?: string });
  }
}

export async function update(
  token: { name: string; image: string; utxo: UTxO; assetName: string },
  { lucid, walletApi, address }: WalletConnection,
) {
  try {
    if (!lucid) throw "Uninitialized Lucid";
    if (!walletApi || !address) throw "Disconnected Wallet";

    if (token.name.length > 32 - 4) toast.error("Token Name is too long!");
    if (token.image.length > 64) toast.error("Image URL is too long!");

    if (!token.name) throw "Token Name is required!";
    if (!token.image) throw "Image URL is required!";

    if (!token.name.match(/^[a-zA-Z0-9_]+$/)) toast.error("Token Name is invalid!");
    if (token.image.length > 64) throw "Image URL is too long!";


    const cip68: Cip68Metadatum = {
      metadata: new Map(
        Object.entries({ name: token.name, image: token.image }).map(
          ([k, v]) => [fromText(k), fromText(v)],
        ),
      ),
      version: BigInt(1),
      extra: [],
    };
    const datum = Data.to(cip68, Cip68Metadatum);

    const refUnit = toUnit(Script.PolicyID, token.assetName, 100);
    const usrUnit = toUnit(Script.PolicyID, token.assetName, 222);

    if (!lucid.wallet()) lucid.selectWallet.fromAPI(walletApi);

    const inputs = await lucid.utxosAtWithUnit(address, usrUnit);
    const utxos = [...inputs, token.utxo];

    const redeemer: RedeemerBuilder = {
      inputs,
      kind: "selected",
      makeRedeemer: (usrTokenInputIdx) => {
        const updateAction = new Constr(1, usrTokenInputIdx);

        return Data.to(updateAction);
      },
    };

    const tx = await lucid
      .newTx()
      .collectFrom(utxos, redeemer)
      .attach.SpendingValidator(Script.Cip68)
      .pay.ToContract(
        Script.Address,
        { kind: "inline", value: datum },
        {
          [refUnit]: BigInt(1),
        },
      )
      .validTo(new Date().getTime() + 15 * 60_000) // 15 minutes
      .complete();

    const txHash = await submitTx(tx);

    handleSuccess(`Update Token TxHash: ${txHash}`);

    const utxo: UTxO = {
      address: Script.Address,
      assets: { [refUnit]: BigInt(1) },
      txHash,
      outputIndex: 0,
      datum,
    };

    return { ...token, utxo };
  } catch (error) {
    handleError(error as { [key: string]: any; info?: string; message?: string });(error);
  }
}

export async function burn(
  token: { name: string; image: string; utxo: UTxO; assetName: string },
  { lucid, walletApi, address }: WalletConnection,
) {
  try {
    if (!lucid) throw "Uninitialized Lucid";
    if (!walletApi || !address) throw "Disconnected Wallet";

    const refUnit = toUnit(Script.PolicyID, token.assetName, 100);
    const usrUnit = toUnit(Script.PolicyID, token.assetName, 222);

    if (!lucid.wallet()) lucid.selectWallet.fromAPI(walletApi);

    const inputs = await lucid.utxosAtWithUnit(address, usrUnit);
    const utxos = [...inputs, token.utxo];

    const burnAction = new Constr(2, []);
    const redeemer = Data.to(burnAction);

    const tx = await lucid
      .newTx()
      .collectFrom(utxos, redeemer)
      .mintAssets(
        {
          [refUnit]: -BigInt(1),
          [usrUnit]: -BigInt(1),
        },
        redeemer,
      )
      .attach.Script(Script.Cip68)
      .validTo(new Date().getTime() + 15 * 60_000) // 15 minutes
      .complete();

    const txHash = await submitTx(tx);

    handleSuccess(`Burn Token TxHash: ${txHash}`);

    const utxo: UTxO = { address: "", assets: {}, txHash, outputIndex: -1 };

    return { ...token, utxo };
  } catch (error) {
    handleError(error as { [key: string]: any; info?: string; message?: string });(error);
  }
}


export function useDocumentUpload({ lucid, address }: WalletConnection) {
    if (!lucid) throw "Uninitialized Lucid";
    if (!address) throw "Disconnected Wallet";

    const [isUploading, setIsUploading] = useState(false)
    const [IsStored, setIsStored] = useState(false)

  
    // Pinata setup
    const pinataCloudGateway = process.env.NEXT_PUBLIC_GATEWAY
    const pinata = new PinataSDK({
        pinataJwt: process.env.NEXT_PUBLIC_JWT_SECRET,
        pinataGateway: pinataCloudGateway
    })

      useEffect(() => {
        let toastId = null;
        // Handle uploading state
        if (isUploading) {
          toastId = toast.loading("Uploading document to IPFS...")
        }
        // when the document is stored
        if (IsStored) {
            setIsUploading(false)
          if (toastId) {
            toast.dismiss(toastId)
          }
          
        }
        
        // Clean up the toast when component unmounts
        return () => {
          if (toastId) {
            toast.dismiss(toastId)
          }
        }
      }, [isUploading, IsStored])

    const storeDocument = useCallback(
        async (address: string, documentHash: string, documentURI: string, documentName: string, documentType: string, documentSize: string, status: string) => {
        try {
            if (!address) {
            toast.error("No wallet connected")
            return false
            }
            
            // Store uploaded IPFS document details to Supabase
            const { error } = await supabase
            .from('documents')
            .insert([
                {
                owner_address: address,
                document_hash: documentHash,
                document_uri: documentURI,
                document_name: documentName,
                document_type: documentType,
                document_size: documentSize,
                status: status,
                created_at: new Date().toISOString()
                }
            ])

            setIsStored(true)

            
            
            if (error) {
            console.error("Supabase storage error:", error)
            toast.error(`Failed to store document metadata: ${error.message}`)
            return false
            }
            
            toast.success(`Document metadata stored successfully`)
            return true
        } catch (storeDocumentError) {
            console.error("storeDocumentError", storeDocumentError)
            toast.error(String(storeDocumentError))
            setIsUploading(false)
            setIsStored(false)
            return false
        }
        }, 
        []
    )

    const uploadToIpfs = useCallback(
        async (
          file: File, 
          documentName: string, 
          uploadType: UploadType,
          walletConnection: WalletConnection
        ) => {
          if (!address) {
            toast.error("Connect your wallet first")
            return false
          }
          
          if (!file) {
            toast.error("Select a document to proceed")
            return false
          }
          
          if (!documentName) {
            toast.error("Enter document name to proceed")
            return false
          }
          
          setIsUploading(true)
          
          try {
            // eslint-disable-next-line prefer-const
            let uploadToast = toast.loading(`Uploading ${documentName} to IPFS!`)
            
            const upload = await pinata.upload.file(file)
            
            toast.dismiss(uploadToast)
            setIsUploading(false)
            
            toast.success(
              uploadType === 'mint'
                ? `Document uploaded to IPFS for minting: ${documentName}`
                : `Document uploaded to IPFS: ${documentName}`
            )
            
            // Extract file details
            const fileExtension = file.name.split('.').pop() || ''
            const fileUrl = `https://${pinataCloudGateway}/ipfs/${upload.IpfsHash}`
            const fileSize = file.size.toString()
            
            // Prepare metadata for the document
            const metadata = {
              description: `Document uploaded via Databank`,
              properties: {
                type: fileExtension,
                size: file.size.toString(),
                hash: upload.IpfsHash
              }
            };

            const tokenData = {
                name: documentName,
                image: fileUrl,
                metadata: metadata
            };
            
              // Upload metadata to IPFS
              const metadataUpload = await pinata.upload.json(metadata);
              const metadataUrl = `https://${pinataCloudGateway}/ipfs/${metadataUpload.IpfsHash}`;
              
    
            if (uploadType === 'upload') {
              return storeDocument(address, upload.IpfsHash, metadataUrl, documentName, fileExtension, fileSize, "NOT MINTED")
            }
              
            // Call mint function if upload type is 'mint'
            console.log(`The uploaded file hash is ${upload.IpfsHash}, Metadata: ${metadataUrl}, Document name: ${documentName}, File type: ${fileExtension} and file size: ${fileSize}`)
            return await mint(tokenData, walletConnection, metadataUrl);
            
          } catch (uploadToIpfsError) {
            console.error("uploadToIpfsError", uploadToIpfsError)
            
            toast.error(String(uploadToIpfsError))
            setIsUploading(false)
            return false
          }
        },
        [address, storeDocument, pinata.upload, pinataCloudGateway]
      )
      
      return {
        uploadToIpfs,
        isUploading,
        IsStored,
      }
      
}