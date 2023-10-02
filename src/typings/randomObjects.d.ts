export interface generateFunctionReturn {
  items: unknown[] | null;
  functionData: functionData;
}
export interface functionData {
  arguments: functionArguments;
  functionCall: generateFromArgObjectType;
}
export interface functionArguments {
  inputs?: allMainInputTypes;
  options?: baseFunctionOptions & allMainOptionTypes;
}
export interface baseFunctionOptions {
  numberOfItems?: number;
  unique?: boolean;
  customMap?(item: unknown, index: number): unknown;
  customCompare?(item: unknown, items: unknown[], index: number): boolean;
  progressUpdate?: {
    uniqueCheckFailed?: (functionName: string, limit?: number | null) => void;
    afterItemCreated?: (
      item: unknown,
      index: number,
      functionName: string
    ) => void;
    afterMap?: (item: unknown, index: number, functionName: string) => void;
    afterCompare?: (
      item: unknown,
      index: number,
      functionName: string,
      compareResult: boolean
    ) => void;
    afterUnique?: (
      item: unknown,
      index: number,
      functionName: string,
      uniqueResult: boolean
    ) => void;
  };
  showLogs?: boolean;
  reCreateLimit?: number | null;
}
export type allMainInputTypes =
  | gradualValueInputs
  | randomNumbersInputs
  | randomsFromArrayInputs
  | randomIDsInputs
  | randomCustomFunctionInputs
  | randomStringsInputs
  | randomArraysInputs;
export type allMainOptionTypes =
  | gradualValueOptions
  | randomNumbersOptions
  | randomsFromArrayOptions
  | randomIDsOptions
  | randomCustomFunctionOptions
  | randomStringsOptions
  | randomArraysOptions;

export type allMainInputTypes_STR = {
  [K in
    | keyof gradualValueInputs
    | keyof randomNumbersInputs
    | keyof randomHexColorsInputs
    | keyof randomsFromArrayInputs
    | keyof randomIDsInputs
    | keyof randomCustomFunctionInputs
    | keyof randomStringsInputs
    | keyof randomEmailsInputs]?: string;
};

export type allMainOptionTypes_STR = {
  [K in
    | keyof gradualValueOptions
    | keyof randomNumbersOptions
    | keyof randomHexColorsOptions
    | keyof randomsFromArrayOptions
    | keyof randomIDsOptions
    | keyof randomCustomFunctionOptions
    | keyof randomStringsOptions
    | keyof randomEmailsOptions]?: string;
};
type generateFromArgObjectType = ({
  inputs,
  options,
}: {
  inputs: allMainInputTypes;
  options: allMainOptionTypes;
}) => unknown[] | generateFunctionReturn;
export interface randomNumbersOptions
  extends randomNumberOptions,
    baseFunctionOptions {}
export interface randomNumberOptions {
  onlyIntegers?: boolean;
  maximumDigitsAfterPoint?: number;
}
export interface randomNumbersInputs {
  starting: number;
  ending: number;
}
export type randomNumberType = (
  starting: number,
  ending: number,
  options?: randomNumberOptions
) => number;
export type randomNumbersType = (
  starting: number,
  ending: number,
  options?: randomNumbersOptions
) => generateFunctionReturn | unknown[];
export type randomNumbersArgType = ({
  inputs,
  options,
}: {
  inputs: randomNumbersInputs;
  options: randomNumbersOptions;
}) => generateFunctionReturn | unknown[];
export interface randomsFromArrayOptions
  extends baseFunctionOptions,
    randomFromArrayOptions {
  keepOrder?: boolean;
}
export interface randomFromArrayOptions {}
export interface randomsFromArrayInputs {
  arrayOfItems: unknown[];
}
export type randomFromArrayType = (
  arrayOfItems: unknown[],
  options?: randomFromArrayOptions
) => unknown;
export type randomsFromArrayType = (
  arrayOfItems: unknown[],
  options?: randomsFromArrayOptions
) => generateFunctionReturn | unknown[];
export type randomsFromArrayArgType = ({
  inputs,
  options,
}: {
  inputs: randomsFromArrayInputs;
  options: randomsFromArrayOptions;
}) => generateFunctionReturn | unknown[];
export interface randomIDsOptions
  extends baseFunctionOptions,
    randomIDOptions {}
