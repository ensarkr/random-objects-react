import { memo, useEffect, useMemo, useRef, useState } from "react";
import { blueprintElementI } from "../../../../functions/blueprintFunctions";
import styles from "./resultObjectPart.module.css";
import {
  createRandomObjects,
  validateBlueprint,
} from "../../../../functions/objectsPartFunctions";
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
import DownloadPart from "../../../downloadPart/DownloadPart";
import { allResponseTypes_OBJECT } from "../../../../workers/objectWorker";
import WarningIcon from "@mui/icons-material/Warning";
import PaddedLine from "../../../paddedLine/PaddedLine";

const PaddedLine_Memo = memo(PaddedLine);

/*
ResultObjectPart 

Parses blueprint and sends it to ObjectWorker and displays preview.
*/

export default function ResultObjectPart({
  blueprint,
  setBlueprint,
}: {
  blueprint: blueprintElementI[];
  setBlueprint: React.Dispatch<React.SetStateAction<blueprintElementI[]>>;
}) {
  const [rawResult, setRawResult] = useState<undefined | object[]>(undefined);
  const currentID = useRef<number>(0);
  const [overallProgressPercentage, setOverallProgressPercentage] =
    useState<number>(0);
  const [specificProgressPercentage, setSpecificProgressPercentage] =
    useState<number>(0);
  const [disablePlay, setDisablePlay] = useState(false);
  const [recreateToggle, setRecreateToggle] = useState(false);
  const [previewPhase, setPreviewPhase] = useState<
    "empty" | "percentage" | "result"
  >("empty");

  const numberOfObjects = useFormInputTextField(
    "number of objects",
    "positive_integer",
    30,
    undefined
  );

  const objectWorkerLastResortArray = useRef<Worker[]>([]);

  const objectWorker = useMemo(() => {
    const newWorker = new Worker(
      new URL("../../../../workers/objectWorker", import.meta.url),
      {
        type: "module",
      }
    );

    // * last resort if they are still working
    objectWorkerLastResortArray.current.map((e) => e.terminate());
    objectWorkerLastResortArray.current = [];
    objectWorkerLastResortArray.current.push(newWorker);

    return newWorker;
  }, [recreateToggle]);

  useEffect(() => {
    const resFunction = (response: MessageEvent<allResponseTypes_OBJECT>) => {
      const data = response.data;

      if (currentID.current !== data.workId) {
        return;
      }

      switch (data.type) {
        case "sendOverallProgressUpdate":
          setOverallProgressPercentage(data.overallPercentage);
          break;
        case "sendSpecificProgressUpdate":
          setSpecificProgressPercentage(data.specificPercentage);
          break;
        case "sendRandomObjects":
          goToResult(data.rawResult);
          break;

        default:
          break;
      }
    };

    objectWorker.addEventListener("message", resFunction);

    return () => {
      objectWorker.removeEventListener("message", resFunction);
      objectWorker.terminate();
    };
  }, [objectWorker]);

  const recreateObjectWorker = () => {
    setOverallProgressPercentage(0);
    setSpecificProgressPercentage(0);
    setDisablePlay(false);

    objectWorker.terminate();
    setRecreateToggle((pv) => !pv);
  };

  const resetPercentages = () => {
    setOverallProgressPercentage(0);
    setSpecificProgressPercentage(0);
  };

  const goToEmpty = () => {
    setRawResult(undefined);
    setPreviewPhase("empty");
    setDisablePlay(false);
  };

  const goToPercentages = () => {
    resetPercentages();
    setPreviewPhase("percentage");
    setDisablePlay(true);
  };

  const goToResult = (rawResult: object[]) => {
    setPreviewPhase("result");
    setRawResult(rawResult);
    setDisablePlay(false);
  };

  const preview =
    previewPhase === "empty" ? (
      <div className="flexCenter flexColumn">
        <p className="title">Press play button to load the preview.</p>
        <p className="title">Generation utilizes your devices resources.</p>
        <p className="title">Be aware when choosing object quantity.</p>
      </div>
    ) : previewPhase === "percentage" ? (
      <Box className="flexCenter flexColumn">
        <Box
          sx={{
            width: "6em",
            height: "6em",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress
              sx={{
                "& .MuiCircularProgress-circleDeterminate": {
                  transition: "no",
                },
              }}
              size={"4em"}
              variant="determinate"
              value={specificProgressPercentage}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
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
              value={overallProgressPercentage}
            />
          </Box>
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
    ) : previewPhase === "result" && rawResult !== undefined ? (
      <PaddedLine_Memo
        paddingRate={0}
        value={rawResult.slice(0, 15)}
      ></PaddedLine_Memo>
    ) : (
      <></>
    );

  return (
    <>
      <Box className="flexSpaceBetween">
        <Box>
          <TextField
            variant="standard"
            type="text"
            margin="none"
            placeholder="number of objects"
            size="small"
            {...numberOfObjects.inputProps}
            helperText={""}
          />
          <IconButton
            disabled={disablePlay || blueprint.length === 0}
            color={"success"}
            onClick={() => {
              if (
                !validateBlueprint(blueprint, setBlueprint) ||
                !numberOfObjects.validateInput(true)
              )
                return;

              const realValue = numberOfObjects.getRealValue(false);

              goToPercentages();
              currentID.current++;

              createRandomObjects(
                realValue,
                blueprint,
                setBlueprint,
                objectWorker,
                currentID.current
              );
            }}
          >
            <PlayArrowIcon></PlayArrowIcon>
          </IconButton>
        </Box>
        <DownloadPart
          type="object"
          rawResult={rawResult}
          worker={objectWorker}
        ></DownloadPart>
      </Box>
      PREVIEW
      <Paper
        variant="outlined"
        sx={{
          padding: "0.5em",
          height: "calc(100% - 120px)",
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
