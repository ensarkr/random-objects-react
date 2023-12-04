import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  FormControl,
  FormLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Divider,
} from "@mui/material";
import { useContext, useMemo } from "react";
import {
  randomNumbersArgObjectI,
  getDefaultArgObject,
  gradualValueArgObjectI,
  randomsFromArrayArgObjectI,
  randomIDsArgObjectI,
  randomCustomFunctionArgObjectI,
  randomStringsArgObjectI,
  fromBlueprintArgObjectI,
  randomArraysArgObjectI,
  allFunctionNames,
  randomEmailArgObjectI,
  functionI,
  functionI_STR,
  functionSettings,
} from "../../functions/formFunctions";
import useBaseOptions from "../../hooks/useBaseOptions";
import {
  useFormInputTextField,
  useFormInputTextFieldReturnT,
  useFormInputCheck,
  useFormInputSelectBlueprint,
  useFormInputMultipleChecks,
} from "../../hooks/useFormInput";
import BookmarkBlock from "../bookmarkBlock/BookmarkBlock";
import CodeBlock from "../codeBlock/CodeBlock";
import styles from "./functionForms.module.css";
import { VaultContext } from "../../context/VaultContext";
import { saveArgsT } from "../mainContent/objectPart/blueprintContainer/blueprintElement/BlueprintElement";

interface formProps {
  saveArgs: saveArgsT;
  savedFunctionData: functionI | undefined;
  bookmarkedFunctionData: functionI_STR | undefined;
}

/*
FunctionForms

Returns function forms based on functionName prop.
Drills other props to forms without any modification.  
*/

export default function FunctionForms({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
  functionName,
}: formProps & {
  functionName: allFunctionNames | null;
}) {
  switch (functionName) {
    case "randomNumbers":
      return (
        <RandomNumbersForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomNumbersForm>
      );

    case "gradualValue":
      return (
        <GradualValueForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></GradualValueForm>
      );

    case "randomsFromArray":
      return (
        <RandomsFromArrayForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomsFromArrayForm>
      );

    case "randomIDs":
      return (
        <RandomIDsForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomIDsForm>
      );

    case "randomCustomFunction":
      return (
        <RandomCustomFunctionForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomCustomFunctionForm>
      );

    case "randomStrings":
      return (
        <RandomStringsForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomStringsForm>
      );

    case "fromBlueprint":
      return (
        <FromBlueprintForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></FromBlueprintForm>
      );

    case "randomArrays":
      return (
        <RandomArraysForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomArraysForm>
      );
    case "randomEmail":
      return (
        <RandomEmailForm
          saveArgs={saveArgs}
          savedFunctionData={savedFunctionData}
          bookmarkedFunctionData={bookmarkedFunctionData}
        ></RandomEmailForm>
      );

    default:
      return <></>;
  }
}

export type getLatestElementDataT = (
  runValidation: boolean
) => functionI | null;

export type getLatestElementDataT_STR = (
  runValidation: boolean
) => functionI_STR | null;

export type validateFormT = () => boolean;

/*
RandomNumbersForm (applies all forms below)

Renders form for saving generator options and bookmark block to save it to vault.
It saves using saveArgs prop.
saveArgs prop saves the blueprint element.

Functions
1. getLatestElementData 
Used for getting latest form inputs plus function metadata.
Used as a input when calling saveArgs prop.
Return inputs both as string (passing it to web workers or store it in localStorage) 
and normal value (used by codeblocks).

2. getLatestElementData_STR 
Used for getting latest form inputs as string plus function metadata.
Used by bookmarkBlock to save it to vault

3. getArgObject_STR
Used for getting latest form inputs.
Used by first two function.

4. validateForms 
Checks form if its processable by generator functions or code blocks.

5. getInitialTitle
Gets initial title for bookmark title

Also it populates populatable inputs.

Input Populate Order
1. bookmarkedFunctionData prop   
bookmarkedFunctionData comes from vault and managed by blueprintElement.
Its checked in RandomNumbersForm if its have the same functionName or not.

2. savedFunctionData prop
savedFunctionData comes from blueprintElement.
Its set in RandomNumbersForm by using saveArgs.

3. getDefaultArgObject function
Returns default options for given function functionName.

4. If its undefined its handled by input hooks.(Mostly will be empty string.)
*/

function RandomNumbersForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  // * getDefaultArgObject fill empty inputs
  const defaultArgObject: randomNumbersArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomNumbers");
  }, []);

  // * if there is a saved data use it if not use defaultArgObject
  const argObjectMemo: randomNumbersArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomNumbersArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  // * if bookmarkedFunctionData has same function name with this form use that bookmarkedFunctionData if not return undefined
  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomNumbers"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const starting = useFormInputTextField(
    "starting number",
    "float",
    argObjectMemo.inputs.starting,
    bookmarkedFunctionDataArgObj?.inputs.starting
  );
  const ending = useFormInputTextField(
    "ending number",
    "float",
    argObjectMemo.inputs.ending,
    bookmarkedFunctionDataArgObj?.inputs.ending
  );
  const maximumDigitsAfterPoint = useFormInputTextField(
    "maximum digits after the point",
    "non_negative_integer",
    argObjectMemo.options.maximumDigitsAfterPoint,
    bookmarkedFunctionDataArgObj?.options.maximumDigitsAfterPoint
  );
  const onlyIntegers = useFormInputCheck(
    argObjectMemo.options.onlyIntegers,
    bookmarkedFunctionDataArgObj?.options.onlyIntegers
  );
  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI = {
        functionName: "randomNumbers",
        type: "function",
        argObject: {
          inputs: {
            starting: starting.getRealValue(false),
            ending: ending.getRealValue(false),
          },
          options: {
            maximumDigitsAfterPoint:
              maximumDigitsAfterPoint.getRealValue(false),
            onlyIntegers: onlyIntegers.getRealValue(),
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        starting: starting.inputProps.value,
        ending: ending.inputProps.value,
      },
      options: {
        maximumDigitsAfterPoint: maximumDigitsAfterPoint.inputProps.value,
        onlyIntegers: onlyIntegers.inputProps.checked.toString(),
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "randomNumbers",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const validateForm: validateFormT = () => {
    if (
      starting.validateInput(true) &&
      ending.validateInput(true) &&
      maximumDigitsAfterPoint.validateInput(true)
    ) {
      return minMaxCheck(starting, ending, false);
    } else {
      return false;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const getInitialBookmarkTitle = () => {
    return (
      "random number: " +
      starting.getRealValue(false).toString().split(".")[0] +
      "-" +
      ending.getRealValue(false).toString().split(".")[0]
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomNumbers")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>
        <TextField
          className={styles.inputWidth}
          label="starting number (included)"
          variant="outlined"
          type="text"
          margin="dense"
          {...starting.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            starting.inputProps.onBlur(event);
            minMaxCheck(starting, ending, true);
          }}
        />

        <TextField
          className={styles.inputWidth}
          label="ending number (excluded)"
          type="text"
          variant="outlined"
          margin="dense"
          {...ending.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            starting.inputProps.onBlur(event);
            minMaxCheck(starting, ending, true);
          }}
        />

        <FormControlLabel
          control={<Checkbox {...onlyIntegers.inputProps} />}
          label="only integers"
        />

        <TextField
          className={styles.inputWidth}
          label="maximum digits after the point 0-15"
          variant="outlined"
          type="text"
          margin="dense"
          {...maximumDigitsAfterPoint.inputProps}
          disabled={onlyIntegers.getRealValue()}
        />
        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>
        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function GradualValueForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: gradualValueArgObjectI = useMemo(() => {
    return getDefaultArgObject("gradualValue");
  }, []);

  const argObjectMemo: gradualValueArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as gradualValueArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "gradualValue"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const starting = useFormInputTextField(
    "starting number",
    "float",
    argObjectMemo.inputs.starting,
    bookmarkedFunctionDataArgObj?.inputs.starting
  );
  const incrementValue = useFormInputTextField(
    "increment value",
    "float",
    argObjectMemo.options.incrementValue,
    bookmarkedFunctionDataArgObj?.options.incrementValue
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI = {
        functionName: "gradualValue",
        type: "function",
        argObject: {
          inputs: {
            starting: starting.getRealValue(false),
          },
          options: {
            incrementValue: incrementValue.getRealValue(false),
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        starting: starting.inputProps.value,
      },
      options: {
        incrementValue: incrementValue.inputProps.value,
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "gradualValue",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };

      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (starting.validateInput(true) && incrementValue.validateInput(true)) {
      return true;
    } else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "gradual value: " +
      starting.getRealValue(false).toString().split(".")[0] +
      " (" +
      incrementValue.getRealValue(false).toString().split(".")[0] +
      ")"
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "gradualValue")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>

        <TextField
          className={styles.inputWidth}
          label="starting number"
          variant="outlined"
          type="text"
          margin="dense"
          {...starting.inputProps}
        />
        <TextField
          className={styles.inputWidth}
          label="increment value"
          variant="outlined"
          type="text"
          margin="dense"
          {...incrementValue.inputProps}
        />
        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomsFromArrayForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: randomsFromArrayArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomsFromArray");
  }, []);

  const argObjectMemo: randomsFromArrayArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomsFromArrayArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomsFromArray"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const arrayOfItems = useFormInputTextField(
    "array of items",
    "array_of_items",
    argObjectMemo.inputs.arrayOfItems,
    bookmarkedFunctionDataArgObj?.inputs.arrayOfItems
  );

  const keepOrder = useFormInputCheck(
    argObjectMemo.options.keepOrder,
    bookmarkedFunctionDataArgObj?.options.keepOrder
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI = {
        functionName: "randomsFromArray",
        type: "function",
        argObject: {
          inputs: {
            arrayOfItems: arrayOfItems.getRealValue(false),
          },
          options: {
            keepOrder: keepOrder.getRealValue(),
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        arrayOfItems: arrayOfItems.inputProps.value,
      },
      options: {
        keepOrder: keepOrder.inputProps.checked.toString(),
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "randomsFromArray",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (arrayOfItems.validateInput(true)) return true;
    else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "UD array: length=" + arrayOfItems.getRealValue(false).length.toString()
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomsFromArray")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>
        <TextField
          className={styles.inputWidth}
          label="array of items"
          variant="outlined"
          type="text"
          margin="dense"
          {...arrayOfItems.inputProps}
          InputProps={{
            startAdornment: <InputAdornment position="start">[</InputAdornment>,
            endAdornment: <InputAdornment position="end">]</InputAdornment>,
          }}
        />
        <FormControlLabel
          control={<Checkbox {...keepOrder.inputProps} />}
          label="keep the order of items"
        />
        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomIDsForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: randomIDsArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomIDs");
  }, []);

  const argObjectMemo: randomIDsArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomIDsArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData && bookmarkedFunctionData.functionName == "randomIDs"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const minIDLength = useFormInputTextField(
    "min length of id",
    "non_negative_integer",
    argObjectMemo.inputs.minIDLength,
    bookmarkedFunctionDataArgObj?.inputs.minIDLength
  );
  const maxIDLength = useFormInputTextField(
    "max length of id",
    "non_negative_integer",
    argObjectMemo.inputs.maxIDLength,
    bookmarkedFunctionDataArgObj?.inputs.maxIDLength
  );

  const charLib = useFormInputMultipleChecks(
    "charLib",
    ["letter", "symbol", "number"],
    argObjectMemo.options.charLib,
    bookmarkedFunctionDataArgObj?.options.charLib
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI = {
        functionName: "randomIDs",
        type: "function",
        argObject: {
          inputs: {
            minIDLength: minIDLength.getRealValue(false),
            maxIDLength: maxIDLength.getRealValue(false),
          },
          options: {
            charLib: charLib.getRealValue(false) as (
              | "number"
              | "symbol"
              | "letter"
            )[],
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        minIDLength: minIDLength.inputProps.value,
        maxIDLength: maxIDLength.inputProps.value,
      },
      options: {
        charLib: charLib.inputProps.value,
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI_STR = {
        functionName: "randomIDs",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (
      minIDLength.validateInput(true) &&
      maxIDLength.validateInput(true) &&
      charLib.validateSelection(true)
    ) {
      return minMaxCheck(minIDLength, maxIDLength, false);
    } else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "random IDs: " +
      minIDLength.getRealValue(false).toString() +
      "-" +
      maxIDLength.getRealValue(false).toString() +
      " " +
      charLib.getRealValue(false).join(",")
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomIDs")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>
        <TextField
          className={styles.inputWidth}
          label="min length of id"
          variant="outlined"
          type="text"
          margin="dense"
          {...minIDLength.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            minIDLength.inputProps.onBlur(event);
            minMaxCheck(minIDLength, maxIDLength, true);
          }}
        />
        <TextField
          className={styles.inputWidth}
          label="max length of id"
          variant="outlined"
          type="text"
          margin="dense"
          {...maxIDLength.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            maxIDLength.inputProps.onBlur(event);
            minMaxCheck(minIDLength, maxIDLength, true);
          }}
        />
        <FormControl
          error={charLib.inputProps.error}
          component="fieldset"
          variant="outlined"
        >
          <FormLabel component="legend">character libraries</FormLabel>
          <FormGroup
            sx={{
              "& .MuiFormControlLabel-root": {
                marginLeft: "5px",
              },
            }}
          >
            <FormControlLabel
              control={<Checkbox {...charLib.inputCheckProps.number} />}
              labelPlacement="end"
              label="number"
            />
            <FormControlLabel
              control={<Checkbox {...charLib.inputCheckProps.letter} />}
              labelPlacement="end"
              label="letter"
            />
            <FormControlLabel
              control={<Checkbox {...charLib.inputCheckProps.symbol} />}
              labelPlacement="end"
              label="symbol"
            />
          </FormGroup>
          <FormHelperText>{charLib.inputProps.helperText}</FormHelperText>
        </FormControl>

        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomCustomFunctionForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const argObjectMemo: randomCustomFunctionArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomCustomFunctionArgObjectI)
      : {
          inputs: { customFunction: undefined },
          options: {
            unique: true,
          },
        };
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomCustomFunction"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const customFunction = useFormInputTextField(
    "custom function",
    "custom_function",
    argObjectMemo.inputs.customFunction,
    bookmarkedFunctionDataArgObj?.inputs.customFunction
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI = {
        functionName: "randomCustomFunction",
        type: "function",
        argObject: {
          inputs: {
            customFunction: customFunction.getRealValue(false),
          },
          options: {
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        customFunction: customFunction.inputProps.value,
      },
      options: {
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "randomCustomFunction",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (customFunction.validateInput(true)) {
      return true;
    } else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "custom function: " +
      customFunction.inputProps.value.slice(
        customFunction.inputProps.value.indexOf("return"),
        customFunction.inputProps.value.indexOf("return") + 30
      )
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomCustomFunction")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>

        <CodeBlock
          type="customFunction"
          formInputData={customFunction}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></CodeBlock>
        {/* customFunction */}

        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomStringsForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: randomStringsArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomStrings");
  }, []);

  const argObjectMemo: randomStringsArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomStringsArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomStrings"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const minNumberOfWords = useFormInputTextField(
    "minimum number of words",
    "non_negative_integer",
    argObjectMemo.inputs.minNumberOfWords,
    bookmarkedFunctionDataArgObj?.inputs.minNumberOfWords
  );
  const maxNumberOfWords = useFormInputTextField(
    "maximum number of words",
    "non_negative_integer",
    argObjectMemo.inputs.maxNumberOfWords,
    bookmarkedFunctionDataArgObj?.inputs.maxNumberOfWords
  );

  const separator = useFormInputTextField(
    "separator",
    "string_quotes",
    argObjectMemo.options.separator,
    bookmarkedFunctionDataArgObj?.options.separator
  );

  const lib = useFormInputMultipleChecks(
    "lib",
    ["name", "adjective", "country", "noun"],
    argObjectMemo.options.lib,
    bookmarkedFunctionDataArgObj?.options.lib
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI = {
        functionName: "randomStrings",
        type: "function",
        argObject: {
          inputs: {
            minNumberOfWords: minNumberOfWords.getRealValue(false),
            maxNumberOfWords: maxNumberOfWords.getRealValue(false),
          },
          options: {
            separator: separator.getRealValue(false),
            lib: lib.getRealValue(false) as (
              | "name"
              | "adjective"
              | "country"
              | "noun"
            )[],
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        minNumberOfWords: minNumberOfWords.inputProps.value,
        maxNumberOfWords: maxNumberOfWords.inputProps.value,
      },
      options: {
        separator: separator.inputProps.value,
        lib: lib.inputProps.value,
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI_STR = {
        functionName: "randomStrings",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (
      minNumberOfWords.validateInput(true) &&
      maxNumberOfWords.validateInput(true) &&
      separator.validateInput(true) &&
      lib.validateSelection(true)
    ) {
      return minMaxCheck(minNumberOfWords, maxNumberOfWords, false);
    } else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "random word: " +
      minNumberOfWords.getRealValue(false).toString() +
      "-" +
      maxNumberOfWords.getRealValue(false).toString() +
      " " +
      lib.getRealValue(false).join(",")
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSave}>
      <h3 style={{ margin: 0 }}>
        {functionSettings
          .find((e) => e.name === "randomStrings")
          ?.uiName.toUpperCase()}
      </h3>
      <Divider flexItem></Divider>

      <TextField
        className={styles.inputWidth}
        label="minimum number of words"
        variant="outlined"
        type="text"
        margin="dense"
        {...minNumberOfWords.inputProps}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
          minNumberOfWords.inputProps.onBlur(event);
          minMaxCheck(minNumberOfWords, maxNumberOfWords, true);
        }}
      />
      <TextField
        className={styles.inputWidth}
        label="maximum number of words"
        variant="outlined"
        type="text"
        margin="dense"
        {...maxNumberOfWords.inputProps}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
          maxNumberOfWords.inputProps.onBlur(event);
          minMaxCheck(minNumberOfWords, maxNumberOfWords, true);
        }}
      />
      <TextField
        className={styles.inputWidth}
        label="separator in double quotes"
        variant="outlined"
        type="text"
        margin="dense"
        {...separator.inputProps}
      />
      <FormControl
        error={lib.inputProps.error}
        component="fieldset"
        variant="outlined"
      >
        <FormLabel component="legend">character libraries</FormLabel>
        <FormGroup
          sx={{
            "& .MuiFormControlLabel-root": {
              marginLeft: "5px",
            },
          }}
        >
          <FormControlLabel
            control={<Checkbox {...lib.inputCheckProps.name} />}
            labelPlacement="end"
            label="name"
          />
          <FormControlLabel
            control={<Checkbox {...lib.inputCheckProps.adjective} />}
            labelPlacement="end"
            label="adjective"
          />
          <FormControlLabel
            control={<Checkbox {...lib.inputCheckProps.country} />}
            labelPlacement="end"
            label="country"
          />
          <FormControlLabel
            control={<Checkbox {...lib.inputCheckProps.noun} />}
            labelPlacement="end"
            label="noun"
          />
        </FormGroup>
        <FormHelperText>{lib.inputProps.helperText}</FormHelperText>
      </FormControl>

      <BaseOptionsPart
        baseOptions={baseOptions}
        getLatestElementData={getLatestElementData}
        validateForm={validateForm}
      ></BaseOptionsPart>

      <Box className={styles.bottomPart}>
        <BookmarkBlock
          options={{
            type: "blueprintElement",
            getInitialTitle: getInitialBookmarkTitle,
            getLatestElementData_STR: getLatestElementData_STR,
            validateForm: validateForm,
          }}
        ></BookmarkBlock>

        <Button type="submit" variant="outlined">
          save
        </Button>
      </Box>
    </form>
  );
}

function FromBlueprintForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: fromBlueprintArgObjectI = useMemo(() => {
    return getDefaultArgObject("fromBlueprint");
  }, []);

  const argObjectMemo: fromBlueprintArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as fromBlueprintArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "fromBlueprint"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const chosenBlueprint = useFormInputSelectBlueprint(
    argObjectMemo.inputs.blueprint,
    bookmarkedFunctionDataArgObj?.inputs.blueprint
  );

  const baseIteration = useFormInputTextField(
    "base iteration",
    "positive_integer",
    argObjectMemo.inputs.baseIteration,
    bookmarkedFunctionDataArgObj?.inputs.baseIteration
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;

      const latestElementData: functionI = {
        functionName: "fromBlueprint",
        type: "function",
        argObject: {
          inputs: {
            blueprint: chosenBlueprint.realValue,
            baseIteration: baseIteration.getRealValue(false),
          },
          options: {
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        blueprint: chosenBlueprint.getStringifiedValue(),
        baseIteration: baseIteration.inputProps.value,
      },
      options: {
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "fromBlueprint",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const validateForm: validateFormT = () => {
    if (
      chosenBlueprint.validateInput(true, false) &&
      baseIteration.validateInput(true)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const getInitialBookmarkTitle = () => {
    const realValue = chosenBlueprint.realValue;

    return (
      "vault blueprint" +
      (realValue ? realValue.title : "") +
      "- BI:" +
      baseIteration.getRealValue(false).toString()
    );
  };

  const vault = useContext(VaultContext);

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "fromBlueprint")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>
        <FormControl
          className={styles.inputWidth}
          error={chosenBlueprint.error}
          disabled={chosenBlueprint.disabled}
        >
          <InputLabel id="demo-simple-select-label">Vault Blueprint</InputLabel>
          <Select label="Vault Blueprint" {...chosenBlueprint.inputProps}>
            {chosenBlueprint.disabled && chosenBlueprint.inputProps.value && (
              <MenuItem
                value={chosenBlueprint.realValue?.title}
                key={chosenBlueprint.realValue?.title}
              >
                {chosenBlueprint.realValue?.title}
              </MenuItem>
            )}

            {vault?.savedBlueprints.map((e) => (
              <MenuItem
                value={e.title}
                key={e.createdTime.toString() + e.title}
              >
                {e.title}
              </MenuItem>
            ))}
          </Select>
          {chosenBlueprint.helperText && (
            <FormHelperText>{chosenBlueprint.helperText}</FormHelperText>
          )}
        </FormControl>
        <TextField
          className={styles.inputWidth}
          label="base iteration"
          variant="outlined"
          type="text"
          margin="dense"
          {...baseIteration.inputProps}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            baseIteration.inputProps.onChange(event);
          }}
        />
        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>
        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomArraysForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: randomArraysArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomArrays");
  }, []);

  const argObjectMemo: randomArraysArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomArraysArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomArrays"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const arrayOfItems = useFormInputTextField(
    "array of items",
    "array_of_items",
    argObjectMemo.inputs.arrayOfItems,
    bookmarkedFunctionDataArgObj?.inputs.arrayOfItems
  );

  const keepOrder = useFormInputCheck(
    argObjectMemo.options.keepOrder,
    bookmarkedFunctionDataArgObj?.options.keepOrder
  );

  const allowDuplicates = useFormInputCheck(
    argObjectMemo.options.allowDuplicates,
    bookmarkedFunctionDataArgObj?.options.allowDuplicates
  );

  const minLengthOfArray = useFormInputTextField(
    "minimum length of array",
    "non_negative_integer",
    argObjectMemo.options.minLengthOfArray,
    bookmarkedFunctionDataArgObj?.options.minLengthOfArray
  );

  const maxLengthOfArray = useFormInputTextField(
    "maximum length of array",
    "non_negative_integer",
    argObjectMemo.options.maxLengthOfArray,
    bookmarkedFunctionDataArgObj?.options.maxLengthOfArray
  );

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI = {
        functionName: "randomArrays",
        type: "function",
        argObject: {
          inputs: {
            arrayOfItems: arrayOfItems.getRealValue(false),
          },
          options: {
            keepOrder: keepOrder.getRealValue(),
            allowDuplicates: allowDuplicates.getRealValue(),
            minLengthOfArray: minLengthOfArray.getRealValue(false),
            maxLengthOfArray: maxLengthOfArray.getRealValue(false),
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {
        arrayOfItems: arrayOfItems.inputProps.value,
      },
      options: {
        keepOrder: keepOrder.inputProps.checked.toString(),
        allowDuplicates: allowDuplicates.inputProps.checked.toString(),
        minLengthOfArray: minLengthOfArray.inputProps.value,
        maxLengthOfArray: maxLengthOfArray.inputProps.value,
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "randomArrays",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    if (
      arrayOfItems.validateInput(true) &&
      minLengthOfArray.validateInput(true) &&
      maxLengthOfArray.validateInput(true)
    )
      return minMaxCheck(minLengthOfArray, maxLengthOfArray, false);
    else return false;
  };

  const getInitialBookmarkTitle = () => {
    return (
      "random array: base set length =" +
      arrayOfItems.getRealValue(false).length.toString()
    );
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomArrays")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>
        <TextField
          className={styles.inputWidth}
          label="array of items"
          variant="outlined"
          type="text"
          margin="dense"
          {...arrayOfItems.inputProps}
          InputProps={{
            startAdornment: <InputAdornment position="start">[</InputAdornment>,
            endAdornment: <InputAdornment position="end">]</InputAdornment>,
          }}
        />
        <TextField
          className={styles.inputWidth}
          label="minimum length of arrays"
          variant="outlined"
          type="text"
          margin="dense"
          {...minLengthOfArray.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            minLengthOfArray.inputProps.onBlur(event);
            minMaxCheck(minLengthOfArray, maxLengthOfArray, true);
          }}
        />
        <TextField
          className={styles.inputWidth}
          label="maximum length of arrays"
          variant="outlined"
          type="text"
          margin="dense"
          {...maxLengthOfArray.inputProps}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            maxLengthOfArray.inputProps.onBlur(event);
            minMaxCheck(minLengthOfArray, maxLengthOfArray, true);
          }}
        />
        <FormControlLabel
          control={<Checkbox {...keepOrder.inputProps} />}
          label="keep the order of items"
        />
        {/* keepOrder */}
        <FormControlLabel
          control={<Checkbox {...allowDuplicates.inputProps} />}
          label="allow duplicate items"
        />
        {/* allowDuplicates */}
        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function RandomEmailForm({
  saveArgs,
  savedFunctionData,
  bookmarkedFunctionData,
}: formProps) {
  const defaultArgObject: randomEmailArgObjectI = useMemo(() => {
    return getDefaultArgObject("randomEmail");
  }, []);

  const argObjectMemo: randomEmailArgObjectI = useMemo(() => {
    return savedFunctionData !== undefined
      ? (savedFunctionData.argObject as randomEmailArgObjectI)
      : defaultArgObject;
  }, [savedFunctionData]);

  const bookmarkedFunctionDataArgObj =
    bookmarkedFunctionData &&
    bookmarkedFunctionData.functionName == "randomEmail"
      ? bookmarkedFunctionData.argObject_STR
      : undefined;

  const baseOptions = useBaseOptions(
    argObjectMemo,
    bookmarkedFunctionDataArgObj
  );

  const getLatestElementData: getLatestElementDataT = (runValidation) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI = {
        functionName: "randomEmail",
        type: "function",
        argObject: {
          inputs: {},
          options: {
            unique: baseOptions.unique.getRealValue(),
            customMap: baseOptions.customMap.getRealValue(false),
            customCompare: baseOptions.customCompare.getRealValue(false),
          },
        },
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const getArgObject_STR = () => {
    return {
      inputs: {},
      options: {
        unique: baseOptions.unique.inputProps.checked.toString(),
        customMap: baseOptions.customMap.inputProps.value,
        customCompare: baseOptions.customCompare.inputProps.value,
      },
    };
  };

  const getLatestElementData_STR: getLatestElementDataT_STR = (
    runValidation
  ) => {
    try {
      if (runValidation && !validateForm()) return null;
      const latestElementData: functionI_STR = {
        functionName: "randomEmail",
        type: "function",
        argObject_STR: getArgObject_STR(),
      };
      return latestElementData;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const latestElementData = getLatestElementData(true);
    if (latestElementData === null) return;
    saveArgs(latestElementData);
  };

  const validateForm: () => boolean = () => {
    return true;
  };

  const getInitialBookmarkTitle = () => {
    return "random email";
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSave}>
        <h3 style={{ margin: 0 }}>
          {functionSettings
            .find((e) => e.name === "randomEmail")
            ?.uiName.toUpperCase()}
        </h3>
        <Divider flexItem></Divider>

        <BaseOptionsPart
          baseOptions={baseOptions}
          getLatestElementData={getLatestElementData}
          validateForm={validateForm}
        ></BaseOptionsPart>

        <Box className={styles.bottomPart}>
          <BookmarkBlock
            options={{
              type: "blueprintElement",
              getInitialTitle: getInitialBookmarkTitle,
              getLatestElementData_STR: getLatestElementData_STR,
              validateForm: validateForm,
            }}
          ></BookmarkBlock>

          <Button type="submit" variant="outlined">
            save
          </Button>
        </Box>
      </form>
    </>
  );
}

function BaseOptionsPart({
  baseOptions,
  getLatestElementData,
  validateForm,
}: {
  baseOptions: {
    unique: ReturnType<typeof useFormInputCheck>;
    customMap: useFormInputTextFieldReturnT<"custom_map">;
    customCompare: useFormInputTextFieldReturnT<"custom_compare">;
  };
  getLatestElementData: getLatestElementDataT;
  validateForm: validateFormT;
}) {
  return (
    <>
      <FormControlLabel
        control={<Checkbox {...baseOptions.unique.inputProps} />}
        label="unique"
      />
      <CodeBlock
        type="customMap"
        formInputData={baseOptions.customMap}
        getLatestElementData={getLatestElementData}
        validateForm={validateForm}
      ></CodeBlock>
      <CodeBlock
        type="customCompare"
        formInputData={baseOptions.customCompare}
        getLatestElementData={getLatestElementData}
        validateForm={validateForm}
      ></CodeBlock>
    </>
  );
}

const minMaxCheck: (
  min: useFormInputTextFieldReturnT<
    | "integer"
    | "non_negative_float"
    | "positive_float"
    | "positive_integer"
    | "non_negative_integer"
    | "float"
  >,
  max: useFormInputTextFieldReturnT<
    | "integer"
    | "non_negative_float"
    | "positive_float"
    | "positive_integer"
    | "non_negative_integer"
    | "float"
  >,
  validateInputs: boolean
) => boolean = (min, max, validateInputs) => {
  if (
    validateInputs &&
    (!min.validateInput(false) || !max.validateInput(false))
  ) {
    return false;
  }

  if (min.getRealValue(false) > max.getRealValue(false)) {
    min.setErrorMessage(min.title + " cannot be bigger than " + max.title);
    min.setShowError(true);
    max.setErrorMessage(max.title + " cannot be smaller than " + min.title);
    max.setShowError(true);
    return false;
  } else {
    min.setErrorMessage("");
    max.setErrorMessage("");
    min.setShowError(false);
    max.setShowError(false);
    return true;
  }
};
