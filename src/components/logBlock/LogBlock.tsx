import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styles from "./logBlock.module.css";
import { SmallContext } from "../../context/SmallContext";
import { useContext } from "react";

type ListBlockProps =
  | {
      type: "output";
      listArray: outputElementT[];
    }
  | {
      type: "log";
      listArray: logElementT[];
    };

export type logElementT =
  | {
      colorVariant: "normal" | "warning";
      index: number;
      element: unknown;
      log: string;
    }
  | {
      colorVariant: "error";
      log: string;
    };

export type outputElementT = {
  index: number;
  element: unknown;
};

export default function LogBlock({ type, listArray }: ListBlockProps) {
  const smallStatus = useContext(SmallContext);

  return (
    <>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ width: "5%", boxSizing: "border-box" }}
                align="left"
              >
                index
              </TableCell>
              <TableCell
                sx={{ width: "40%", boxSizing: "border-box" }}
                align="left"
              >
                {type === "output" ? "" : "description"}
              </TableCell>
              <TableCell
                sx={{ width: "50%", boxSizing: "border-box" }}
                align="left"
              >
                element
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.logs}>
            {type === "output"
              ? listArray.map((outputElement, i) => (
                  <TableRow key={i}>
                    <TableCell align="center">{outputElement.index}</TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left">
                      {smallStatus === "<1000" || smallStatus === "<500" ? (
                        JSON.stringify(outputElement.element, null, 4)
                      ) : (
                        <pre style={{ margin: 0 }}>
                          {JSON.stringify(outputElement.element, null, 4)}
                        </pre>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              : listArray.map((logElement, i) => (
                  <TableRow
                    key={i}
                    sx={[
                      logElement.colorVariant === "error"
                        ? { backgroundColor: "var(--error)" }
                        : logElement.colorVariant === "warning"
                        ? { backgroundColor: "gray" }
                        : {},
                    ]}
                  >
                    <TableCell align="center">
                      {logElement.colorVariant === "error"
                        ? ""
                        : logElement.index}
                    </TableCell>
                    <TableCell align="left">{logElement.log}</TableCell>
                    <TableCell align="left">
                      {logElement.colorVariant === "error" ? (
                        ""
                      ) : smallStatus === "<1000" || smallStatus === "<500" ? (
                        JSON.stringify(logElement.element, null, 4)
                      ) : (
                        <pre style={{ margin: 0 }}>
                          {JSON.stringify(logElement.element, null, 4)}
                        </pre>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
