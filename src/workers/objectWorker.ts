import { randomObjects } from "random-objects";
import {
  blueprintElementI,
  convertToRealBlueprint,
} from "../functions/blueprintFunctions";
import {
  deepCloneObjectLite,
  functionSettings,
} from "../functions/formFunctions";
import { blueprint } from "../typings/randomObjects";
import { blueprintElementI_vault } from "../functions/vaultFunctions";
import {
  turnBlueprintToOutput,
  turnBlueprintToOutputT,
} from "../functions/downloadFunctions";

export type allRequestTypes_OBJECT = getRandomObjectsT | createOutputTextT;

type getRandomObjectsT = {
  type: "getRandomObjects";
  workId: number;
  serializableBlueprint: blueprintElementI_vault[];
  numberOfObjects: number;
};
type createOutputTextT = {
  type: "createOutputText";
  workId: number;
  turnToOutputArguments: Parameters<turnBlueprintToOutputT>;
};

export type allResponseTypes_OBJECT =
  | sendRandomObjectsT
  | sendOverallProgressUpdateT
  | sendSpecificProgressUpdateT
  | sendOutputTextT;

type sendRandomObjectsT = {
  type: "sendRandomObjects";
  workId: number;
  rawResult: object[];
};
type sendOverallProgressUpdateT = {
  type: "sendOverallProgressUpdate";
  workId: number;
  overallPercentage: number;
};
type sendSpecificProgressUpdateT = {
  type: "sendSpecificProgressUpdate";
  workId: number;
  specificPercentage: number;
};
type sendOutputTextT = {
  type: "sendOutputText";
  workId: number;
  outputText: string;
};

self.onmessage = (request: MessageEvent<allRequestTypes_OBJECT>) => {
  const requestData = request.data;

  switch (requestData.type) {
    case "getRandomObjects":
      {
        const blueprint = convertToRealBlueprint(
          requestData.serializableBlueprint
        );

        // * turns blueprint array to randomObjects parameter

        const arr: { key: string; value: unknown }[] = blueprint.map((e) => {
          const copy: blueprintElementI = deepCloneObjectLite(
            e
          ) as blueprintElementI;

          const valueData = copy.valueData;

          if (valueData.type === "function") {
            const functionSettingIndex = functionSettings.findIndex(
              (e) => e.name === valueData.functionName
            );

            valueData.argObject.options.progressUpdate = {
              afterCompare: (_item, index, _functionName, compareResult) => {
                if (compareResult === true) {
                  self.postMessage({
                    type: "sendSpecificProgressUpdate",
                    workId: requestData.workId,
                    specificPercentage: Math.floor(
                      ((index + 1) / requestData.numberOfObjects) * 100
                    ),
                  } as allResponseTypes_OBJECT);
                  if (index + 1 === requestData.numberOfObjects)
                    self.postMessage({
                      type: "sendSpecificProgressUpdate",
                      workId: requestData.workId,
                      specificPercentage: 100,
                    } as allResponseTypes_OBJECT);
                }
              },
            };

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

        const overallProgressUpdate = (index: number) => {
          const percentage = ((index + 1) / blueprint.length) * 100;

          self.postMessage({
            type: "sendOverallProgressUpdate",
            workId: requestData.workId,
            overallPercentage: percentage,
          } as allResponseTypes_OBJECT);
        };

        const rawResult = randomObjects(
          blueprintArgument,
          requestData.numberOfObjects,
          {
            showLogs: false,
            progressUpdate: overallProgressUpdate,
          }
        );

        self.postMessage({
          type: "sendRandomObjects",
          workId: requestData.workId,
          rawResult: JSON.parse(JSON.stringify(rawResult)) as object[],
        } as allResponseTypes_OBJECT);
      }

      break;

    case "createOutputText":
      {
        const outputText = turnBlueprintToOutput(
          ...requestData.turnToOutputArguments
        );

        self.postMessage({
          type: "sendOutputText",
          workId: requestData.workId,
          outputText,
        } as allResponseTypes_OBJECT);
      }
      break;

    default:
      break;
  }
};
