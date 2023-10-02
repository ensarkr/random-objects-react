import { createContext } from "react";
import { vaultI } from "../functions/vaultFunctions";

export const VaultContext = createContext<vaultI | null>(null);
export const SetVaultContext = createContext<React.Dispatch<
  React.SetStateAction<vaultI | null>
> | null>(null);
