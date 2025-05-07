import { Data } from "@lucid-evolution/lucid";

export const Cip68Schema = Data.Object({
  metadata: Data.Map(Data.Bytes(), Data.Any()),
  version: Data.Integer(),
  extra: Data.Any(),
});
export type Cip68Metadatum = Data.Static<typeof Cip68Schema>;
export const Cip68Metadatum = Cip68Schema as unknown as Cip68Metadatum;