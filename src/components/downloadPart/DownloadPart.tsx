import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import styles from "./downloadPart.module.css";
import DownloadIcon from "@mui/icons-material/Download";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  useFormInputCheck,
  useFormInputTextField,
} from "../../hooks/useFormInput";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  downloadFileFromBlueprint,
  turnBlueprintToOutput,
  turnValueArrayToOutput,
} from "../../functions/downloadFunctions";
import CustomSnackbar from "../customSnackbar/CustomSnackbar";
import useCustomSnackbar from "../../hooks/useCustomSnackbar";
import {
  allRequestTypes_OBJECT,
  allResponseTypes_OBJECT,
} from "../../workers/objectWorker";
import {
  allRequestTypes_VALUE,
  allResponseTypes_VALUE,
} from "../../workers/valueWorker";
import CloseIcon from "@mui/icons-material/Close";
import { SmallContext } from "../../context/SmallContext";

export type allOutputOptions = "JSON" | "SQL";

type DownloadPartProps =
  | {
      type: "object";
      rawResult: object[] | undefined;
      worker: Worker;
    }
  | {
      type: "value";
      rawResult: unknown[] | undefined;
      worker: Worker;
    };

export default function DownloadPart({
  type,
  rawResult,
  worker,
}: DownloadPartProps) {
  const [showDownloadDialog, setShowDownloadDialog] = useState<boolean>(false);
  const [outputOption, setOutputOption] = useState<allOutputOptions>("JSON");
  const [outputText, setOutputText] = useState<string | undefined>(undefined);

  const [downloadPhase, setDownloadPhase] = useState<"preview" | "file">(
    "preview"
  );

  const currentId = useRef<number>(0);

  const tableName = useFormInputTextField(
    "table name",
    "string",
    "",
    undefined
  );
  const columnName = useFormInputTextField(
    "column name",
    "string",
    "",
    undefined
  );
  const fileName = useFormInputTextField(
    "file name",
    "string",
    "randomObjects",
    undefined
  );
  const minimizeFile = useFormInputCheck(false, undefined);

  const customSnackbar = useCustomSnackbar();

  const smallStatus = useContext(SmallContext);

  useEffect(() => {
    // * listen result from worker
    const resFunction = (
      response: MessageEvent<allResponseTypes_OBJECT | allResponseTypes_VALUE>
    ) => {
      const data = response.data;

      if (currentId.current !== data.workId) {
        return;
      }

      switch (data.type) {
        case "sendOutputText":
          setOutputText(data.outputText);
          break;

        default:
          break;
      }
    };

    worker.addEventListener("message", resFunction);

    return () => {
      worker.removeEventListener("message", resFunction);
    };
  }, [worker]);

  const validateForm = useCallback(
    (informUser: boolean) => {
      if (informUser) {
        if (!fileName.validateInput(informUser)) return false;

        if (outputOption === "SQL" && !tableName.validateInput(informUser))
          return false;

        if (
          outputOption === "SQL" &&
          type === "value" &&
          !columnName.validateInput(informUser)
        )
          return false;
      }

      return true;
    },
    [columnName, fileName, outputOption, tableName, type]
  );

  const getExtraForm = useCallback(() => {
    if (outputOption === "SQL")
      return (
        <>
          <TextField
            fullWidth
            label="table name"
            variant="standard"
            type="text"
            margin="normal"
            {...tableName.inputProps}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              tableName.inputProps.onChange(event);
              setDownloadPhase("preview");
            }}
          />

          {type === "value" && (
            <TextField
              fullWidth
              label="column name"
              variant="standard"
              type="text"
              margin="normal"
              {...columnName.inputProps}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                columnName.inputProps.onChange(event);
                setDownloadPhase("preview");
              }}
            />
          )}
        </>
      );
    else return <></>;
  }, [columnName.inputProps, outputOption, tableName.inputProps, type]);

  const getBottomPart = () => {
    if (rawResult === undefined) return <></>;
    if (downloadPhase === "preview") {
      if (type === "object") {
        return (
          <pre>
            {turnBlueprintToOutput(
              rawResult,
              outputOption,
              minimizeFile.getRealValue(),
              15,
              tableName.getRealValue(false)
            )}
          </pre>
        );
      } else if (type === "value") {
        return (
          <pre>
            {turnValueArrayToOutput(
              rawResult,
              outputOption,
              minimizeFile.getRealValue(),
              15,
              tableName.getRealValue(false),
              columnName.getRealValue(false)
            )}
          </pre>
        );
      }
    } else if (downloadPhase === "file") {
      return outputText === undefined ? (
        <span className="title">CREATING...</span>
      ) : (
        <>
          <IconButton
            disabled={rawResult === undefined || rawResult.length === 0}
            onClick={() => {
              navigator.clipboard
                .writeText(outputText)
                .then(() => {
                  customSnackbar.showSnackbar(
                    "success",
                    "Text copied to clipboard."
                  );
                })
                .catch((e) => console.log(e));
            }}
          >
            <ContentCopyIcon
              sx={{ width: "4em", height: "4em" }}
            ></ContentCopyIcon>
          </IconButton>
          <IconButton
            disabled={rawResult === undefined || rawResult.length === 0}
            onClick={() => {
              if (
                downloadFileFromBlueprint(
                  outputOption,
                  outputText,
                  fileName.getRealValue(false)
                )
              )
                setShowDownloadDialog(true);
            }}
          >
            <DownloadIcon sx={{ width: "4em", height: "4em" }}></DownloadIcon>
          </IconButton>
        </>
      );
    }
  };

  return (
    <>
      <IconButton
        disabled={rawResult === undefined || rawResult.length === 0}
        color={"primary"}
        onClick={() => {
          setShowDownloadDialog(true);
        }}
      >
        <DownloadIcon></DownloadIcon>
      </IconButton>
      {rawResult && (
        <Dialog
          maxWidth={"sm"}
          fullScreen={smallStatus === "<500"}
          fullWidth
          scroll="body"
          open={showDownloadDialog}
          onClose={() => setShowDownloadDialog(false)}
        >
          <DialogTitle className="flexSpaceBetween">
            {"Copy or Download"}

            <IconButton
              disabled={rawResult === undefined || rawResult.length === 0}
              onClick={() => {
                setShowDownloadDialog(false);
              }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Output Type</InputLabel>
              <Select
                value={outputOption}
                label="Output Type"
                onChange={(event) => {
                  setOutputOption(event.target.value as allOutputOptions);
                  setDownloadPhase("preview");
                }}
              >
                <MenuItem value={"JSON"}>JSON</MenuItem>
                <MenuItem value={"SQL"}>SQL</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ m: "2em 0" }}></Divider>

            <TextField
              fullWidth
              label="file name"
              variant="standard"
              type="text"
              margin="dense"
              {...fileName.inputProps}
            />

            {getExtraForm()}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  {...minimizeFile.inputProps}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    minimizeFile.inputProps.onChange(event);
                    setDownloadPhase("preview");
                  }}
                />
              }
              label="minimize file"
            />
            <Box className="flexEnd">
              <Button
                variant="outlined"
                onClick={() => {
                  setDownloadPhase("preview");
                }}
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOutputText(undefined);

                  if (rawResult === undefined) return;

                  if (!validateForm(true)) return;

                  setDownloadPhase("file");

                  currentId.current++;

                  switch (type) {
                    case "object":
                      {
                        worker.postMessage({
                          type: "createOutputText",
                          workId: currentId.current,
                          turnToOutputArguments: [
                            rawResult,
                            outputOption,
                            minimizeFile.getRealValue(),
                            undefined,
                            outputOption === "SQL"
                              ? tableName.getRealValue(false)
                              : undefined,
                          ],
                        } as allRequestTypes_OBJECT);
                      }

                      break;

                    case "value":
                      {
                        worker.postMessage({
                          type: "createOutputText",
                          workId: currentId.current,
                          turnToOutputArguments: [
                            rawResult,
                            outputOption,
                            minimizeFile.getRealValue(),
                            undefined,
                            outputOption === "SQL"
                              ? tableName.getRealValue(false)
                              : undefined,
                            outputOption === "SQL"
                              ? columnName.getRealValue(false)
                              : undefined,
                          ],
                        } as allRequestTypes_VALUE);
                      }

                      break;

                    default:
                      break;
                  }
                }}
              >
                Create File
              </Button>
            </Box>
            <Divider sx={{ m: "2em 0" }}></Divider>

            <Paper
              variant="outlined"
              className={[
                styles.bottomPaper,
                styles[downloadPhase + "PhasePaper"],
                styles.preview,
              ].join(" ")}
            >
              {getBottomPart()}
            </Paper>
          </DialogContent>
          <CustomSnackbar
            {...customSnackbar.customSnackbarProps}
          ></CustomSnackbar>
        </Dialog>
      )}
    </>
  );
}
