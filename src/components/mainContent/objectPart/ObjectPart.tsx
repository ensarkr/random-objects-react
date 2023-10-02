import { Paper } from "@mui/material";
import { blueprintElementI } from "../../../functions/blueprintFunctions";
import BlueprintContainer from "./blueprintContainer/BlueprintContainer";
import styles from "./objectPart.module.css";
import { memo } from "react";
import ResultObjectPart from "./resultObjectPart/ResultObjectPart";

const BlueprintContainer_Memo = memo(BlueprintContainer);
const ResultObjectPart_Memo = memo(ResultObjectPart);

export default function ObjectsPart({
  blueprint,
  setBlueprint,
  openVaultFromBlueprint,
}: {
  blueprint: blueprintElementI[];
  setBlueprint: React.Dispatch<React.SetStateAction<blueprintElementI[]>>;
  openVaultFromBlueprint: () => void;
}) {
  return (
    <>
      <Paper
        variant="elevation"
        elevation={1}
        className={styles["blueprintContainerDiv"]}
      >
        <BlueprintContainer_Memo
          blueprint={blueprint}
          setBlueprint={setBlueprint}
          openVaultFromBlueprint={openVaultFromBlueprint}
        ></BlueprintContainer_Memo>
      </Paper>

      <Paper
        variant="elevation"
        elevation={1}
        className={styles["resultPartDiv"]}
      >
        <ResultObjectPart_Memo
          blueprint={blueprint}
          setBlueprint={setBlueprint}
        ></ResultObjectPart_Memo>
      </Paper>
    </>
  );
}
