import { Address, Json, PolicyId } from "@lucid-evolution/lucid";

import { req } from "@/components/utils";

const post = async (path: string, body: Json) =>
  req(path, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(body),
  });

export const koios = {
  queryAddressAssets: async (address: Address, byPolicyID: PolicyId) => {
    const assets = await post(
      "/koios/address_assets?select=policy_id,asset_name",
      { _addresses: [address] },
    );

    return assets
      .filter((asset: Json) => asset.policy_id === byPolicyID)
      .map((asset: Json) => [asset.policy_id, asset.asset_name]);
  },

  queryAssetInformation: async (assetList: [PolicyId, string]) =>
    post("/koios/asset_info", { _asset_list: assetList }),
  queryAssetUTXOs: async (assetList: [PolicyId, string]) =>
    post("/koios/asset_utxos", { _asset_list: assetList, _extended: true }),
};