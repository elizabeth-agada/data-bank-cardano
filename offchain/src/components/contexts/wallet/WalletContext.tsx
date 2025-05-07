import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  Address,
  LucidEvolution,
  PaymentKeyHash,
  RewardAddress,
  StakeKeyHash,
  WalletApi,
} from "@lucid-evolution/lucid";

import { Wallet } from "@/types/cardano";

export type WalletConnection = {
  lucid?: LucidEvolution;

  wallet?: Wallet;
  walletApi?: WalletApi;

  address?: Address;
  pkh?: PaymentKeyHash;

  stakeAddress?: RewardAddress;
  skh?: StakeKeyHash;
};

export const WalletContext = createContext<
  [WalletConnection, Dispatch<SetStateAction<WalletConnection>>]
>([{}, () => {}]);
export const useWallet = () => useContext(WalletContext);