import { useState } from "react";
import { SnackbarMessage } from "../components/customSnackbar/CustomSnackbar";

type allSnackbarTypes = "error" | "success" | "info" | "warning";
export type showSnackBarT = (type: allSnackbarTypes, message: string) => void;

export default function useCustomSnackbar() {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);

  const showSnackbar: showSnackBarT = (type, message) => {
    setSnackPack((prev) => [
      ...prev,
      { type, message, key: new Date().getTime() },
    ]);
  };

  return {
    customSnackbarProps: {
      snackPack,
      setSnackPack,
    },
    showSnackbar,
  };
}
