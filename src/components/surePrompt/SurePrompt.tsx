import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function SurePrompt({
  showSurePrompt,
  setShowSurePrompt,
  surePromptInfo,
}: {
  showSurePrompt: boolean;
  setShowSurePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  surePromptInfo:
    | {
        title: string;
        message: string;
        onTrue: () => void;
        onFalse: () => void;
      }
    | undefined;
}) {
  if (surePromptInfo === undefined) return <></>;

  return (
    <>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={showSurePrompt}
        onClick={() => {
          setShowSurePrompt(false);
          surePromptInfo.onFalse();
        }}
      >
        <DialogTitle>{surePromptInfo.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{surePromptInfo.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSurePrompt(false);
              surePromptInfo.onFalse();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowSurePrompt(false);
              surePromptInfo.onTrue();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
