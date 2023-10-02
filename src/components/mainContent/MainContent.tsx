import { memo, useCallback, useState } from "react";
import ObjectPart from "./objectPart/ObjectPart";
import { getVault, vaultI } from "../../functions/vaultFunctions";
import {
  blueprintElementI,
  valueDataI,
} from "../../functions/blueprintFunctions";
import styles from "./mainContent.module.css";
import stylesFromValuePartCss from "./valuePart/valuePart.module.css";
import stylesFromObjectPartCss from "./objectPart/objectPart.module.css";
import VaultSidebar from "./vaultSidebar/VaultSidebar";
import ValuePart from "./valuePart/ValuePart";
import { VaultContext, SetVaultContext } from "../../context/VaultContext";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../navbar/Navbar";

export type chosenButtonI = {
  type: "normal" | "vault" | null;
  name: string | null;
};

export type mainPagesT = "object" | "value";

const ValuePart_Memo = memo(ValuePart);
const ObjectPart_Memo = memo(ObjectPart);

export default function MainContent() {
  const [vault, setVault] = useState<vaultI | null>(getVault());
  const [valuePart, setValuePart] = useState<valueDataI>({
    type: "empty",
  });

  const [chosenButton, setChosenButton] = useState<chosenButtonI>({
    type: null,
    name: null,
  });

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [blueprint, setBlueprint] = useState<blueprintElementI[]>([
    {
      id: uuidv4(),
      key: "",
      valueData: { type: "empty" },
      duplicateKey: false,
      buttonText: "value",
    },
  ]);
  const [currentPage, setCurrentPage] = useState<mainPagesT>("object");
  const [valuePartFunctionsTabPage, setValuePartFunctionsTabPage] =
    useState<number>(0);

  const openVaultFromBlueprint = useCallback(() => {
    setShowSidebar(true);
  }, []);

  return (
    <main className={styles.mainContent}>
      <VaultContext.Provider value={vault}>
        <SetVaultContext.Provider value={vault === null ? null : setVault}>
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          ></Navbar>

          <VaultSidebar
            blueprint={blueprint}
            setBlueprint={setBlueprint}
            valuePart={valuePart}
            setValuePart={setValuePart}
            setChosenButton={setChosenButton}
            setMainPage={setCurrentPage}
            setValuePartFunctionsTabPage={setValuePartFunctionsTabPage}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          ></VaultSidebar>

          <div
            style={{ display: currentPage === "value" ? "" : "none" }}
            className={stylesFromValuePartCss.valuePart}
          >
            <ValuePart_Memo
              savedValueData={valuePart}
              setSavedValueData={setValuePart}
              chosenButton={chosenButton}
              setChosenButton={setChosenButton}
              tabPage={valuePartFunctionsTabPage}
              setTabPage={setValuePartFunctionsTabPage}
            ></ValuePart_Memo>
          </div>
          <div
            style={{ display: currentPage === "object" ? "" : "none" }}
            className={stylesFromObjectPartCss.objectsPart}
          >
            <ObjectPart_Memo
              blueprint={blueprint}
              setBlueprint={setBlueprint}
              openVaultFromBlueprint={openVaultFromBlueprint}
            ></ObjectPart_Memo>
          </div>
        </SetVaultContext.Provider>
      </VaultContext.Provider>
    </main>
  );
}
