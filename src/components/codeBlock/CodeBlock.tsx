import { useState, useMemo, useCallback, useContext } from "react";
import styles from "./codeBlock.module.css";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import HelpIcon from "@mui/icons-material/Help";
import LogBlock, { logElementT, outputElementT } from "../logBlock/LogBlock";
import { useFormInputTextFieldReturnT } from "../../hooks/useFormInput";
import { randomCustomFunctionInputs } from "../../typings/randomObjects";
import {
  deepCloneObjectLite,
  functionI,
  functionSettings,
  getDefaultArgObject,
  setProgressUpdate,
} from "../../functions/formFunctions";
import CustomSnackbar from "../customSnackbar/CustomSnackbar";
import SureDialog from "../surePrompt/SurePrompt";
import DeleteIcon from "@mui/icons-material/Delete";
import useSurePrompt from "../../hooks/useSurePrompt";
import useCustomSnackbar from "../../hooks/useCustomSnackbar";
import { getLatestElementDataT } from "../functionForms/FunctionForms";
import FunctionsIcon from "@mui/icons-material/Functions";

import CodeIcon from "@mui/icons-material/Code";
import { isSerializable } from "../../functions/codeBlockFunctions";
import { SmallContext } from "../../context/SmallContext";

type predefinedSettingsElementT = {
  placeHolder: string;
  type: string;
  help: string;
  parameters: ("indexOfElement" | "element" | "createdElements")[];
  uiName: string;
};

const allPredefinedCustomFunctionSettings: Record<
  "customFunction" | "customMap" | "customCompare",
  predefinedSettingsElementT
> = {
  customFunction: {
    parameters: ["indexOfElement"],
    type: "(indexOfElement: number) => unknown",
    help: "Custom function called every time items are created. Its parameter is index of the element that custom function will create. For now it must not return non-serializable variables like functions etc.",
    placeHolder:
      '// random heads or tails\n \nif( Math.random() > 0.5 )\n    return "heads";\nelse\n    return "tails";\n  ',
    uiName: "CUSTOM FUNCTION",
  },
  customMap: {
    parameters: ["element", "indexOfElement"],
    type: "(element: unknown, indexOfElement: number) => unknown",
    help: "Custom map function work after item is created. One of its parameter is created element other one is index of that element. For now it must not return non-serializable variables like functions etc.",
    placeHolder:
      '// add a country code start of a phone number\n\nreturn "+90" + element;',
    uiName: "CUSTOM MAP",
  },
  customCompare: {
    parameters: ["element", "createdElements", "indexOfElement"],
    type: "(element: unknown, createdElements: unknown[], indexOfElement: number) => boolean",
    help: "Custom compare function works after custom map if there is one, if not its works after item is created. Its parameters are current processing element, elements that are created before this item and index of this element. Its must return true if this element wanted in result, if not it must return false",
    placeHolder:
      "// remove the created string element if its length bigger than 25\n\nif( element.length > 20 )\n    return false;\nelse\n    return true;",
    uiName: "CUSTOM COMPARE",
  },
};

/*
CodeBlock 

Renders button and a popup that opens when button clicked.

JavaScript editor that uses new Function().
It does not uses web workers cause only crates 8 items.
*/

