import { convertToRealValue } from "../hooks/useFormInput";
import {
  allMainInputTypes,
  allMainOptionTypes,
} from "../typings/randomObjects";
import {
  allArgObjectIs_,
  allFunctionNames,
  functionI,
  functionSettings,
  getArgObject_TYPE,
  getDefaultArgObject,
  getDefaultArgObjectReturnArgI,
} from "./formFunctions";
import { blueprintElementI_vault } from "./vaultFunctions";

export interface blueprintElementI {
  id: string;
  key: string;
  valueData: valueDataI;
  duplicateKey: boolean;
  emptyErrorKey?: boolean;
  emptyErrorValue?: boolean;
  buttonText: string;
}

export type valueDataI = emptyI | staticI | functionI;

export interface emptyI {
  type: "empty";
}

export interface staticI {
  type: "static";
  staticValue: string;
}

// * add element to blueprint element

type addElementT = (
  blueprintArray: blueprintElementI[],
  newItem: blueprintElementI
) => blueprintElementI[];

const addElement: addElementT = (blueprintArray, newItem) => {
  return [...blueprintArray, newItem];
};

// * save already existing element

export type saveElementToBlueprintT = (
  blueprintArray: blueprintElementI[],
  savedItem: blueprintElementI
) => blueprintElementI[];

const saveElementToBlueprint: saveElementToBlueprintT = (
  blueprintArray,
  savedItem
) => {
  const indexOfSaved = blueprintArray.findIndex((e) => e.id === savedItem.id);
  const blueprintArrayCopy = [...blueprintArray];
  blueprintArrayCopy[indexOfSaved] = savedItem;

  return blueprintArrayCopy;
};

// * remove existing element

type removeElementT = (
  blueprintArray: blueprintElementI[],
  removedItem: blueprintElementI
) => blueprintElementI[];

const removeElement: removeElementT = (blueprintArray, removedItem) => {
  const indexOfRemoved = blueprintArray.findIndex(
    (e) => e.id === removedItem.id
  );
  const blueprintArrayCopy = blueprintArray
    .slice(0, indexOfRemoved)
    .concat(blueprintArray.slice(indexOfRemoved + 1, blueprintArray.length));

  return blueprintArrayCopy;
};

// * call function from function setting

type callFunctionT = (functionData: {
  functionName: allFunctionNames;
  argObject: { inputs: allMainInputTypes; options: allMainOptionTypes };
}) => unknown[];

const callFunction: callFunctionT = (functionData) => {
  const functionSettingIndex = functionSettings.findIndex(
    (e) => e.name === functionData.functionName
  );

  if (functionSettingIndex === -1) return [];

  return functionSettings[functionSettingIndex].functionCall(
    functionData.argObject
  ) as unknown[];
};

export type keyInfo = { id: number; key: string };

// * convert vault blueprint to real blueprint

type convertToRealBlueprintT = (
  blueprint_STR: blueprintElementI_vault[]
) => blueprintElementI[];

const convertToRealBlueprint: convertToRealBlueprintT = (blueprint_STR) => {
  const realBlueprint: blueprintElementI[] = blueprint_STR.map((e) => {
    const newValueData: blueprintElementI["valueData"] =
      e.valueData.type === "static"
        ? e.valueData
        : ({
            type: "function",
            functionName: e.valueData.functionName,
            argObject: convertToArgObject(
              e.valueData.argObject_STR,
              e.valueData.functionName
            ),
            argObject_STR: e.valueData.argObject_STR,
          } as functionI);

    return {
      id: e.id,
      key: e.key,
      valueData: newValueData,
      duplicateKey: false,
      buttonText: e.buttonText,
    };
  });

  return realBlueprint;
};

// * convert vault argObject to real argObject

type convertToArgObjectT = <T extends allFunctionNames>(
  argObject_STR: allArgObjectIs_<string>,
  functionName: T
) => getDefaultArgObjectReturnArgI<T> | null;

const convertToArgObject: convertToArgObjectT = (
  argObject_STR,
  functionName
) => {
  const realBlueprintElement = getDefaultArgObject(functionName);
  const typeBlueprintElement = getArgObject_TYPE(functionName);

  if (typeBlueprintElement === null) return null;

  for (let i = 0; i < Object.keys(argObject_STR.inputs).length; i++) {
    const key = Object.keys(argObject_STR.inputs)[
      i
    ] as keyof typeof argObject_STR.inputs;

    realBlueprintElement.inputs[key] = convertToRealValue(
      typeBlueprintElement.inputs[key],
      argObject_STR.inputs[key]
    );
  }

  for (let i = 0; i < Object.keys(argObject_STR.options).length; i++) {
    const key = Object.keys(argObject_STR.options)[
      i
    ] as keyof typeof argObject_STR.options;
    
    // @ts-ignore
    realBlueprintElement.options[key] = convertToRealValue(
      typeBlueprintElement.options[key],
      argObject_STR.options[key]
    );
  }

  return realBlueprintElement as getDefaultArgObjectReturnArgI<
    typeof functionName
  >;
};

export {
  addElement,
  saveElementToBlueprint,
  removeElement,
  callFunction,
  convertToRealBlueprint,
  convertToArgObject,
};
