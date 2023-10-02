import React, { useCallback, useContext, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { SetVaultContext, VaultContext } from "../../context/VaultContext";
import {
  doesTitleExist,
  saveBlueprint,
  saveBlueprintElement,
  vaultI,
} from "../../functions/vaultFunctions";
import { IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { blueprintElementI } from "../../functions/blueprintFunctions";
import { getLatestElementDataT_STR } from "../functionForms/FunctionForms";
import { useFormInputTextField } from "../../hooks/useFormInput";
import VaultNoAccess from "../errorDiv/ErrorDiv";

export default function BookmarkBlock({
  options,
}: {
  options:
    | {
        type: "blueprint";
        latestBlueprintArray: blueprintElementI[];
        validateBlueprint: () => boolean;
      }
    | {
        type: "blueprintElement";
        getInitialTitle: () => string;
        getLatestElementData_STR: getLatestElementDataT_STR;
        validateForm: () => boolean;
      };
}) {
  const bookmarkTitle = useFormInputTextField(
    "bookmark title",
    "string",
    "",
    undefined
  );
  const [open, setOpen] = useState(false);
  const [buttonType, setButtonType] = useState<"primary" | "error">("primary");

  const vault = useContext(VaultContext);
  const setVault = useContext(SetVaultContext);

  // * if forms are validated set initial title and open the dialog
  const handleClickOpen = useCallback(() => {
    switch (options.type) {
      case "blueprint":
        if (options.validateBlueprint()) {
          let initialTitle = "";

          if (vault && vault.savedBlueprints) {
            let currentLength = vault.savedBlueprints.length + 1;

            do {
              const newTitle = "Blueprint - " + currentLength.toString();

              const doesIt = doesTitleExist(vault, "blueprint", newTitle);
              if (doesIt === null) break;

              if (doesIt === false) {
                initialTitle = newTitle;
              } else {
                currentLength++;
              }
            } while (initialTitle === "");
          }

          bookmarkTitle.setValue(initialTitle);
          validateTitle(initialTitle, vault);
          setOpen(true);
        }
        break;
      case "blueprintElement":
        if (options.validateForm()) {
          const initialTitle = options.getInitialTitle();
          bookmarkTitle.setValue(initialTitle);
          validateTitle(initialTitle, vault);
          setOpen(true);
        }
        break;
      default:
        break;
    }
  }, [options, bookmarkTitle, vault]);

  const handleClose = () => {
    setOpen(false);
  };

  // * save it to vault
  const handleBookmark = useCallback(
    (
      vault: vaultI | null,
      setVault: React.Dispatch<React.SetStateAction<vaultI | null>> | null
    ) => {
      if (!bookmarkTitle.validateInput(true)) return;

      switch (options.type) {
        case "blueprint":
          saveBlueprint(
            vault,
            setVault,
            bookmarkTitle.getRealValue(false),
            options.latestBlueprintArray,
            true
          );

          break;
        case "blueprintElement":
          {
            const latestElementData_STR =
              options.getLatestElementData_STR(false);

            if (latestElementData_STR === null) return;

            saveBlueprintElement(
              vault,
              setVault,
              bookmarkTitle.getRealValue(false),
              latestElementData_STR,
              true
            );
          }
          break;
        default:
          break;
      }

      setOpen(false);
    },
    [options, bookmarkTitle]
  );

  // * check if title already exists
  const validateTitle = useCallback(
    (title: string, vault: vaultI | null) => {
      if (
        title.trim().length > 0 &&
        doesTitleExist(vault, options.type, title.trim())
      ) {
        bookmarkTitle.setShowError(true);
        bookmarkTitle.setErrorMessage("This title already exists.");
        setButtonType("error");
      } else {
        setButtonType("primary");
        bookmarkTitle.setShowError(false);
      }
    },
    [vault, bookmarkTitle]
  );

  return (
    <>
      <IconButton
        type="button"
        onClick={handleClickOpen}
        size="small"
        color="secondary"
      >
        <BookmarkIcon></BookmarkIcon>
      </IconButton>
      {vault === null ? (
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
          <DialogTitle>Add to Vault</DialogTitle>
          <DialogContent>
            <VaultNoAccess type="noAccessVault" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
          <DialogTitle>Add to Vault</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Bookmark Title"
              fullWidth
              variant="standard"
              {...bookmarkTitle.inputProps}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                bookmarkTitle.inputProps.onChange(event);
                validateTitle(event.target.value, vault);
              }}
              onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                bookmarkTitle.inputProps.onBlur(event);
                validateTitle(event.target.value, vault);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              color={buttonType}
              onClick={() => handleBookmark(vault, setVault)}
            >
              {buttonType === "error" ? "Overwrite" : "Bookmark"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
