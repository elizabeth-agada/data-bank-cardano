import { UTxO } from "@lucid-evolution/lucid";

export type Token = {
  name: string;
  image: string;
  utxo: UTxO;
  assetName: string;
  metadata: {
    [key: string]: unknown;
  };
};