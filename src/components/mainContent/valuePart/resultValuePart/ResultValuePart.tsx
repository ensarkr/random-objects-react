import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { valueDataI } from "../../../../functions/blueprintFunctions";
import styles from "./resultValuePart.module.css";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useFormInputTextField } from "../../../../hooks/useFormInput";
import WarningIcon from "@mui/icons-material/Warning";
import {
  allRequestTypes_VALUE,
  allResponseTypes_VALUE,
} from "../../../../workers/valueWorker";
import DownloadPart from "../../../downloadPart/DownloadPart";
import PaddedLine from "../../../paddedLine/PaddedLine";

const PaddedLine_Memo = memo(PaddedLine);

export default function ResultValuePart({
  functionData,
}: {
  functionData: valueDataI;
}) {
  const [rawResult, setRawResult] = useState<undefined | unknown[]>(undefined);
  const currentID = useRef<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [disablePlay, setDisablePlay] = useState(false);
  const [recreateToggle, setRecreateToggle] = useState(false);
  const [previewPhase, setPreviewPhase] = useState<
    "empty" | "percentage" | "result"
  >("empty");

  const valueWorkerLastResortArray = useRef<Worker[]>([]);

  const numberOfItems = useFormInputTextField(
    "number of items",
    "positive_integer",
    1,
    undefined
  );

  const valueWorker: Worker = useMemo(() => {
    const newWorker = new Worker(
      new URL("../../../../workers/valueWorker", import.meta.url),
      {
        type: "module",
      }
    );

    // * last resort if they are still working
    valueWorkerLastResortArray.current.map((e) => e.terminate());
    valueWorkerLastResortArray.current = [];
    valueWorkerLastResortArray.current.push(newWorker);

    return newWorker;
  }, [recreateToggle]);

  useEffect(() => {
    const resFunction = (response: MessageEvent<allResponseTypes_VALUE>) => {
      const data = response.data;

      if (currentID.current !== data.workId) {
        return;
      }

      switch (data.type) {
        case "sendProgressUpdate":
          setPercentage(data.percentage);
          break;

        case "sendRandomItems":
          goToResult(data.rawResult);
          break;

        default:
          break;
      }
    };

    valueWorker.addEventListener("message", resFunction);

    return () => {
      valueWorker.removeEventListener("message", resFunction);
      valueWorker.terminate();
    };
  }, [valueWorker]);

  const recreateObjectWorker = useCallback(() => {
    resetPercentage();
    setDisablePlay(false);

    valueWorker.terminate();

    setRecreateToggle((pv) => !pv);
  }, [valueWorker]);

  const resetPercentage = () => {
    setPercentage(0);
  };

  const goToEmpty = () => {
    setRawResult(undefined);
    setPreviewPhase("empty");
    setDisablePlay(false);
  };

  const goToPercentages = () => {
    resetPercentage();
    setPreviewPhase("percentage");
    setDisablePlay(true);
  };

  const goToResult = (rawResult: unknown[]) => {
    setPreviewPhase("result");
    setRawResult(rawResult);
    setDisablePlay(false);
  };

  const preview = useMemo(() => {
    if (previewPhase === "empty")
      return (
        <div className="flexCenter flexColumn">
          <p className="title">Press play button to load the preview.</p>
          <p className="title">Generation utilizes your devices resources.</p>
          <p className="title">Be aware when choosing object quantity.</p>
        </div>
      );
    else if (previewPhase === "percentage") {
      return (
        <Box className="flexCenter flexColumn">
          <Box
            sx={{
              width: "6em",
              height: "6em",
            }}
          >
            <CircularProgress
              sx={{
                "& .MuiCircularProgress-circleDeterminate": {
                  transition: "no",
                },
              }}
              size={"5em"}
              variant="determinate"
              value={percentage}
            />
          </Box>

          <h3>GENERATING...</h3>

          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<WarningIcon />}
            onClick={() => {
              recreateObjectWorker();
              goToEmpty();
            }}
          >
            Terminate Process
          </Button>
        </Box>
      );
    } else if (previewPhase === "result" && rawResult !== undefined) {
      return (
        <PaddedLine_Memo
          paddingRate={0}
          value={rawResult.slice(0, 15)}
        ></PaddedLine_Memo>
      );
    } else return <></>;
  }, [percentage, previewPhase, rawResult, recreateObjectWorker]);

  const generateValues = () => {
    if (!numberOfItems.validateInput(true)) return;

    const realValue = numberOfItems.getRealValue(true);

    if (functionData.type !== "function") return;

    if (realValue && numberOfItems.getRealValue(false) > 0) {
      goToPercentages();
      currentID.current++;

      valueWorker.postMessage({
        type: "getRandomItems",
        workId: currentID.current,
        functionName: functionData.functionName,
        argObject_STR: functionData.argObject_STR,
        numberOfItems: realValue,
      } as allRequestTypes_VALUE);
    }
  };

  return (
    <>
      <Box className="flexSpaceBetween">
        <Box>
          <TextField
            className={styles.textInput}
            variant="standard"
            type="text"
            margin="none"
            placeholder="number of items"
            size="small"
            sx={{ width: "9em" }}
            {...numberOfItems.inputProps}
            helperText={""}
          />
          <IconButton
            color="success"
            disabled={disablePlay || functionData.type !== "function"}
            onClick={generateValues}
          >
            <PlayArrowIcon></PlayArrowIcon>
          </IconButton>
        </Box>
        <DownloadPart
          type="value"
          rawResult={rawResult}
          worker={valueWorker}
        ></DownloadPart>
      </Box>
      PREVIEW
      <Paper
        variant="outlined"
        sx={{
          overflow: previewPhase === "result" ? "scroll" : "auto",
        }}
        className={[
          previewPhase !== "result" ? styles["centeredPreview"] : "",
          styles["preview"],
        ].join(" ")}
      >
        {preview}
      </Paper>
    </>
  );
}
