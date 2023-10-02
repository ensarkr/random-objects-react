import { SelectChangeEvent } from "@mui/material";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { savedBlueprintI } from "../functions/vaultFunctions";
import { VaultContext } from "../context/VaultContext";

const customFunctionParameters: Record<
  "customFunction" | "customMap" | "customCompare",
  {
    parameters: ("indexOfElement" | "element" | "createdElements")[];
  }
> = {
  customFunction: {
    parameters: ["indexOfElement"],
  },
  customMap: {
    parameters: ["element", "indexOfElement"],
  },
  customCompare: {
    parameters: ["element", "createdElements", "indexOfElement"],
  },
};

// * to add new custom input hook
// * 1. add its type and return type to realValueType
// * 2. add new cases inside of convertToRealValue and convertToString

// * if its text field
// * 3. add its type to allTextFieldTypes
// * 4. add new case inside of validateInput in useFormInputTextFieldReturnT
// * 5. add new case inside of onChange if there is a restriction on which keys can be used

// * if not add a new custom hook

export type allValueTypes =
  | allTextFieldTypes
  | "blueprint_select"
  | "check"
  | "multiple_checks";

type allTextFieldTypes =
  | "non_negative_float"
  | "float"
  | "integer"
  | "string"
  | "custom_map"
  | "custom_compare"
  | "custom_function"
  | "array_of_items"
  | "non_negative_integer"
  | "string_quotes"
  | "positive_integer"
  | "positive_float";

type realValueType<T extends allValueTypes> = T extends
  | "string"
  | "string_quotes"
  ? string
  : T extends
      | "non_negative_float"
      | "float"
      | "integer"
      | "non_negative_integer"
      | "positive_integer"
      | "positive_float"
  ? number
  : T extends "custom_map"
  ? ((item: unknown, index: number) => unknown) | undefined
  : T extends "custom_compare"
  ? ((item: unknown, items: unknown[], index: number) => boolean) | undefined
  : T extends "custom_function"
  ? (index: number) => unknown
  : T extends "array_of_items"
  ? unknown[]
  : T extends "check"
  ? boolean
  : T extends "multiple_checks"
  ? string[]
  : never;

// * T is used by runValidation on getRealValue function
// * which means if runValidation is true there is a possibility of function to return null
// * if runValidation is false it means developer checked before calling the function therefore there is no possibility of function to return null
// ! Do not call getRealValue functions with runValidation false if it is not validated before. It can cause errors
type getRealValueReturnType<T, K extends allValueTypes> = T extends false
  ? realValueType<K>
  : T extends true
  ? realValueType<K> | null
  : never;

export type useFormInputTextFieldReturnT<T extends allTextFieldTypes> = {
  inputProps: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    disabled: boolean;
    error: boolean;
    helperText: string;
  };
  title: string;
  getRealValue: <K extends boolean>(
    runValidationInput: K
  ) => getRealValueReturnType<K, T>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  validateInput: (informUser: boolean) => boolean;
};

// * useFormInput

// * priority of initial string value
// * 1. initialValueString comes from vault
// * 2. initialValue comes form savedElementData or defaultArgObject
// * 3. if both doesn't exist value becomes empty string

type useFormInputTextFieldT = <T extends allTextFieldTypes>(
  inputName: string,
  valueType: T,
  initialValue: realValueType<T> | undefined,
  initialValueString: string | undefined
) => useFormInputTextFieldReturnT<T>;

