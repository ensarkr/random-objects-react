import { memo, useState } from "react";
import styles from "./paddedLine.module.css";

const PaddedLine_Memo = memo(PaddedLine);

export default function PaddedLine({
  paddingRate,
  objectKey,
  value,
  end,
}: {
  paddingRate: number;
  objectKey?: string;
  end?: string;
  value: unknown;
}) {
  const paddingEmValue = 1;
  const [isMinimized, setIsMinimized] = useState(false);

  const getHexCode = (value: unknown) => {
    switch (typeof value) {
      case "boolean":
        return "blue";
      case "string":
        return "orange";
      case "number":
      case "bigint":
        return "green";

      default:
        return "black";
    }
  };

  if (typeof value !== "object" && value !== undefined) {
    // * if it is not array or object
    return (
      <p
        style={{
          paddingLeft: (paddingEmValue * paddingRate).toString() + "em",
        }}
        className={styles.paddedLine}
      >
        {objectKey && JSON.stringify(objectKey) + ": "}
        <span style={{ color: getHexCode(value) }}>
          {JSON.stringify(value)}
        </span>
        {objectKey && ","}
        {end && end}
      </p>
    );
  }

  if (Array.isArray(value)) {
    // * if it is array
    // * dont put button first array

    return (
      <div key={"array" + JSON.stringify(value)}>
        <p
          style={{
            marginLeft: (paddingRate * paddingEmValue).toString() + "em",
          }}
          className={styles.paddedLine}
        >
          {paddingRate !== 0 && (
            <button
              className={styles.minimizeButton}
              onClick={() => {
                setIsMinimized((pv) => !pv);
              }}
            >
              {isMinimized ? "+" : "-"}
            </button>
          )}
          {objectKey && objectKey + ": "}
          <span style={{ color: "darkorange" }}>
            {"["}
            {isMinimized && "...]"}
          </span>
          {isMinimized && objectKey && ","}
        </p>
        {!isMinimized && (
          <>
            {(value as unknown[]).map((e, i) => (
              <PaddedLine_Memo
                key={"array_pd_" + JSON.stringify(e) + i.toString()}
                paddingRate={paddingRate + paddingEmValue}
                value={e}
                end={","}
              ></PaddedLine_Memo>
            ))}

            <p
              style={{
                marginLeft: (paddingRate * paddingEmValue).toString() + "em",
              }}
              className={styles.paddedLine}
            >
              <span style={{ color: "darkorange" }}>{"]"}</span>
              {objectKey && ","}
            </p>
          </>
        )}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div>
        <p
          style={{
            marginLeft: (paddingRate * paddingEmValue).toString() + "em",
          }}
          className={styles.paddedLine}
        >
          {
            <button
              className={styles.minimizeButton}
              onClick={() => {
                setIsMinimized((pv) => !pv);
              }}
            >
              {isMinimized ? "+" : "-"}
            </button>
          }
          {objectKey && objectKey + ": "}
          <span style={{ color: "purple" }}>
            {"{"}
            {isMinimized && "...}"}
          </span>
          {isMinimized && end && end}
        </p>
        {!isMinimized && (
          <>
            {Object.keys(value).map((key, i) => (
              <PaddedLine_Memo
                key={
                  "object_pd_" +
                  JSON.stringify(value[key as keyof typeof value]) +
                  i.toString()
                }
                paddingRate={paddingRate + paddingEmValue}
                value={value[key as keyof typeof value]}
                objectKey={key.toString()}
              ></PaddedLine_Memo>
            ))}
            <p
              style={{
                marginLeft: (paddingRate * paddingEmValue).toString() + "em",
              }}
              className={styles.paddedLine}
            >
              <span style={{ color: "purple" }}> {"}"}</span>

              {end && end}
            </p>
          </>
        )}
      </div>
    );
  }

  return <></>;
}