export default function CodeBlock({
  type,
  formInputData,
  getLatestElementData,
  validateForm,
}: {
  type: "customFunction" | "customMap" | "customCompare";
  formInputData:
    | useFormInputTextFieldReturnT<"custom_function">
    | useFormInputTextFieldReturnT<"custom_map">
    | useFormInputTextFieldReturnT<"custom_compare">;
  getLatestElementData: getLatestElementDataT;
  validateForm: () => boolean;
}) {
  const predefinedSettings = allPredefinedCustomFunctionSettings[type];
  const [codeBody, setCodeBody] = useState<string>(
    formInputData.inputProps.value
  );
  const [showFunctionEditor, setShowFunctionEditor] = useState(false);

  const functionEditorSurePrompt = useSurePrompt();
  const functionEditorCustomSnackbar = useCustomSnackbar();
  const buttonSurePrompt = useSurePrompt();
  const buttonCustomSnackbar = useCustomSnackbar();

  const [dialogPage, setDialogPage] = React.useState(0);

  const [logArray, setLogArray] = useState<logElementT[]>([]);
  const [outputArray, setOutputArray] = useState<outputElementT[]>([]);

  const latestElementData = useMemo(
    () => (showFunctionEditor ? getLatestElementData(false) : null),
    [showFunctionEditor]
  );

  const smallStatus = useContext(SmallContext);

  // * get functionI copy without changing any original property
  const getFunctionDataCopy: () => functionI = useCallback(() => {
    if (type === "customFunction") {
      return {
        type: "function",
        functionName: "randomCustomFunction",
        argObject: getDefaultArgObject("randomCustomFunction"),
      } as functionI;
    } else {
      return deepCloneObjectLite(latestElementData) as functionI;
    }
  }, [latestElementData]);

  const initialCodeCheck = () => {
    if (latestElementData === null) {
      functionEditorCustomSnackbar.showSnackbar(
        "error",
        "Unknown error occurred, try closing and opening function editor."
      );
      return false;
    }

    if (codeBody.length === 0) {
      functionEditorCustomSnackbar.showSnackbar(
        "error",
        "There is no code to run."
      );
      return false;
    }

    return true;
  };

  const runCode: (isTestRun: boolean) => boolean = (isTestRun) => {
    if (!initialCodeCheck) return false;

    if (!isTestRun) {
      setLogArray([]);
      setDialogPage(1);
    }

    let createdFunction:
      | ((index: number) => unknown)
      | ((item: unknown, index: number) => unknown)
      | ((item: unknown, items: unknown[], index: number) => boolean);

    // * create the function
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      createdFunction = new Function(
        predefinedSettings.parameters.join(","),
        codeBody
      ) as typeof createdFunction;
    } catch (error) {
      if (!isTestRun)
        setLogArray([{ colorVariant: "error", log: (error as Error).message }]);
      functionEditorCustomSnackbar.showSnackbar(
        "error",
        (error as Error).message
      );
      return false;
    }

    const functionDataCopy: functionI = getFunctionDataCopy();

    // * set needed extra properties
    functionDataCopy.argObject.options.numberOfItems = 8;
    functionDataCopy.argObject.options.showLogs = true;
    functionDataCopy.argObject.options.unique = false;
    functionDataCopy.argObject.options.reCreateLimit = 50;

    // * set the actual function properties
    switch (type) {
      case "customMap":
        functionDataCopy.argObject.options.customMap = createdFunction as (
          item: unknown,
          index: number
        ) => unknown;
        break;

      case "customCompare":
        functionDataCopy.argObject.options.customCompare = createdFunction as (
          item: unknown,
          items: unknown[],
          index: number
        ) => boolean;
        break;

      case "customFunction":
        (
          functionDataCopy.argObject.inputs as randomCustomFunctionInputs
        ).customFunction = createdFunction as (index: number) => unknown;
        break;
      default:
        break;
    }

    // * if it isnt test run setProgressUpdate to show logs to user
    if (!isTestRun) setProgressUpdate(setLogArray, functionDataCopy);

    // * run the created function, and set outputValues
    try {
      const functionSettingIndex = functionSettings.findIndex(
        (e) => e.name === functionDataCopy.functionName
      );

      if (functionSettingIndex === -1) return false;

      let values = functionSettings[functionSettingIndex].functionCall(
        functionDataCopy.argObject
      ) as unknown[];

      if (!isSerializable(values)) {
        functionEditorCustomSnackbar.showSnackbar(
          "error",
          "It seems like you are trying return non-serializable variables which isn't supported."
        );
        return false;
      }

      // * remove non-serializable variables
      values = JSON.parse(JSON.stringify(values)) as unknown[];

      if (!isTestRun)
        setOutputArray(
          values.map((e, i) => {
            return { index: i, element: e };
          })
        );
    } catch (error) {
      if (!isTestRun) {
        setLogArray([{ colorVariant: "error", log: (error as Error).message }]);
      }
      functionEditorCustomSnackbar.showSnackbar(
        "error",
        (error as Error).message
      );
      return false;
    }

    // * show success snackbar
    if (!isTestRun)
      functionEditorCustomSnackbar.showSnackbar(
        "success",
        "Code successfully worked."
      );

    return true;
  };

  // * remove created function from formInputData
  const removeCreatedFunction = () => {
    if (formInputData.inputProps.value.trim().length === 0) {
      if (codeBody.length > 0) {
        functionEditorCustomSnackbar.showSnackbar(
          "info",
          "There is not a saved code."
        );
      } else
        functionEditorCustomSnackbar.showSnackbar(
          "info",
          "It is already removed."
        );

      return;
    }

    const title = "Remove Function";
    const message = "Are you certain you want to remove this function?";

    buttonSurePrompt.showPrompt(
      title,
      message,
      () => {
        formInputData.setValue("");
        setCodeBody("");
        setOutputArray([]);
        setLogArray([]);
        buttonCustomSnackbar.showSnackbar(
          "success",
          "Code successfully removed."
        );
      },
      undefined
    );
  };

  // * is there any change in code ask for confirmation
  const handleCloseFunctionEditor = () => {
    if (codeBody !== formInputData.inputProps.value) {
      functionEditorSurePrompt.showPrompt(
        "Close Function Editor",
        "Do you want to close the function editor without saving changes? Any unsaved progress will be lost.",
        () => {
          setCodeBody(formInputData.inputProps.value);
          setOutputArray([]);
          setLogArray([]);
          setShowFunctionEditor(false);
        },
        undefined
      );
    } else setShowFunctionEditor(false);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setDialogPage(newValue);
  };

  const saveHandle = () => {
    if (codeBody.length > 0 && codeBody === formInputData.inputProps.value) {
      functionEditorCustomSnackbar.showSnackbar(
        "success",
        "Code is already saved."
      );
    }
    if (runCode(true)) {
      functionEditorCustomSnackbar.showSnackbar(
        "success",
        "Code successfully saved."
      );
      formInputData.setValue(codeBody);
      formInputData.setShowError(false);
    }
  };

  const getButtonColor: () => "error" | "secondary" | "primary" = () => {
    if (formInputData.inputProps.error) return "error";
    else if (formInputData.inputProps.value.length > 0) return "secondary";
    else return "primary";
  };

  const dialogPageContent = useMemo(
    () =>
      getDialogPageContent(
        codeBody,
        dialogPage,
        logArray,
        outputArray,
        predefinedSettings,
        setCodeBody
      ),
    [codeBody, dialogPage, logArray, outputArray, predefinedSettings]
  );

  return (
    <>
      <div>
        <Button
          variant="outlined"
          onClick={() => {
            // * validate form it is not customFunction
            if (type === "customFunction" || validateForm()) {
              setShowFunctionEditor(true);
              setDialogPage(0);
            }
          }}
          color={getButtonColor()}
          endIcon={<CodeIcon></CodeIcon>}
        >
          {type}
        </Button>
        <CustomSnackbar
          {...buttonCustomSnackbar.customSnackbarProps}
        ></CustomSnackbar>
        {formInputData.inputProps.value.length > 0 && (
          <>
            <IconButton onClick={() => removeCreatedFunction()}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
            <SureDialog {...buttonSurePrompt.surePromptProps}></SureDialog>
          </>
        )}
      </div>
      <span style={{ color: "var(--error)" }}>
        {formInputData.inputProps.helperText}
      </span>

      <Dialog
        onClose={handleCloseFunctionEditor}
        open={showFunctionEditor}
        maxWidth={"md"}
        fullScreen={smallStatus === "<500"}
        fullWidth
        scroll="body"
      >
        <CustomSnackbar
          {...functionEditorCustomSnackbar.customSnackbarProps}
        ></CustomSnackbar>
        <SureDialog {...functionEditorSurePrompt.surePromptProps}></SureDialog>
        <DialogTitle>
          <Box className={styles.topPart}>
            {smallStatus === "<1000" || smallStatus === "<500"
              ? "JS Editor"
              : "JavaScript Function Editor"}
            <ButtonGroup variant="contained">
              <IconButton color="success" onClick={() => runCode(false)}>
                <PlayArrowIcon></PlayArrowIcon>
              </IconButton>
              <IconButton color="primary" onClick={saveHandle}>
                <SaveIcon></SaveIcon>
              </IconButton>
              <IconButton color="error" onClick={removeCreatedFunction}>
                <DeleteIcon></DeleteIcon>
              </IconButton>
              <IconButton onClick={handleCloseFunctionEditor}>
                <CloseIcon></CloseIcon>
              </IconButton>
            </ButtonGroup>
          </Box>
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={dialogPage} onChange={handleChange}>
            <Tab label="FUNCTION" />
            <Tab label="LOGS" disabled={logArray.length === 0 ? true : false} />
            <Tab
              label="OUTPUT"
              disabled={outputArray.length === 0 ? true : false}
            />
          </Tabs>
        </Box>
        <DialogContent id={styles.mainContainer}>
          {dialogPageContent}
        </DialogContent>
      </Dialog>
    </>
  );
}