const useFormInputTextField: useFormInputTextFieldT = (
  inputName,
  valueType,
  initialValue,
  initialValueString
) => {
  const [value, setValue] = useState<string>(
    initialValueString === undefined
      ? convertToString(valueType, initialValue)
      : initialValueString
  );

  const [disabled, setDisabled] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getRealValue = <T extends boolean>(runValidationInput: T) => {
    if (runValidationInput && !validateInput(false)) {
      // console.log(
      //   valueType,
      //   value,
      //   inputName + ".validateInput returned false"
      // );
      return null as getRealValueReturnType<
        typeof runValidationInput,
        typeof valueType
      >;
    }
    return convertToRealValue(valueType, value) as getRealValueReturnType<
      typeof runValidationInput,
      typeof valueType
    >;
  };

  const promptErrorMessage = (informUser: boolean, errorMessage: string) => {
    if (informUser) {
      setErrorMessage(errorMessage);
      setShowError(true);
    }
  };
  const removeErrorMessage = () => {
    if (errorMessage || showError) {
      setErrorMessage("");
      setShowError(false);
    }
  };

  const validateInput: (informUser: boolean) => boolean = (informUser) => {
    switch (valueType) {
      case "float":
        if (!new RegExp(/^[-+]?\d+(\.\d+)?$/).test(value)) {
          promptErrorMessage(informUser, "Please write valid decimal number.");
          return false;
        }
        break;
      case "non_negative_float":
        if (!new RegExp(/^[+]?\d+(\.\d+)?$/).test(value)) {
          promptErrorMessage(
            informUser,
            "Please write valid non-negative decimal number."
          );
          return false;
        }
        break;
      case "positive_float":
        if (!new RegExp(/^[+]?[0]*[1-9]\d*(\.\d+)?$/).test(value)) {
          promptErrorMessage(
            informUser,
            "Please write valid positive decimal number."
          );
          return false;
        }
        break;
      case "integer":
        if (!new RegExp(/^[-+]?\d+$/).test(value)) {
          promptErrorMessage(informUser, "Please write valid integer.");
          return false;
        }
        break;
      case "non_negative_integer":
        if (!new RegExp(/^[+]?\d+$/).test(value)) {
          promptErrorMessage(
            informUser,
            "Please write valid non-negative integer"
          );
          return false;
        }
        break;
      case "positive_integer":
        if (!new RegExp(/^[+]?[0]*[1-9]\d*$/).test(value)) {
          promptErrorMessage(informUser, "Please write valid positive integer");
          return false;
        }
        break;
      case "string":
        if (value.trim().length === 0) {
          if (informUser) {
            setShowError(informUser);
            setErrorMessage("");
          }
          promptErrorMessage(informUser, inputName + " cannot be empty.");
          return false;
        }
        break;
      case "string_quotes":
        if (!new RegExp(/^".*"$/m).test(value)) {
          promptErrorMessage(
            informUser,
            inputName + " is not in between double quotes."
          );
          return false;
        }
        break;
      case "custom_map":
      case "custom_compare":
        // impossible to be here without getting checked
        break;
      case "custom_function":
        if (value.trim().length === 0) {
          promptErrorMessage(informUser, inputName + " is required.");
          return false;
        }
        setErrorMessage(" ");
        break;
      case "array_of_items":
        try {
          const array = JSON.parse("[" + value + "]") as unknown;
          if (
            !Array.isArray(array) ||
            (Array.isArray(array) && array.length <= 0)
          ) {
            promptErrorMessage(
              informUser,
              "Please write at least one element."
            );
            return false;
          }
        } catch (error) {
          console.log((error as Error).message);
          promptErrorMessage(informUser, (error as Error).message);
          return false;
        }
        break;
      default:
        console.error(
          "Couldn`t find any validate function inside useFormInput.ts - " +
            inputName
        );
    }
    removeErrorMessage();
    return true;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    removeErrorMessage();

    switch (valueType) {
      case "integer":
        if (new RegExp(/[^-+0-9]+/g).test(event.target.value)) {
          return;
        }
        setValue(event.target.value);
        break;

      case "non_negative_integer":
      case "positive_integer":
        if (new RegExp(/[^+0-9]+/g).test(event.target.value)) {
          return;
        }
        setValue(event.target.value);
        break;

      case "float":
        if (new RegExp(/[^-+0-9.]+/g).test(event.target.value)) {
          return;
        }
        setValue(event.target.value);
        break;

      case "non_negative_float":
      case "positive_float":
        if (new RegExp(/[^+0-9.]+/g).test(event.target.value)) {
          return;
        }
        setValue(event.target.value);
        break;

      default:
        setValue(event.target.value);
        break;
    }
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (
      initialValue !== undefined &&
      initialValue.toString() === event.target.value
    )
      event.target.select();
  };

  const onBlur = () => {
    validateInput(true);
  };

  return {
    inputProps: {
      value,
      disabled,
      error: !disabled && showError,
      helperText: disabled ? "" : errorMessage,
      onBlur,
      onChange,
      onFocus,
    },
    title: inputName,
    getRealValue,
    setDisabled,
    setErrorMessage,
    setShowError,
    setValue,
    validateInput,
  };
};

// * useFormInputCheck

