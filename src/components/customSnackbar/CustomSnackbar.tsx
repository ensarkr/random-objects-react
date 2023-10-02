import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export interface SnackbarMessage {
  message: string;
  key: number;
  type: allSnackbarTypes;
}
type allSnackbarTypes = "error" | "success" | "info" | "warning";

export default function CustomSnackbar({
  snackPack,
  setSnackPack,
}: {
  snackPack: readonly SnackbarMessage[];
  setSnackPack: React.Dispatch<
    React.SetStateAction<readonly SnackbarMessage[]>
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
    >
      {messageInfo ? (
        <Alert
          severity={messageInfo.message ? messageInfo.type : "info"}
          sx={{ width: "100%" }}
        >
          {messageInfo.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
