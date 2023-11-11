/* eslint-disable @typescript-eslint/ban-types */
import {
  randomObjects,
  randomCustomFunction,
  gradualValueArg,
  randomCustomFunctionArg,
  randomIDsArg,
  randomNumbersArg,
  randomStringsArg,
  randomsFromArrayArg,
  randomFromArray,
  randomArraysArg,
  randomString,
} from "random-objects";
import { logElementT } from "../components/logBlock/LogBlock";
import { allValueTypes } from "../hooks/useFormInput";
import {
  baseFunctionOptions,
  blueprint,
  gradualValueInputs,
  gradualValueOptions,
  randomArraysOptions,
  randomCustomFunctionInputs,
  randomCustomFunctionOptions,
  randomIDsInputs,
  randomIDsOptions,
  randomNumbersInputs,
  randomNumbersOptions,
  randomStringsInputs,
  randomStringsOptions,
  randomsFromArrayOptions,
} from "../typings/randomObjects";
import {
  blueprintElementI,
  convertToRealBlueprint,
} from "./blueprintFunctions";
import { savedBlueprintI } from "./vaultFunctions";

export type allFunctionNames =
  | "randomNumbers"
  | "gradualValue"
  | "randomsFromArray"
  | "randomIDs"
  | "randomCustomFunction"
  | "randomStrings"
  | "fromBlueprint"
  | "randomArrays"
  | "randomEmail";

// * First interface is real arg object. Mostly used by random generator functions.
// * Second interface has two parts. String one used by bookmark vault functions to store data on localStorage.
// * allValueTypes used for form inputs to decide which type to use and to convert real value.
// * Second interface omits "numberOfItems" | "showLogs" | "progressUpdate" because they are not needed
// * functionIs used by random generator functions

// * To create and add new functions
// * 1. Create its function and return it inside randomCustomFunction
// * 2. Create its argObject (inputs, options) types
// * 3. Derive its string and allValueTypes argObjects types
// * 4. Update getArgObjectI_, getDefaultArgObjectReturnArgI, allArgObjectIs_, allArgObjectIs, functionI, functionI_STR types
// * 5. Add the function to allFunctionNames and functionSettings
// * 6. Add new case in switch case inside getDefaultArgObject and getArgObject_TYPE
// * 7. Add its form to FunctionForms.tsx file and FunctionForms components switch case

export interface randomNumbersArgObjectI {
  inputs: randomNumbersInputs;
  options: Required<
    Pick<
      randomNumbersOptions,
      "unique" | "maximumDigitsAfterPoint" | "onlyIntegers"
    >
  > &
    Pick<
      randomNumbersOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}

export interface randomNumbersArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomNumbersArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomNumbersArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomsFromArrayArgObjectI {
  inputs: { arrayOfItems: never[] | unknown[] };
  options: Required<Pick<randomsFromArrayOptions, "keepOrder" | "unique">> &
    Pick<
      randomsFromArrayOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}

export interface randomsFromArrayArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomsFromArrayArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomsFromArrayArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface gradualValueArgObjectI {
  inputs: gradualValueInputs;
  options: Required<Pick<gradualValueOptions, "incrementValue" | "unique">> &
    Pick<
      gradualValueOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}

export interface gradualValueArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof gradualValueArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        gradualValueArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomIDsArgObjectI {
  inputs: randomIDsInputs;
  options: Required<Pick<randomIDsOptions, "unique">> &
    Pick<
      randomIDsOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    > & {
      charLib: ("number" | "letter" | "symbol")[];
    };
}

export interface randomIDsArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomIDsArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomIDsArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomCustomFunctionArgObjectI {
  inputs: Partial<randomCustomFunctionInputs>;
  options: Required<Pick<randomCustomFunctionOptions, "unique">> &
    Pick<
      randomCustomFunctionOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}
export interface randomCustomFunctionArgObjectI_<
  T extends string | allValueTypes