type useFormInputCheckT = (
  initialValue: realValueType<"check"> | undefined,
  initialValueString: string | undefined
) => {
  inputProps: {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
  };
  getRealValue: () => boolean;
  setChecked: (checked: boolean) => void;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const useFormInputCheck: useFormInputCheckT = (
  initialValue,
  initialValueString
) => {
  const [checked, setChecked] = useState<boolean>(
    initialValueString === undefined
      ? (initialValue as boolean)
      : convertToRealValue("check", initialValueString)
  );

  const [disabled, setDisabled] = useState<boolean>(false);

  const getRealValue = () => {
    return checked;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return {
    inputProps: {
      checked,
      disabled,
      onChange,
    },
    getRealValue,
    setDisabled,
    setChecked,
  };
};

// * useFormInputSelectBlueprint

type useFormInputSelectBlueprintT = (
  initialBlueprint: savedBlueprintI | undefined,
  initialValueString: string | undefined
) => {
  inputProps: {
    value: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  };
  disabled: boolean;
  error: boolean;
  helperText: string;
  realValue: savedBlueprintI | undefined;
  getStringifiedValue: () => string;
  validateInput: validateSelectBlueprintT;
};

type validateSelectBlueprintT = (
  informUser: boolean,
  firstValidation: boolean
) => boolean;

const useFormInputSelectBlueprint: useFormInputSelectBlueprintT = (
  initialBlueprint,
  initialValueString
) => {
  const [chosenBlueprint, setChosenBlueprint] = useState<
    savedBlueprintI | undefined
  >(
    initialValueString !== undefined
      ? (JSON.parse(initialValueString) as savedBlueprintI)
      : initialBlueprint
  );

  const vault = useContext(VaultContext);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    validateInput(true, true);
  }, [vault]);

  const onChange = (event: SelectChangeEvent<string>) => {
    setErrorMessage("");
    setShowError(false);

    setChosenBlueprint(
      vault?.savedBlueprints.find((e) => e.title === event.target.value)
    );
  };

  const validateInput: validateSelectBlueprintT = (
    informUser,
    firstValidation
  ) => {
    setDisabled(false);

    if (vault === null) {
      if (informUser) {
        setErrorMessage("Couldn't access to the vault");
        setShowError(true);
        setDisabled(true);
      }
      return false;
    } else if (vault.savedBlueprints.length === 0) {
      if (informUser) {
        setErrorMessage("Couldn't find any saved blueprint in the vault");
        setShowError(true);
        setDisabled(true);
      }
      return false;
    }

    if (chosenBlueprint === undefined) {
      if (!firstValidation) {
        if (informUser) {
          setErrorMessage("Please choose one blueprint.");
          setShowError(true);
        }
        return false;
      }
    }

    setDisabled(false);
    return true;
  };

  return {
    inputProps: {
      value: chosenBlueprint === undefined ? "" : chosenBlueprint.title,
      onChange,
    },
    disabled,
    error: showError,
    helperText: errorMessage,
    realValue: chosenBlueprint,
    getStringifiedValue: () => JSON.stringify(chosenBlueprint),
    validateInput,
  };
};

// * useFormInputMultipleChecks
// TODO: write a better one

type useFormInputMultipleChecksT = <T extends string>(
  inputName: string,
  allValuesArray: T[],
  initialValue: string[],
  initialValueString: string | undefined
) => {
  inputCheckProps: Record<
    T,
    {
      checked: boolean;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      disabled: boolean;
    }
  >;
  inputProps: { error: boolean; helperText: string; value: string };
  getRealValue: <K extends boolean>(
    runValidationInput: K
  ) => getRealValueReturnType<K, "multiple_checks">;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  validateSelection: (informUser: boolean) => boolean;
};

const useFormInputMultipleChecks: useFormInputMultipleChecksT = (
  _inputName,
  allValuesArray,
  initialValue,
  initialValueString
) => {
  const [chosenArray, setChosenArray] = useState<string[]>(
    initialValueString === undefined
      ? initialValue
      : convertToRealValue("multiple_checks", initialValueString)
  );

  const [disabled, setDisabled] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(" ");

  const inputCheckProps = useMemo(() => {
    const calcInputProps = {};

    for (let i = 0; i < allValuesArray.length; i++) {
      const currentKey = allValuesArray[i];

      Object.defineProperty(calcInputProps, currentKey, {
        value: {
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.checked && chosenArray.includes(currentKey)) {
              const chosenArrayCopy = [...chosenArray];
              setChosenArray(
                chosenArrayCopy
                  .slice(0, chosenArrayCopy.indexOf(currentKey))
                  .concat(
                    chosenArrayCopy.slice(
                      chosenArrayCopy.indexOf(currentKey) + 1,
                      chosenArray.length
                    )
                  )
              );
            } else if (
              event.target.checked &&
              !chosenArray.includes(currentKey)
            ) {
              const newChosenArray = [...chosenArray, currentKey];
              setChosenArray(newChosenArray);
            }
          },
          checked: chosenArray.includes(currentKey),
          disabled,
        },
        writable: true,
      });
    }

    return calcInputProps as Record<
      string,
      {
        checked: boolean;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        disabled: boolean;
      }
    >;
  }, [chosenArray, disabled]);

  const getRealValue = <T extends boolean>(runValidationInput: T) => {
    if (runValidationInput && !validateSelection(false)) {
      // console.log(
      //   "multiple_checks",
      //   chosenArray,
      //   inputName + ".validateInput returned false"
      // );
      return null as getRealValueReturnType<"true", "multiple_checks">;
    }
    return chosenArray as getRealValueReturnType<"false", "multiple_checks">;
  };

  const validateSelection: (informUser: boolean) => boolean = (informUser) => {
    setErrorMessage(" ");
    setShowError(false);

    if (chosenArray.length > 0) {
      return true;
    } else {
      if (informUser) {
        setErrorMessage("Please at least choose one");
        setShowError(true);
      }
      return false;
    }
  };

  return {
    inputCheckProps,
    inputProps: {
      error: showError,
      helperText: errorMessage,
      value: chosenArray.join(","),
    },
    getRealValue,
    setDisabled,
    setErrorMessage,
    setShowError,
    validateSelection,
  };
};

