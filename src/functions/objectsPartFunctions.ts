import {
  blueprintElementI,
  saveElementToBlueprint,
} from "./blueprintFunctions";
import { convertToVaultBlueprint } from "./vaultFunctions";
import { allRequestTypes_OBJECT } from "../workers/objectWorker";

const processDuplicate = (blueprintArray: blueprintElementI[]) => {
  const keyArray: string[] = blueprintArray.map((e) => e.key);

  let resultBlueprintArray: blueprintElementI[] = [...blueprintArray];

  for (let i = 0; i < blueprintArray.length; i++) {
    let duplicate = false;

    if (
      keyArray
        .slice(0, i)
        .concat(keyArray.slice(i + 1, keyArray.length))
        .includes(keyArray[i])
    ) {
      duplicate = true;
    }

    if (duplicate && blueprintArray[i].key.length > 0)
      resultBlueprintArray = saveElementToBlueprint(resultBlueprintArray, {
        ...blueprintArray[i],
        duplicateKey: true,
      });
    else if (blueprintArray[i].duplicateKey !== false)
      resultBlueprintArray = saveElementToBlueprint(resultBlueprintArray, {
        ...blueprintArray[i],
        duplicateKey: false,
      });
  }

  return resultBlueprintArray;
};

const checkForDuplicate = (blueprintArray: blueprintElementI[]) => {
  const keyArray: string[] = blueprintArray.map((e) => e.key);

  for (let i = 0; i < blueprintArray.length; i++) {
    if (keyArray.slice(i + 1, keyArray.length).includes(keyArray[i])) {
      return true;
    }
  }

  return false;
};

const validateBlueprint = (
  blueprint: blueprintElementI[],
  setBlueprint?: React.Dispatch<React.SetStateAction<blueprintElementI[]>>
) => {
  if (blueprint.length === 0) return false;

  let result = true;
  for (let i = 0; i < blueprint.length; i++) {
    if (
      blueprint[i].key.length === 0 ||
      blueprint[i].valueData.type === "empty"
    ) {
      if (setBlueprint !== undefined) {
        setBlueprint((pv) =>
          saveElementToBlueprint(pv, {
            ...blueprint[i],
            emptyErrorKey: blueprint[i].key.length === 0,
            emptyErrorValue: blueprint[i].valueData.type === "empty",
          })
        );
      }

      result = false;
      continue;
    }
  }

  if (!result) return false;
  if (checkForDuplicate(blueprint)) return false;
  return true;
};

const createRandomObjects = (
  number: number,
  blueprint: blueprintElementI[],
  setBlueprintArray: React.Dispatch<React.SetStateAction<blueprintElementI[]>>,
  objectWorker: Worker,
  currentId: number
) => {
  if (!validateBlueprint(blueprint, setBlueprintArray)) return;

  objectWorker.postMessage({
    type: "getRandomObjects",
    serializableBlueprint: convertToVaultBlueprint(blueprint),
    numberOfObjects: number,
    workId: currentId,
  } as allRequestTypes_OBJECT);
};

export {
  processDuplicate,
  checkForDuplicate,
  validateBlueprint,
  createRandomObjects,
};