const getDialogPageContent = (
  codeBody: string,
  dialogPage: number,
  logArray: logElementT[],
  outputArray: outputElementT[],
  predefinedSettings: predefinedSettingsElementT,
  setCodeBody: React.Dispatch<React.SetStateAction<string>>
) => {
  if (dialogPage === 0) {
    // * function body
    return (
      <Container>
        <Box className={styles.FBTopPart}>
          <p className="title">{predefinedSettings.uiName}</p>
          <Box>
            <Tooltip
              arrow
              title={
                <div className="title" style={{ fontSize: "1rem" }}>
                  {predefinedSettings.type}
                </div>
              }
            >
              <IconButton>
                <FunctionsIcon></FunctionsIcon>
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              title={
                <div className="title" style={{ fontSize: "1rem" }}>
                  {predefinedSettings.help}
                </div>
              }
            >
              <IconButton>
                <HelpIcon></HelpIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TextField
          multiline
          rows={18}
          sx={{ width: "100%" }}
          placeholder={predefinedSettings.placeHolder}
          value={codeBody}
          onChange={(e) => {
            setCodeBody(e.target.value);
          }}
        ></TextField>
      </Container>
    );
  } else if (dialogPage === 1) {
    // * log part
    return (
      <div
        style={{ height: "487px", overflow: "scroll" }}
        className={styles.logs}
      >
        <LogBlock type="log" listArray={logArray}></LogBlock>
      </div>
    );
  } else if (dialogPage === 2) {
    // * output part
    return (
      <div
        style={{ height: "487px", overflow: "scroll" }}
        className={styles.logs}
      >
        <LogBlock type="output" listArray={outputArray}></LogBlock>
      </div>
    );
  }
  return <></>;
};