export interface randomIDOptions {
  charLib?: string[];
}
export interface randomIDsInputs {
  minIDLength: number;
  maxIDLength: number;
}
export type randomIDType = (
  minIDLength: number,
  maxIDLength: number,
  options?: randomIDOptions
) => string;
export type randomIDsType = (
  minIDLength: number,
  maxIDLength: number,
  options?: randomIDsOptions
) => generateFunctionReturn | unknown[];
export type randomIDsArgType = ({
  inputs,
  options,
}: {
  inputs: randomIDsInputs;
  options: randomIDsOptions;
}) => generateFunctionReturn | unknown[];
export interface gradualValueOptions extends baseFunctionOptions {
  incrementValue?: number;
}
export interface gradualValueInputs {
  starting: number;
}
export type gradualValueType = (
  starting: number,
  options?: gradualValueOptions
) => generateFunctionReturn | unknown[];
export type gradualValueArgType = ({
  inputs,
  options,
}: {
  inputs: gradualValueInputs;
  options: gradualValueOptions;
}) => generateFunctionReturn | unknown[];
export interface randomCustomFunctionOptions extends baseFunctionOptions {}
export interface randomCustomFunctionInputs {
  customFunction: (index: number) => unknown;
}
export type randomCustomFunctionType = (
  customFunction: (index: number) => unknown,
  options?: randomCustomFunctionOptions
) => generateFunctionReturn | unknown[];
export type randomCustomFunctionArgType = ({
  inputs,
  options,
}: {
  inputs: randomCustomFunctionInputs;
  options: randomCustomFunctionOptions;
}) => generateFunctionReturn | unknown[];
export interface randomStringsOptions
  extends baseFunctionOptions,
    randomStringOptions {}
export interface randomStringOptions {
  separator?: string;
  lib?: string[];
}
export interface randomStringsInputs {
  minNumberOfWords: number;
  maxNumberOfWords: number;
}
export type randomStringType = (
  minNumberOfWords: number,
  maxNumberOfWords: number,
  options?: randomStringOptions
) => string;
export type randomStringsType = (
  minNumberOfWords: number,
  maxNumberOfWords: number,
  options?: randomStringsOptions
) => generateFunctionReturn | unknown[];
export type randomStringsArgType = ({
  inputs,
  options,
}: {
  inputs: randomStringsInputs;
  options: randomStringsOptions;
}) => generateFunctionReturn | unknown[];
export interface randomArraysOptions
  extends baseFunctionOptions,
    randomArrayOptions {}
export interface randomArrayOptions {
  minLengthOfArray?: number;
  maxLengthOfArray?: number;
  keepOrder?: boolean;
  allowDuplicates?: boolean;
}
export interface randomArraysInputs {
  arrayOfItems: unknown[];
}
export type randomArrayType = (
  arrayOfItems: unknown[],
  options?: randomArrayOptions
) => unknown[];
export type randomArraysType = (
  arrayOfItems: unknown[],
  options?: randomArraysOptions
) => generateFunctionReturn | unknown[][];
export type randomArraysArgType = ({
  inputs,
  options,
}: {
  inputs: randomArraysInputs;
  options: randomsFromArrayOptions;
}) => generateFunctionReturn | unknown[];
export interface blueprint {
  [key: string]: generateFunctionReturn | unknown;
}
export type randomObjectsType = (
  blueprint: blueprint,
  numberOfItems: number,
  optionsOverall?: {
    showLogs?: boolean;
    progressUpdate?: (index: number) => void;
  }
) => object[];
declare const _default: {
  randomNumber: randomNumberType;
  randomNumbers: randomNumbersType;
  randomNumbersArg: randomNumbersArgType;
  gradualValue: gradualValueType;
  gradualValueArg: gradualValueArgType;
  randomFromArray: randomFromArrayType;
  randomsFromArray: randomsFromArrayType;
  randomsFromArrayArg: randomsFromArrayArgType;
  randomID: randomIDType;
  randomIDs: randomIDsType;
  randomIDsArg: randomIDsArgType;
  randomCustomFunction: randomCustomFunctionType;
  randomCustomFunctionArg: randomCustomFunctionArgType;
  randomString: randomStringType;
  randomStrings: randomStringsType;
  randomStringsArg: randomStringsArgType;
  randomArray: randomArrayType;
  randomArrays: randomArraysType;
  randomArraysArg: randomArraysArgType;
  randomObjects: randomObjectsType;
};
export = _default;
