/* eslint-disable @typescript-eslint/ban-types */
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { useState, useContext, memo } from "react";
import { VaultContext } from "../../../context/VaultContext";

import {
  allFunctionNames,
  functionI,
  functionI_STR,
  functionSettings,
} from "../../../functions/formFunctions";
import { getBlueprintElement } from "../../../functions/vaultFunctions";
import FunctionForms from "../../functionForms/FunctionForms";
import { chosenButtonI } from "../MainContent";
import React from "react";
import styles from "./valuePart.module.css";
import { valueDataI } from "../../../functions/blueprintFunctions";
import CloseIcon from "@mui/icons-material/Close";
import VaultNoAccess from "../../errorDiv/ErrorDiv";
import { SmallContext } from "../../../context/SmallContext";
import ResultValuePart from "./resultValuePart/ResultValuePart";

export interface functionElementI {
  name: allFunctionNames;
  uiName: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  functionCall: Function;
}
[];

type saveArgsT = (functionData: functionI) => void;

const ResultValuePart_Memo = memo(ResultValuePart);

export default function ValuePart({
  savedValueData,
  setSavedValueData,
  chosenButton,
  setChosenButton,
  tabPage,
  setTabPage,
}: {
  readonly savedValueData: valueDataI;
  setSavedValueData: React.Dispatch<React.SetStateAction<valueDataI>>;
  chosenButton: chosenButtonI;
  setChosenButton: React.Dispatch<React.SetStateAction<chosenButtonI>>;
  tabPage: number;
  setTabPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [showForm, setShowForm] = useState(false);

  const [formName, setFormName] = useState<allFunctionNames | null>(
    savedValueData.type === "function" ? savedValueData.functionName : null
  );

  const smallStatus = useContext(SmallContext);

  const [bookmarkedValueData, setBookmarkedValueData] = useState<
    functionI_STR | undefined
  >(undefined);
  const [bookmarkedTitle, setBookmarkedTitle] = useState<string | undefined>(
    undefined
  );

  const saveArgs: saveArgsT = (functionData) => {
    setSavedValueData(functionData);

    // * bookmark states exists and argObjects did not change keep chose button
    if (
      bookmarkedValueData &&
      JSON.stringify(functionData.argObject_STR) ===
        JSON.stringify(bookmarkedValueData.argObject_STR)
    ) {
      if (bookmarkedTitle)
        setChosenButton({ type: "vault", name: bookmarkedTitle });
    } else {
      setBookmarkedValueData(undefined);
      setBookmarkedTitle(undefined);
      setChosenButton({ type: "normal", name: functionData.functionName });
    }

    setShowForm(false);
  };

  function backToValuePart() {
    setBookmarkedValueData(undefined);
    setShowForm(false);
  }

  const testFunctionDataOrigin: (
    functionName: allFunctionNames | null
  ) => functionI | undefined = (functionName) => {
    if (
      savedValueData.type === "function" &&
      savedValueData.functionName === functionName
    )
      return savedValueData;
    else return undefined;
  };

  const vault = useContext(VaultContext);

  return (
    <>
      <Paper className={styles["choicesDiv"]}>
        <div className={styles.valuePartTitle}>{"FUNCTIONS"}</div>
        <Tabs
          value={tabPage}
          onChange={(_e, v) => {
            setTabPage(v as number);
          }}
          className={["secondaryIndicator", styles.marginBottom].join(" ")}
        >
          <Tab label="fundamental" />
          <Tab label="specific" />
          <Tab label="vault" />
        </Tabs>

        <Stack
          spacing={1}
          className={["choicesScroll", styles.choicesValue].join(" ")}
        >
          {tabPage === 0 &&
            functionSettings
              .filter((e) => e.type === "fundamental")
              .map((e) => (
                <Button
                  variant="outlined"
                  key={e.name}
                  color={
                    chosenButton.type === "normal" &&
                    chosenButton.name === e.name
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => {
                    setFormName(e.name);
                    setShowForm(true);
                  }}
                >
                  {e.uiName}
                </Button>
              ))}

          {tabPage === 1 &&
            functionSettings
              .filter((e) => e.type === "specific")
              .map((e) => (
                <Button
                  variant="outlined"
                  key={e.name}
                  color={
                    chosenButton.type === "normal" &&
                    chosenButton.name === e.name
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => {
                    setFormName(e.name);
                    setShowForm(true);
                  }}
                >
                  {e.uiName}
                </Button>
              ))}

          {tabPage === 2 &&
            (vault === null ? (
              <VaultNoAccess type="noAccessVault" />
            ) : vault.savedBlueprintElements.length === 0 ? (
              <VaultNoAccess type="noElementVault" />
            ) : (
              vault.savedBlueprintElements.map((e) => (
                <Button
                  variant="outlined"
                  key={e.title}
                  color={
                    chosenButton.type === "vault" &&
                    chosenButton.name === e.title
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => {
                    const bookmarkElement = getBlueprintElement(vault, e.title);
                    if (bookmarkElement === null) return;
                    setShowForm(true);
                    setFormName(bookmarkElement.functionName);
                    setBookmarkedValueData(bookmarkElement);
                    setBookmarkedTitle(e.title);
                  }}
                >
                  {e.title}
                </Button>
              ))
            ))}
        </Stack>
      </Paper>
      <Paper className={styles["resultDiv"]}>
        <ResultValuePart_Memo
          functionData={savedValueData}
        ></ResultValuePart_Memo>
      </Paper>

      <Dialog
        onClose={() => backToValuePart()}
        open={showForm}
        maxWidth={"sm"}
        fullScreen={smallStatus === "<500"}
        fullWidth
      >
        <DialogContent>
          <Box className={"flexEnd"}>
            <IconButton
              onClick={() => {
                backToValuePart();
              }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>

          <FunctionForms
            functionName={formName}
            saveArgs={saveArgs}
            savedFunctionData={testFunctionDataOrigin(formName)}
            bookmarkedFunctionData={bookmarkedValueData}
          ></FunctionForms>
        </DialogContent>
      </Dialog>
    </>
  );
}
