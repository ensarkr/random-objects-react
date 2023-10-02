import { allOutputOptions } from "../components/downloadPart/DownloadPart";

// * turns rawResult of blueprint to sql text

type turnBlueprintToSqlT = (
  rawResult: object[],
  tableName: string,
  limit: number | undefined,
  minimizeText: boolean
) => string;

const turnBlueprintToSql: turnBlueprintToSqlT = (
  rawResult,
  tableName,
  limit,
  minimizeText
) => {
  const processArray = rawResult.slice(0, limit);

  const keys: string[] = Object.keys(processArray[0]);

  let resultString = "INSERT INTO " + tableName + " (";

  for (let i = 0; i < keys.length; i++) {
    resultString += "`" + keys[i] + "`";

    if (i !== keys.length - 1) {
      resultString += ",";
    }
  }

  resultString += minimizeText ? ") VALUES " : ") \nVALUES \n";

  for (let i = 0; i < processArray.length; i++) {
    resultString += "(";

    for (let ii = 0; ii < keys.length; ii++) {
      const currentValue =
        processArray[i][keys[ii] as keyof (typeof processArray)[typeof i]];

      resultString +=
        typeof currentValue === "number"
          ? (currentValue as number).toString()
          : typeof currentValue !== "object"
          ? "`" + JSON.stringify(currentValue as object).slice(1, -1) + "`"
          : "`" + JSON.stringify(currentValue as object) + "`";

      if (ii !== keys.length - 1) {
        resultString += ",";
      }
    }

    resultString +=
      i !== processArray.length - 1 ? ")," + (minimizeText ? "" : "\n") : ");";
  }

  return resultString;
};

// * turns rawResult of valuePart to sql text

type turnValueArrayToSqlT = (
  rawResult: unknown[],
  tableName: string,
  columnName: string,
  limit: number | undefined,
  minimizeText: boolean
) => string;

const turnValueArrayToSql: turnValueArrayToSqlT = (
  rawResult,
  tableName,
  columnName,
  limit,
  minimizeText
) => {
  const processArray = rawResult.slice(0, limit);

  let resultString = "INSERT INTO " + tableName + " (";

  resultString += "`" + columnName + "`";

  resultString += minimizeText ? ") VALUES " : ") \nVALUES \n";

  for (let i = 0; i < processArray.length; i++) {
    resultString += "(";

    const currentValue = processArray[i];

    resultString +=
      typeof currentValue === "number"
        ? currentValue.toString()
        : typeof currentValue !== "object"
        ? "`" + JSON.stringify(currentValue as object).slice(1, -1) + "`"
        : "`" + JSON.stringify(currentValue as object) + "`";

    resultString +=
      i !== processArray.length - 1 ? ")," + (minimizeText ? "" : "\n") : ");";
  }

  return resultString;
};

// * parses blueprint to text

export type turnBlueprintToOutputT = <T extends allOutputOptions>(
  rawResult: object[],
  type: T,
  minimizeFile: boolean,
  limit: number | undefined,
  tableName: T extends "SQL" ? string : undefined
) => string;

const turnBlueprintToOutput: turnBlueprintToOutputT = (
  rawResult,
  type,
  minimizeFile,
  limit,
  tableName
) => {
  switch (type) {
    case "JSON":
      if (limit)
        return JSON.stringify(
          rawResult.slice(0, 15),
          null,
          minimizeFile ? 0 : 4
        );
      else return JSON.stringify(rawResult, null, minimizeFile ? 0 : 4);

    case "SQL":
      if (tableName === undefined) throw Error("Could not find table name.");
      return turnBlueprintToSql(rawResult, tableName, limit, minimizeFile);

    default:
      return "";
  }
};

// * parses valuePart to text

export type turnValueArrayToOutputT = <T extends allOutputOptions>(
  rawResult: unknown[],
  type: T,
  minimizeFile: boolean,
  limit: number | undefined,
  tableName: T extends "SQL" ? string : undefined,
  columnName: T extends "SQL" ? string : undefined
) => string;

const turnValueArrayToOutput: turnValueArrayToOutputT = (
  rawResult,
  type,
  minimizeFile,
  limit,
  tableName,
  columnName
) => {
  switch (type) {
    case "JSON":
      if (limit)
        return JSON.stringify(
          rawResult.slice(0, 15),
          null,
          minimizeFile ? 0 : 4
        );
      else return JSON.stringify(rawResult, null, minimizeFile ? 0 : 4);

    case "SQL":
      if (tableName === undefined) throw Error("Could not find table name.");
      if (columnName === undefined) throw Error("Could not find column name.");
      return turnValueArrayToSql(
        rawResult,
        tableName,
        columnName,
        limit,
        minimizeFile
      );

    default:
      return "";
  }
};

// * creates and starts downloading files

export type downloadFileFromBlueprintT = (
  type: allOutputOptions,
  outputText: string,
  fileName: string
) => boolean;

const downloadFileFromBlueprint: downloadFileFromBlueprintT = (
  type,
  outputText,
  fileName
) => {
  let blobType = "text/plain";

  switch (type) {
    case "JSON":
      blobType = "application/json";
      break;
    case "SQL":
      blobType = "application/octet-stream";
      break;

    default:
      break;
  }

  const downloadAnchor = document.createElement("a");

  const objectsFile = new Blob([outputText], {
    type: blobType,
  });

  downloadAnchor.href = URL.createObjectURL(objectsFile);

  downloadAnchor.download = fileName + (type === "SQL" ? ".sql" : "");

  downloadAnchor.click();

  URL.revokeObjectURL(downloadAnchor.href);

  return true;
};

export {
  turnBlueprintToSql,
  turnBlueprintToOutput,
  downloadFileFromBlueprint,
  turnValueArrayToOutput,
  turnValueArrayToSql,
};
