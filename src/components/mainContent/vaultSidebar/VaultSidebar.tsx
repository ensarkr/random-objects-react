import { useCallback, useContext, useState } from "react";
import { SetVaultContext, VaultContext } from "../../../context/VaultContext";
import {
  blueprintElementI,
  convertToArgObject,
  valueDataI,
} from "../../../functions/blueprintFunctions";
import {
  getBlueprint,
  removeBlueprint,
  removeBlueprintElement,
  savedBlueprintElementI,
} from "../../../functions/vaultFunctions";
import {
  Collapse,
  Fab,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SwipeableDrawer,
} from "@mui/material";
import { chosenButtonI, mainPagesT } from "../MainContent";
import React from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import StorageIcon from "@mui/icons-material/Storage";
import { functionI } from "../../../functions/formFunctions";
import DataObjectIcon from "@mui/icons-material/DataObject";
import FunctionsIcon from "@mui/icons-material/Functions";
import SurePrompt from "../../surePrompt/SurePrompt";
import useSurePrompt from "../../../hooks/useSurePrompt";
import VaultNoAccess from "../../errorDiv/ErrorDiv";

export default function VaultSidebar({
  blueprint,
  setBlueprint,
  valuePart,
  setValuePart,
  setChosenButton,
  setMainPage,
  setValuePartFunctionsTabPage,
  showSidebar,
  setShowSidebar,
}: {
  blueprint: blueprintElementI[];
  setBlueprint: React.Dispatch<React.SetStateAction<blueprintElementI[]>>;
  valuePart: valueDataI;
  setValuePart: React.Dispatch<React.SetStateAction<valueDataI>>;
  setChosenButton: React.Dispatch<React.SetStateAction<chosenButtonI>>;
  setMainPage: React.Dispatch<React.SetStateAction<mainPagesT>>;
  setValuePartFunctionsTabPage: React.Dispatch<React.SetStateAction<number>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const vault = useContext(VaultContext);
  const setVault = useContext(SetVaultContext);

  const [minDefault, setMinDefault] = useState<boolean>(false);
  const [minBlueprint, setMinBlueprint] = useState<boolean>(false);
  const [minElement, setMinElement] = useState<boolean>(false);

  const sideBarSurePrompt = useSurePrompt();

  const chooseBlueprint = useCallback(
    (blueprintTitle: string) => {
      const rest = getBlueprint(vault, blueprintTitle);
      if (rest === null) return;

      const goToBlueprint = () => {
        setBlueprint(rest);
        setMainPage("object");
        setShowSidebar(false);
      };

      if (
        blueprint.length !== 0 &&
        blueprint.filter(
          (e) =>
            e.valueData.type === "function" ||
            e.valueData.type === "static" ||
            e.key.length > 0
        ).length !== 0
      ) {
        sideBarSurePrompt.showPrompt(
          "Change Function",
          "Are you sure you want to change the blueprint to " +
            blueprintTitle +
            " without saving?",
          () => {
            goToBlueprint();
          },
          undefined
        );
      } else {
        goToBlueprint();
      }
    },
    [
      blueprint,
      setBlueprint,
      setMainPage,
      setShowSidebar,
      sideBarSurePrompt,
      vault,
    ]
  );
  const chooseFunction = useCallback(
    (blueprintElement: savedBlueprintElementI) => {
      const argObject = convertToArgObject(
        blueprintElement.savedBlueprintElement.argObject_STR,
        blueprintElement.savedBlueprintElement.functionName
      );

      if (argObject === null) return;

      const goToFunction = () => {
        setChosenButton({ type: "vault", name: blueprintElement.title });
        setValuePart({
          ...blueprintElement.savedBlueprintElement,
          argObject: argObject,
        } as functionI);
        setMainPage("value");
        setValuePartFunctionsTabPage(2);
        setShowSidebar(false);
      };


      if (valuePart.type === "empty") {
        goToFunction();
      } else {
        sideBarSurePrompt.showPrompt(
          "Change Function",
          "Are you sure you want to change the function to " +
            blueprintElement.title +
            " without saving?",
          () => {
            goToFunction();
          },
          undefined
        );
      }
    },
    []
  );

  return (
    <React.Fragment>
      <Fab
        color="primary"
        aria-label="add"
        size="large"
        sx={{
          position: "fixed",
          left: 15,
          bottom: 15,
        }}
        onClick={() => {
          setShowSidebar(true);
        }}
      >
        <StorageIcon></StorageIcon>
      </Fab>
      <SwipeableDrawer
        anchor={"left"}
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onOpen={() => setShowSidebar(true)}
      >
        <List
          sx={{
            width: 350,
            bgcolor: "background.paper",
            maxWidth: "100vw",
          }}
          component="nav"
          subheader={<ListSubheader component="div">VAULT</ListSubheader>}
        >
          <ListItemButton onClick={() => setMinDefault((pv) => !pv)}>
            <ListItemIcon>
              <DataObjectIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Default Blueprints" />
            {minDefault ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={minDefault} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="TBA" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => setMinBlueprint((pv) => !pv)}>
            <ListItemIcon>
              <DataObjectIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Saved Blueprints" />
            {minBlueprint ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={minBlueprint} timeout="auto" unmountOnExit>
            {vault === null ? (
              <VaultNoAccess type="noAccessVault" />
            ) : vault.savedBlueprints.length === 0 ? (
              <VaultNoAccess type="noElementVault" />
            ) : (
              <List component="div" disablePadding>
                {vault.savedBlueprints.map((e) => (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    key={e.title}
                    onClick={() => chooseBlueprint(e.title)}
                  >
                    <ListItemText primary={e.title} />
                    <IconButton
                      size="small"
                      sx={{ height: "min-content" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        sideBarSurePrompt.showPrompt(
                          "Remove Blueprint From Vault",
                          "Are you sure you want to remove " +
                            e.title +
                            " from the vault?",
                          () => {
                            removeBlueprint(vault, setVault, e.title);
                          },
                          undefined
                        );
                      }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Collapse>

          <ListItemButton onClick={() => setMinElement((pv) => !pv)}>
            <ListItemIcon>
              <FunctionsIcon color="secondary" />
            </ListItemIcon>

            <ListItemText primary="Saved Functions " />
            {minElement ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={minElement} timeout="auto" unmountOnExit>
            {vault === null ? (
              <VaultNoAccess type="noAccessVault" />
            ) : vault.savedBlueprintElements.length === 0 ? (
              <VaultNoAccess type="noElementVault" />
            ) : (
              <List component="div" disablePadding>
                {vault.savedBlueprintElements.map((e) => (
                  <ListItemButton
                    sx={{ paddingLeft: 4 }}
                    key={e.title}
                    onClick={() => chooseFunction(e)}
                  >
                    <ListItemText
                      primary={e.title}
                      sx={{ overflow: "hidden" }}
                    />
                    <IconButton
                      size="small"
                      sx={{ height: "min-content" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        sideBarSurePrompt.showPrompt(
                          "Remove Function From Vault",
                          "Are you sure you want to remove " +
                            e.title +
                            " from the vault?",
                          () => {
                            removeBlueprintElement(vault, setVault, e.title);
                          },
                          undefined
                        );
                      }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Collapse>
        </List>
        <SurePrompt {...sideBarSurePrompt.surePromptProps}></SurePrompt>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
