/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useContext, useCallback, useMemo } from "react";
import { blueprintElementI } from "../../../../../functions/blueprintFunctions";
import styles from "./blueprintElement.module.css";
import {
  allFunctionNames,
  functionI,
  functionI_STR,
  functionSettings,
} from "../../../../../functions/formFunctions";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useFormInputTextField } from "../../../../../hooks/useFormInput";
import { VaultContext } from "../../../../../context/VaultContext";
import SaveIcon from "@mui/icons-material/Save";
import { setBlueprintElementT } from "../BlueprintContainer";
import { getBlueprintElement } from "../../../../../functions/vaultFunctions";
import FunctionForms from "../../../../functionForms/FunctionForms";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import { SmallContext } from "../../../../../context/SmallContext";
import VaultNoAccess from "../../../../errorDiv/ErrorDiv";

export type saveArgsT = (functionData: functionI) => void;

type saveStaticValueT = (
  staticValue: string,
  savedElementData: blueprintElementI
) => void;

/*
BlueprintElement 

Renders key, value and remove.
Key is input.
Values is button that opens popup to write static value of choose one of the generator functions.
Remove is button delete element.

It has multiple function save key, value and remove.
*/

export default function BlueprintElement({
  savedElementData,
  setBlueprintElement,
}: {
  readonly savedElementData: blueprintElementI;
  setBlueprintElement: setBlueprintElementT;
}) {
  const [showForm, setShowForm] = useState(false);

  const buttonColor: "error" | "primary" = savedElementData.emptyErrorValue
    ? "error"
    : "primary";

  const keyInput = useFormInputTextField(
    "key",
    "string",
    savedElementData.key,
    undefined
  );

  const keyInputError =
    savedElementData.duplicateKey || savedElementData.emptyErrorKey;

  const buttonText = savedElementData.buttonText || "value";

  const keyInputHelperText = savedElementData.duplicateKey
    ? "Multiple elements cannot have same name."
    : savedElementData.emptyErrorKey
    ? "This input cannot be empty"
    : " ";

  const staticValueInput = useFormInputTextField(
    "static value",
    "string",
    savedElementData.valueData.type === "static"
      ? savedElementData.valueData.staticValue
      : undefined,
    undefined
  );

  // * if there is a function name in savedElementData when BlueprintElement is created setFormName
  const [formName, setFormName] = useState<allFunctionNames | null>(
    savedElementData.valueData.type === "function"
      ? savedElementData.valueData.functionName
      : null
  );

  const [mainDialogPage, setMainDialogPage] = useState<
    "staticPage" | "functionPage"
  >(
    savedElementData.valueData.type === "function"
      ? "functionPage"
      : "staticPage"
  );

  // * bookmark states set when user chooses function button
  // * bookmarkedFunctionData has priority on inputs initial value
  const [bookmarkedFunctionData, setBookmarkedFunctionData] = useState<
    functionI_STR | undefined
  >(undefined);
  const [bookmarkedTitle, setBookmarkedTitle] = useState<string | undefined>(
    undefined
  );

  const saveArgs: saveArgsT = useCallback(
    (functionData) => {
      let buttonText = "value";

      // * if users clicks save in bookmark forms without changing any input, do not change button title(keep bookmarks title)
      // * else get default ui name and reset bookmark states
      if (
        bookmarkedTitle &&
        bookmarkedFunctionData &&
        JSON.stringify(functionData.argObject_STR) ===
          JSON.stringify(bookmarkedFunctionData.argObject_STR)
      ) {
        buttonText = bookmarkedTitle;
      } else {
        setBookmarkedFunctionData(undefined);
        setBookmarkedTitle(undefined);

        const functionSettingIndex = functionSettings.findIndex(
          (e) => e.name === functionData.functionName
        );

        if (functionSettingIndex !== -1)
          buttonText = functionSettings[functionSettingIndex].uiName;
      }

      setBlueprintElement({
        ...savedElementData,
        valueData: functionData,
        emptyErrorValue: false,
        buttonText: buttonText,
      });

      backToBlueprint();
    },
    [
      bookmarkedFunctionData,
      bookmarkedTitle,
      savedElementData,
      setBlueprintElement,
    ]
  );

  const saveStaticValue: saveStaticValueT = useCallback(
    (staticValue: string, savedElementData: blueprintElementI) => {
      setBlueprintElement({
        ...savedElementData,
        valueData: {
          type: "static",
          staticValue: staticValue,
        },
        emptyErrorValue: false,

        buttonText:
          staticValue.length > 30
            ? staticValue.slice(0, 27) + "..."
            : staticValue,
      });

      backToBlueprint();
    },
    [setBlueprintElement]
  );

  function saveKey(key: string) {
    setBlueprintElement(
      {
        ...savedElementData,
        key,
        emptyErrorKey: false,
      },
      true
    );
  }

  function backToStaticPage() {
    setBookmarkedFunctionData(undefined);
    setMainDialogPage("staticPage");
  }
  function goToFunctionPage(formName: allFunctionNames) {
    setFormName(formName);
    setMainDialogPage("functionPage");
  }

  function backToBlueprint() {
    setShowForm(false);
  }

  const [tabPage, setTabPage] = useState<number>(0);

  const testFunctionDataOrigin: (
    formName: allFunctionNames | null,
    savedElementData: blueprintElementI
  ) => functionI | undefined = (formName, savedElementData) => {
    if (
      savedElementData.valueData.type === "function" &&
      savedElementData.valueData.functionName === formName
    )
      return savedElementData.valueData;
    else return undefined;
  };

  const vault = useContext(VaultContext);
  const SmallStatus = useContext(SmallContext);

  const showSaveStaticValue =
    (savedElementData.valueData.type === "static" &&
      staticValueInput.inputProps.value !==
        savedElementData.valueData.staticValue) ||
    (savedElementData.valueData.type !== "static" &&
      staticValueInput.inputProps.value.trim().length > 0);

  const dialogPageContent = useMemo(() => {
    if (mainDialogPage === "staticPage") {
      return (
        <>
          <Box className={styles.staticPageBox}>
            <Box className="flexSpaceBetween">
              <IconButton
                onClick={() => {
                  backToBlueprint();
                }}
              >
                <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
              </IconButton>
              <IconButton
                onClick={() => {
                  backToBlueprint();
                }}
              >
                <CloseIcon></CloseIcon>
              </IconButton>
            </Box>

            <span className={styles.staticPageTitle}>
              USE STATIC VALUE OR CHOOSE A FUNCTION
            </span>

            <TextField
              className={styles.textInput}
              label="static value"
              variant="standard"
              type="text"
              margin="dense"
              {...staticValueInput.inputProps}
              InputProps={
                showSaveStaticValue
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              if (staticValueInput.validateInput(true))
                                saveStaticValue(
                                  staticValueInput.getRealValue(false),
                                  savedElementData
                                );
                            }}
                          >
                            <SaveIcon></SaveIcon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
            ></TextField>
            <Divider></Divider>

            <Tabs
              value={tabPage}
              onChange={(_e, v) => {
                setTabPage(v as number);
              }}
              className="secondaryIndicator"
            >
              <Tab label="fundamental" />
              <Tab label="specific" />
              <Tab label="vault" />
            </Tabs>
            <Stack
              spacing={1}
              className={["choicesScroll", styles.choicesBlueprint].join(" ")}
            >
              {tabPage === 0 &&
                functionSettings
                  .filter((e) => e.type === "fundamental")
                  .map((e) => (
                    <Button
                      variant="outlined"
                      key={e.name}
                      onClick={() => {
                        goToFunctionPage(e.name);
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
                      onClick={() => {
                        goToFunctionPage(e.name);
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
                      onClick={() => {
                        const bookmarkElement = getBlueprintElement(
                          vault,
                          e.title
                        );
                        if (bookmarkElement === null) return;
                        setBookmarkedFunctionData({
                          ...bookmarkElement,
                        });
                        setBookmarkedTitle(e.title);
                        goToFunctionPage(bookmarkElement.functionName);
                      }}
                    >
                      {e.title}
                    </Button>
                  ))
                ))}
            </Stack>
          </Box>
        </>
      );
    } else if (mainDialogPage === "functionPage") {
      return (
        <>
          <Box className="flexSpaceBetween">
            <IconButton
              onClick={() => {
                backToStaticPage();
              }}
            >
              <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
            </IconButton>
            <IconButton
              onClick={() => {
                backToBlueprint();
              }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
          <FunctionForms
            functionName={formName}
            saveArgs={saveArgs}
            savedFunctionData={testFunctionDataOrigin(
              formName,
              savedElementData
            )}
            bookmarkedFunctionData={bookmarkedFunctionData}
          ></FunctionForms>
        </>
      );
    } else return <></>;
  }, [
    bookmarkedFunctionData,
    formName,
    mainDialogPage,
    saveArgs,
    saveStaticValue,
    savedElementData,
    showSaveStaticValue,
    staticValueInput,
    tabPage,
    vault,
  ]);

  return (
    <>
      <div className={styles.blueprintElement}>
        <TextField
          className={styles.textInput}
          label="KEY"
          variant="outlined"
          type="text"
          margin="none"
          {...keyInput.inputProps}
          error={keyInput.inputProps.error || keyInputError}
          helperText={keyInput.inputProps.helperText || keyInputHelperText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            keyInput.inputProps.onChange(event);
            saveKey(event.target.value);
          }}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            keyInput.inputProps.onBlur(event);
            if (event.target.value.length > 0) {
              setBlueprintElement({
                ...savedElementData,
                emptyErrorKey: false,
              });
            } else {
              setBlueprintElement({
                ...savedElementData,
                emptyErrorKey: true,
              });
            }
          }}
          // * when there is a error blueprintContainer will put margin to bottom of this blueprintElement
          sx={{
            "&  .MuiFormHelperText-root": {
              overflow: "visible",
              wordBreak: "keep-all",
              position: "absolute",
              whiteSpace: "nowrap",
              top: "57px",
            },
          }}
        ></TextField>

        <Button
          variant="outlined"
          className={styles.valueButton}
          color={buttonColor}
          onClick={() => {
            setFormName(
              savedElementData.valueData.type === "function"
                ? savedElementData.valueData.functionName
                : null
            );
            setMainDialogPage(
              savedElementData.valueData.type === "function"
                ? "functionPage"
                : "staticPage"
            );
            staticValueInput.setValue(
              savedElementData.valueData.type === "static"
                ? savedElementData.valueData.staticValue
                : ""
            );
            setShowForm(true);
          }}
        >
          {buttonText}
        </Button>

        <Dialog
          onClose={() => backToBlueprint()}
          open={showForm}
          maxWidth={"sm"}
          fullScreen={SmallStatus === "<500"}
          fullWidth
          scroll="body"
        >
          <DialogContent>{dialogPageContent}</DialogContent>
        </Dialog>
      </div>
    </>
  );
}
