use cardano/transaction.{OutputReference}

pub type Action {
  Mint(NonceUTxO)
  Update(UsrTokenInputIdx)
  Burn
}

type NonceUTxO =
  OutputReference

type UsrTokenInputIdx =
  Int