import { useCallback, memo } from "react";
import { blueprintElementI } from "../../../../functions/blueprintFunctions";
import BlueprintElement from "./blueprintElement/BlueprintElement";
import {
  removeElement,
  saveElementToBlueprint,
} from "../../../../functions/blueprintFunctions";
import SurePrompt from "../../../surePrompt/SurePrompt";
import { Box, Button, IconButton, Stack } from "@mui/material";
import useSurePrompt from "../../../../hooks/useSurePrompt";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkBlock from "../../../bookmarkBlock/BookmarkBlock";
import {
  processDuplicate,
  validateBlueprint,
} from "../../../../functions/objectsPartFunctions";
import styles from "./blueprintContainer.module.css";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import StorageIcon from "@mui/icons-material/Storage";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

const BlueprintElement_Memo = memo(BlueprintElement);

export type setBlueprintElementT = (
  newBlueprintElement: blueprintElementI,
  isSourceKey?: boolean
) => void;

export default function BlueprintContainer({
  blueprint,
  setBlueprint,
  openVaultFromBlueprint,
}: {
  blueprint: blueprintElementI[];
  setBlueprint: React.Dispatch<React.SetStateAction<blueprintElementI[]>>;
  openVaultFromBlueprint: () => void;
}) {
  const blueprintSurePrompt = useSurePrompt();

  const setBlueprintElement: setBlueprintElementT = useCallback(
    (newBlueprintElement, isSourceKey) => {
      setBlueprint((pv) => {
        const newBlueprintArray = saveElementToBlueprint(
          pv,
          newBlueprintElement
        );

        if (isSourceKey) {
          return processDuplicate(newBlueprintArray);
        }

        return newBlueprintArray;
      });
    },
    [setBlueprint]
  );

  const addKeyAndValue = () => {
    setBlueprint((pv) => {
      return [
        ...pv,
        {
          id: uuidv4(),
          key: "",
          valueData: { type: "empty" },
          duplicateKey: false,
          buttonText: "value",
        },
      ];
    });
  };

  return (
    <>
      <div className="flexSpaceBetween">
        <div
          style={{
            fontSize: "20px",
          }}
          className="flexCenter"
        >
          {"BLUEPRINT"}
        </div>
        <Box>
          <IconButton
            size="small"
            sx={{ mr: 1.5 }}
            color="primary"
            onClick={() => {
              blueprintSurePrompt.showPrompt(
                "Clean Blueprint",
                "Are you sure you want to proceed with cleaning the blueprint?",
                () => {
                  setBlueprint([]);
                },
                undefined
              );
            }}
          >
            <CleaningServicesIcon></CleaningServicesIcon>
          </IconButton>
          <IconButton
            size="small"
            sx={{ mr: 1.5 }}
            color="primary"
            onClick={openVaultFromBlueprint}
          >
            <StorageIcon></StorageIcon>
          </IconButton>
          <BookmarkBlock
            options={{
              type: "blueprint",
              validateBlueprint: () => {
                return validateBlueprint(blueprint, setBlueprint);
              },
              latestBlueprintArray: blueprint,
            }}
          ></BookmarkBlock>
        </Box>
      </div>
      <Stack sx={{ pt: "1em" }}>
        {blueprint.map((e) => {
          return (
            <div
              className={styles.blueprintElementDiv}
              // * if there is an error make space
              style={{
                marginBottom:
                  e.duplicateKey || e.emptyErrorKey ? "35px" : "15px",
              }}
              key={e.id}
            >
              <BlueprintElement_Memo
                savedElementData={e}
                setBlueprintElement={setBlueprintElement}
              ></BlueprintElement_Memo>
              <IconButton
                size="small"
                id={styles.trashBin}
                color="error"
                onClick={() => {
                  blueprintSurePrompt.showPrompt(
                    "Delete Blueprint Element",
                    "Confirm deletion of the blueprint element.",
                    () => {
                      setBlueprint(removeElement(blueprint, e));
                    },
                    undefined
                  );
                }}
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </div>
          );
        })}
        <Button
          className={styles.blueprintElementAddDiv}
          startIcon={<AddIcon />}
          onClick={addKeyAndValue}
          variant="contained"
        >
          add key & value pair
        </Button>
      </Stack>

      <SurePrompt {...blueprintSurePrompt.surePromptProps}></SurePrompt>
    </>
  );
}