> {
  inputs: { [K in keyof randomCustomFunctionArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomCustomFunctionArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomStringsArgObjectI {
  inputs: Partial<randomStringsInputs>;
  options: Required<Pick<randomStringsOptions, "unique" | "separator">> &
    Pick<
      randomStringsOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    > & {
      lib: ("name" | "adjective" | "country" | "noun")[];
    };
}
export interface randomStringsArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomStringsArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomStringsArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface fromBlueprintArgObjectI {
  inputs: {
    blueprint: savedBlueprintI | undefined;
    baseIteration: number;
  };
  options: Required<Pick<baseFunctionOptions, "unique">> &
    Pick<
      baseFunctionOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}

export interface fromBlueprintArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof fromBlueprintArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        fromBlueprintArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomArraysArgObjectI {
  inputs: { arrayOfItems: never[] | unknown[] };
  options: Required<Pick<randomArraysOptions, "keepOrder" | "unique">> &
    Pick<
      randomArraysOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
      | "maxLengthOfArray"
      | "minLengthOfArray"
      | "allowDuplicates"
    >;
}

export interface randomArraysArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomArraysArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomArraysArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export interface randomEmailArgObjectI {
  inputs: {};
  options: Required<Pick<baseFunctionOptions, "unique">> &
    Pick<
      baseFunctionOptions,
      | "customMap"
      | "customCompare"
      | "numberOfItems"
      | "showLogs"
      | "progressUpdate"
      | "reCreateLimit"
    >;
}

export interface randomEmailArgObjectI_<T extends string | allValueTypes> {
  inputs: { [K in keyof randomEmailArgObjectI["inputs"]]: T };
  options: {
    [K in keyof Required<
      Omit<
        randomEmailArgObjectI["options"],
        "numberOfItems" | "showLogs" | "progressUpdate" | "reCreateLimit"
      >
    >]: T;
  };
}

export type allArgObjectIs =
  | randomNumbersArgObjectI
  | randomsFromArrayArgObjectI
  | gradualValueArgObjectI
  | randomIDsArgObjectI
  | randomCustomFunctionArgObjectI
  | randomStringsArgObjectI
  | fromBlueprintArgObjectI
  | randomArraysArgObjectI
  | randomEmailArgObjectI;

export type allArgObjectIs_<T extends string | allValueTypes> =
  | randomNumbersArgObjectI_<T>
  | randomsFromArrayArgObjectI_<T>
  | gradualValueArgObjectI_<T>
  | randomIDsArgObjectI_<T>
  | randomCustomFunctionArgObjectI_<T>
  | randomStringsArgObjectI_<T>
  | fromBlueprintArgObjectI_<T>
  | randomArraysArgObjectI_<T>
  | randomEmailArgObjectI_<T>;

export type getDefaultArgObjectReturnArgI<T extends allFunctionNames> =
  T extends "randomNumbers"
    ? randomNumbersArgObjectI
    : T extends "gradualValue"
    ? gradualValueArgObjectI
    : T extends "randomsFromArray"
    ? randomsFromArrayArgObjectI
    : T extends "randomIDs"
    ? randomIDsArgObjectI
    : T extends "randomCustomFunction"
    ? randomCustomFunctionArgObjectI
    : T extends "randomStrings"
    ? randomStringsArgObjectI
    : T extends "fromBlueprint"
    ? fromBlueprintArgObjectI
    : T extends "randomArrays"
    ? randomArraysArgObjectI
    : T extends "randomEmail"
    ? randomEmailArgObjectI
    : never;

export type getArgObjectI_<
  K extends "STR" | "TYPE",
  T extends allFunctionNames
> = T extends "randomNumbers"
  ? randomNumbersArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "gradualValue"
  ? gradualValueArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomsFromArray"
  ? randomsFromArrayArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomIDs"
  ? randomIDsArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomCustomFunction"
  ? randomCustomFunctionArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomStrings"
  ? randomStringsArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "fromBlueprint"
  ? fromBlueprintArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomArrays"
  ? randomArraysArgObjectI_<K extends "STR" ? string : allValueTypes>
  : T extends "randomEmail"
  ? randomEmailArgObjectI_<K extends "STR" ? string : allValueTypes>
  : never;

export type functionI = {
  type: "function";
} & (
  | {
      functionName: "randomNumbers";
      argObject: randomNumbersArgObjectI;
      argObject_STR: randomNumbersArgObjectI_<string>;
    }
  | {
      functionName: "randomsFromArray";
      argObject: randomsFromArrayArgObjectI;
      argObject_STR: randomsFromArrayArgObjectI_<string>;
    }
  | {
      functionName: "gradualValue";
      argObject: gradualValueArgObjectI;
      argObject_STR: gradualValueArgObjectI_<string>;
    }
  | {
      functionName: "randomIDs";
      argObject: randomIDsArgObjectI;
      argObject_STR: randomIDsArgObjectI_<string>;
    }
  | {
      functionName: "randomCustomFunction";
      argObject: randomCustomFunctionArgObjectI;
      argObject_STR: randomCustomFunctionArgObjectI_<string>;
    }
  | {
      functionName: "randomStrings";
      argObject: randomStringsArgObjectI;
      argObject_STR: randomStringsArgObjectI_<string>;
    }
  | {
      functionName: "fromBlueprint";
      argObject: fromBlueprintArgObjectI;
      argObject_STR: fromBlueprintArgObjectI_<string>;
    }
  | {
      functionName: "randomArrays";
      argObject: randomArraysArgObjectI;
      argObject_STR: randomArraysArgObjectI_<string>;
    }
  | {
      functionName: "randomEmail";
      argObject: randomEmailArgObjectI;
      argObject_STR: randomEmailArgObjectI_<string>;
    }
);

export type functionI_STR = {
  type: "function";
} & (
  | {
      functionName: "randomNumbers";
      argObject_STR: randomNumbersArgObjectI_<string>;
    }
  | {
      functionName: "randomsFromArray";
      argObject_STR: randomsFromArrayArgObjectI_<string>;
    }
  | {
      functionName: "gradualValue";
      argObject_STR: gradualValueArgObjectI_<string>;
    }
  | {
      functionName: "randomIDs";
      argObject_STR: randomIDsArgObjectI_<string>;
    }
  | {
      functionName: "randomCustomFunction";
      argObject_STR: randomCustomFunctionArgObjectI_<string>;
    }
  | {
      functionName: "randomStrings";
      argObject_STR: randomStringsArgObjectI_<string>;
    }
  | {
      functionName: "fromBlueprint";
      argObject_STR: fromBlueprintArgObjectI_<string>;
    }
  | {
      functionName: "randomArrays";
      argObject_STR: randomArraysArgObjectI_<string>;
    }
  | {
      functionName: "randomEmail";
      argObject_STR: randomEmailArgObjectI_<string>;
    }
);

type getArgObjectI = <T extends allFunctionNames>(
  functionName: T
) => getDefaultArgObjectReturnArgI<T>;

// * Default arg objects for populating empty forms

const getDefaultArgObject: getArgObjectI = (functionName) => {
  switch (functionName) {
    case "randomNumbers":
      return {
        inputs: {
          starting: 0,
          ending: 100,
        },
        options: {
          onlyIntegers: true,
          maximumDigitsAfterPoint: 15,
          unique: true,
        },
      } as randomNumbersArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomsFromArray":
      return {
        inputs: { arrayOfItems: [] },
        options: {
          keepOrder: false,
          unique: true,
        },
      } as randomsFromArrayArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "gradualValue":
      return {
        inputs: { starting: 0 },
        options: {
          incrementValue: 1,
          unique: true,
        },
      } as gradualValueArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomIDs":
      return {
        inputs: { minIDLength: 8, maxIDLength: 12 },
        options: {
          charLib: ["number", "letter", "symbol"],
          unique: true,
        },
      } as randomIDsArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomCustomFunction":
      return {
        inputs: { customFunction: undefined },
        options: {
          unique: false,
        },
      } as randomCustomFunctionArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomStrings":
      return {
        inputs: { minNumberOfWords: 1, maxNumberOfWords: 4 },
        options: {
          lib: ["noun", "adjective"],
          separator: " ",
          unique: true,
        },
      } as randomStringsArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "fromBlueprint":
      return {
        inputs: { blueprint: undefined, baseIteration: 100 },
        options: {
          unique: false,
        },
      } as fromBlueprintArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomArrays":
      return {
        inputs: { arrayOfItems: [] },
        options: {
          unique: false,
          keepOrder: true,
          allowDuplicates: false,
        },
      } as randomArraysArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    case "randomEmail":
      return {
        inputs: {},
        options: {
          unique: false,
        },
      } as randomEmailArgObjectI as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;

    default:
      return { inputs: {}, options: {} } as getDefaultArgObjectReturnArgI<
        typeof functionName
      >;
  }
};

type getArgObjectI_TYPE = <T extends allFunctionNames>(
  functionName: T
) => getArgObjectI_<"TYPE", T> | null;

// * Type arg objects for conversions or input types

const getArgObject_TYPE: getArgObjectI_TYPE = (functionName) => {
  switch (functionName) {
    case "randomNumbers":
      return {
        inputs: {
          starting: "float",
          ending: "float",
        },
        options: {
          onlyIntegers: "check",
          maximumDigitsAfterPoint: "non_negative_integer",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomNumbersArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "randomsFromArray":
      return {
        inputs: { arrayOfItems: "array_of_items" },
        options: {
          keepOrder: "check",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomsFromArrayArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "gradualValue":
      return {
        inputs: { starting: "float" },
        options: {
          incrementValue: "float",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as gradualValueArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "randomIDs":
      return {
        inputs: {
          minIDLength: "non_negative_integer",
          maxIDLength: "non_negative_integer",
        },
        options: {
          charLib: "multiple_checks",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomIDsArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "randomCustomFunction":
      return {
        inputs: { customFunction: "custom_function" },
        options: {
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomCustomFunctionArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "randomStrings":
      return {
        inputs: {
          minNumberOfWords: "non_negative_integer",
          maxNumberOfWords: "non_negative_integer",
        },
        options: {
          lib: "multiple_checks",
          separator: "string_quotes",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomStringsArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "fromBlueprint":
      return {
        inputs: {
          blueprint: "blueprint_select",
          baseIteration: "non_negative_integer",
        },
        options: {
          onlyIntegers: "check",
          maximumDigitsAfterPoint: "non_negative_integer",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as fromBlueprintArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;
    case "randomArrays":
      return {
        inputs: { arrayOfItems: "array_of_items" },
        options: {
          keepOrder: "check",
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
          allowDuplicates: "check",
          maxLengthOfArray: "non_negative_integer",
          minLengthOfArray: "non_negative_integer",
        },
      } as randomArraysArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    case "randomEmail":
      return {
        inputs: {},
        options: {
          unique: "check",
          customCompare: "custom_compare",
          customMap: "custom_map",
        },
      } as randomArraysArgObjectI_<allValueTypes> as getArgObjectI_<
        "TYPE",
        typeof functionName
      >;

    default:
      return null;
  }
};

type deepCloneObjectLiteI = (object: object | null) => unknown | null;

export const deepCloneObjectLite: deepCloneObjectLiteI = (object) => {
  const isArray = Array.isArray(object);
  if ((typeof object !== "object" && !isArray) || object === null) return null;
  switch (isArray) {
    case true:
      return [...(object as unknown[]).map((e) => cloneLoopLite(e))] as Object;
    case false:
      // eslint-disable-next-line no-case-declarations
      const clonedObject = {};
      Object.keys(object).forEach((key) => {
        (clonedObject as { [key: string]: unknown })[key] = cloneLoopLite(
          (object as { [key: string]: unknown })[key]
        );
      });
      return clonedObject as Object;
    default:
      return null;
  }
};

type cloneLoopI = (object: unknown) => unknown;

const cloneLoopLite: cloneLoopI = (unknownValue) => {
  if (unknownValue === null) return null;

  switch (typeof unknownValue) {
    case "bigint":
    case "string":
    case "number":
    case "boolean":
    case "function":
      return unknownValue;
    case "object":
      return deepCloneObjectLite(unknownValue);
    case "undefined":
      return undefined;
    default:
      break;
  }
};

// Progress update function purpose is to fill log pages in code blocks

const setProgressUpdate = (
  setLogArray: (value: React.SetStateAction<logElementT[]>) => void,
  functionData: functionI
) => {
  functionData.argObject.options.progressUpdate = {};

  // if (
  //   functionData.argObject.options.customCompare ||
  //   functionData.argObject.options.customMap ||
  //   functionData.argObject.options.unique
  // ) {
  //   functionData.argObject.options.progressUpdate["uniqueCheckFailed"] = (
  //     _functionName,
  //     limit
  //   ) => {
  //     if (limit !== undefined)
  //       setLogArray((pv) => [
  //         ...pv,
  //         {
  //           element: null,
  //           index: null,
  //           colorVariant: "error",
  //           log: "Recreate limit is reached.\nProceeding create non-unique items.",
  //         },
  //       ]);
  //     else
  //       setLogArray((pv) => [
  //         ...pv,
  //         {
  //           element: null,
  //           index: null,
  //           colorVariant: "error",
  //           log: "Cannot create unique items with given parameters.\nProceeding create non-unique items.",
  //         },
  //       ]);
  //   };
  // }

  functionData.argObject.options.progressUpdate["afterItemCreated"] = (
    item,
    index
  ) => {
    setLogArray((pv) => [
      ...pv,
      {
        element: item,
        index: index,
        colorVariant: "normal",
        log: "Created",
      },
    ]);
  };

  if (functionData.argObject.options.customMap) {
    functionData.argObject.options.progressUpdate["afterMap"] = (
      item,
      index
    ) => {
      if (typeof item === "undefined") {
        console.log("not bool");
        throw new Error("Custom map returned undefined");
      }
      setLogArray((pv) => [
        ...pv,
        {
          element: item,
          index: index,
          colorVariant: "normal",
          log: "Map",
        },
      ]);
    };
  }

  if (functionData.argObject.options.customCompare) {
    functionData.argObject.options.progressUpdate["afterCompare"] = (
      item,
      index,
      _functionName,
      compareResult
    ) => {
      if (typeof compareResult !== "boolean") {
        throw new Error("Custom compare did not return boolean value");
        return false;
      }
      setLogArray((pv) => [
        ...pv,
        {
          element: item,
          index: index,
          colorVariant: compareResult ? "normal" : "warning",
          log: "Compare: " + compareResult.toString(),
        },
      ]);
    };
  }

  // if (functionData.argObject.options.unique) {
  //   functionData.argObject.options.progressUpdate["afterUnique"] = (
  //     item,
  //     index,
  //     _functionName,
  //     compareResult
  //   ) => {
  //     setLogArray((pv) => [
  //       ...pv,
  //       {
  //         element: item,
  //         index: index,
  //         type: compareResult ? "normal" : "warning",
  //         log:
  //           "After unique check. \n" +
  //           ("Same element is " + (compareResult ? " not " : "") + "found."),
  //       },
  //     ]);
  //   };
  // }
};

type fromBlueprintT = (arg: fromBlueprintArgObjectI) => object[];

// * generates array of blueprints with length of base iteration

const fromBlueprint: fromBlueprintT = ({ inputs, options }) => {
  if (inputs.blueprint === undefined) throw Error("undefined blueprint");

  const arr: { key: string; value: unknown }[] = convertToRealBlueprint(
    inputs.blueprint.savedBlueprint
  ).map((e) => {
    const copy: blueprintElementI = deepCloneObjectLite(e) as blueprintElementI;

    const valueData = copy.valueData;

    if (valueData.type === "function") {
      const functionSettingIndex = functionSettings.findIndex(
        (e) => e.name === valueData.functionName
      );
      return {
        key: copy.key,
        value: functionSettings[functionSettingIndex].functionCall(
          valueData.argObject
        ) as unknown,
      };
    } else if (valueData.type === "static") {
      return {
        key: copy.key,
        value: valueData.staticValue,
      };
    }

    return { key: copy.key, value: "null" };
  });

  const blueprintArgument: blueprint = {};

  arr.map((e) => {
    blueprintArgument[e.key] = e.value;
  });

  const randomObjectArray = randomObjects(
    blueprintArgument,
    inputs.baseIteration
  );

  return randomCustomFunction(
    () => {
      return randomFromArray(randomObjectArray);
    },
    { ...options, reCreateLimit: 150, showLogs: false }
  ) as object[];
};

const listOfTLDs = [
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "mil",
  "int",
  "io",
  "co",
  "uk",
  "ca",
  "au",
  "de",
  "fr",
  "jp",
  "it",
  "es",
  "br",
  "cn",
  "us",
  "mx",
  "se",
  "ch",
  "nl",
  "no",
  "at",
  "dk",
  "pl",
  "be",
  "fi",
];

type randomEmailT = (arg: fromBlueprintArgObjectI) => object[];

const randomEmail: randomEmailT = ({ options }) => {
  return randomCustomFunction(
    () => {
      return (
        randomString(1, 3, {
          lib: ["name"],
          separator: "",
        }).toLowerCase() +
        "@" +
        randomString(1, 1, {
          lib: ["noun", "adjective"],
          separator: "",
        }).toLowerCase() +
        "." +
        (randomFromArray(listOfTLDs) as string)
      );
    },
    { ...options, reCreateLimit: 150, showLogs: false }
  ) as object[];
};

export interface functionElementI {
  type: "fundamental" | "specific";
  name: allFunctionNames;
  uiName: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  functionCall: Function;
}
[];

const functionSettings: functionElementI[] = [
  {
    type: "fundamental",
    name: "randomNumbers",
    uiName: "number",
    functionCall: randomNumbersArg,
  },
  {
    type: "fundamental",
    name: "gradualValue",
    uiName: "gradual value",
    functionCall: gradualValueArg,
  },
  {
    type: "fundamental",
    name: "randomsFromArray",
    uiName: "item from array",
    functionCall: randomsFromArrayArg,
  },
  {
    type: "fundamental",
    name: "randomIDs",
    uiName: "identifier",
    functionCall: randomIDsArg,
  },
  {
    type: "fundamental",
    name: "randomCustomFunction",
    uiName: "custom function",
    functionCall: randomCustomFunctionArg,
  },
  {
    type: "fundamental",
    name: "randomStrings",
    uiName: "string",
    functionCall: randomStringsArg,
  },
  {
    type: "fundamental",
    name: "fromBlueprint",
    uiName: "object from vault",
    functionCall: fromBlueprint,
  },
  {
    type: "fundamental",
    name: "randomArrays",
    uiName: "array from array",
    functionCall: randomArraysArg,
  },
  {
    type: "specific",
    name: "randomEmail",
    uiName: "email",
    functionCall: randomEmail,
  },
];

export {
  getDefaultArgObject,
  setProgressUpdate,
  getArgObject_TYPE,
  functionSettings,
  fromBlueprint,
};
