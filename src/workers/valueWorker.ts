import { convertToArgObject } from "../functions/blueprintFunctions";
import {
  turnValueArrayToOutput,
  turnValueArrayToOutputT,
} from "../functions/downloadFunctions";
import {
  allFunctionNames,
  functionI,
  functionSettings,
} from "../functions/formFunctions";

export type allRequestTypes_VALUE =
  | {
      type: "getRandomItems";
      workId: number;
      functionName: allFunctionNames;
      argObject_STR: functionI["argObject_STR"];
      numberOfItems: number;
    }
  | {
      type: "createOutputText";
      workId: number;
      turnToOutputArguments: Parameters<turnValueArrayToOutputT>;
    };

export type allResponseTypes_VALUE =
  | {
      type: "sendRandomItems";
      workId: number;
      rawResult: unknown[];
    }
  | {
      type: "sendProgressUpdate";
      workId: number;
      percentage: number;
    }
  | {
      type: "sendOutputText";
      workId: number;
      outputText: string;
    };

self.onmessage = (request: MessageEvent<allRequestTypes_VALUE>) => {
  const requestData = request.data;

  switch (requestData.type) {
    case "getRandomItems":
      {
        const argObject = convertToArgObject(
          requestData.argObject_STR,
          requestData.functionName
        ) as functionI["argObject"];

        argObject.options.numberOfItems = requestData.numberOfItems;
        argObject.options.showLogs = false;
        argObject.options.progressUpdate = {
          afterCompare: (_item, index, _functionName, compareResult) => {
            if (compareResult === true) {
              self.postMessage({
                type: "sendProgressUpdate",
                workId: requestData.workId,
                percentage: Math.floor(
                  ((index + 1) / requestData.numberOfItems) * 100
                ),
              } as allResponseTypes_VALUE);
              if (index + 1 === requestData.numberOfItems)
                self.postMessage({
                  type: "sendProgressUpdate",
                  workId: requestData.workId,
                  percentage: 100,
                } as allResponseTypes_VALUE);
            }
          },
        };

        const rawResult = functionSettings
          .find((e) => e.name === requestData.functionName)
          ?.functionCall(argObject) as unknown[];

        self.postMessage({
          type: "sendRandomItems",
          workId: requestData.workId,
          rawResult: JSON.parse(JSON.stringify(rawResult)) as unknown[],
        } as allResponseTypes_VALUE);
      }
      break;

    case "createOutputText":
      {
        const outputText = turnValueArrayToOutput(
          ...requestData.turnToOutputArguments
        );

        self.postMessage({
          type: "sendOutputText",
          workId: requestData.workId,
          outputText,
        } as allResponseTypes_VALUE);
      }
      break;

    default:
      break;
  }
};