// * converts strings to real value depending on valueType

type convertToRealValueT = <T extends allValueTypes>(
  valueType: T,
  stringValue: string
) => realValueType<T>;

const convertToRealValue: convertToRealValueT = (valueType, stringValue) => {
  switch (valueType) {
    case "non_negative_float":
    case "float":
    case "positive_float":
    case "integer":
    case "non_negative_integer":
    case "positive_integer":
      return parseFloat(stringValue) as realValueType<typeof valueType>;

    case "string":
      return stringValue as realValueType<typeof valueType>;

    case "string_quotes":
      return stringValue
        .toString()
        .slice(
          stringValue.toString().indexOf('"') + 1,
          stringValue.toString().lastIndexOf('"')
        ) as realValueType<typeof valueType>;

    case "custom_map":
      if (stringValue === "")
        return undefined as realValueType<typeof valueType>;
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      return new Function(
        customFunctionParameters.customMap.parameters.join(","),
        stringValue
      ) as realValueType<typeof valueType>;

    case "custom_compare":
      if (stringValue === "")
        return undefined as realValueType<typeof valueType>;

      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      return new Function(
        customFunctionParameters.customCompare.parameters.join(","),
        stringValue
      ) as realValueType<typeof valueType>;

    case "custom_function":
      if (stringValue === "")
        return undefined as realValueType<typeof valueType>;
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      return new Function(
        customFunctionParameters.customFunction.parameters.join(","),
        stringValue
      ) as realValueType<typeof valueType>;

    case "array_of_items":
      return JSON.parse("[" + stringValue + "]") as unknown[] as realValueType<
        typeof valueType
      >;

    case "check":
      return (stringValue === "true" ? true : false) as realValueType<
        typeof valueType
      >;

    case "blueprint_select":
      return JSON.parse(stringValue) as realValueType<typeof valueType>;

    case "multiple_checks":
      return stringValue.split(",") as realValueType<typeof valueType>;

    default:
      return undefined as realValueType<typeof valueType>;
  }
};

// * converts values to string depending on valueType

type convertToStringT = <T extends allValueTypes>(
  valueType: T,
  initialValue: realValueType<T> | undefined
) => string;

const convertToString: convertToStringT = (
  valueType: allValueTypes,
  initialValue
) => {
  if (initialValue === undefined) return "";

  const stringValue = JSON.stringify(initialValue);

  switch (valueType) {
    case "non_negative_float":
    case "float":
    case "integer":
    case "non_negative_integer":
    case "check":
    case "blueprint_select":
    case "positive_float":
    case "positive_integer":
      return stringValue;
    case "string_quotes":
      return '"' + initialValue.toString() + '"';
    case "custom_map":
    case "custom_compare":
    case "custom_function":
      return initialValue
        .toString()
        .slice(
          initialValue.toString().indexOf("{") + 1,
          initialValue.toString().lastIndexOf("}")
        )
        .trim();
    case "array_of_items":
    case "multiple_checks":
      return stringValue.slice(
        stringValue.indexOf("[") + 1,
        stringValue.lastIndexOf("]")
      );

    case "string":
      return initialValue as string;

    default:
      return "";
  }
};

export {
  useFormInputTextField,
  convertToRealValue,
  useFormInputCheck,
  useFormInputSelectBlueprint,
  useFormInputMultipleChecks,
};
