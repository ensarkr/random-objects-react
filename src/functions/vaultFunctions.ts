import {
  blueprintElementI,
  convertToRealBlueprint,
} from "./blueprintFunctions";
import { functionI_STR } from "./formFunctions";

export interface vaultI {
  savedBlueprints: savedBlueprintI[];
  savedBlueprintElements: savedBlueprintElementI[];
  vaultVersion: string;
}

const latestVaultVersion = "1.0.1";

export interface blueprintElementI_vault {
  id: string;
  key: string;
  buttonText: string;
  valueData: staticI_STR | functionI_STR;
}

interface staticI_STR {
  type: "static";
  staticValue: string;
}

export interface savedBlueprintI {
  title: string;
  createdTime: string;
  timesRequested: number;
  savedBlueprint: blueprintElementI_vault[];
}

export interface savedBlueprintElementI {
  title: string;
  createdTime: string;
  timesRequested: number;
  savedBlueprintElement: functionI_STR;
}

type saveBlueprintElementT = (
  vault: vaultI | null,
  setVault: React.Dispatch<React.SetStateAction<vaultI | null>> | null,
  title: string,
  savedBlueprintElement: functionI_STR,
  overwrite: boolean
) => "success" | "exists" | "failed";

// * Save blueprintElement to localStorage

const saveBlueprintElement: saveBlueprintElementT = (
  vault,
  setVault,
  title,
  savedBlueprintElement,
  overwrite
) => {
  if (!localStorageTest() || vault === null || setVault === null)
    return "failed";

  const isExists =
    vault.savedBlueprintElements.filter((e) => e.title === title).length > 0;

  if (isExists && !overwrite) return "exists";

  let newSavedBlueprintElements: savedBlueprintElementI[] = [];

  const newSavedBlueprintElement: savedBlueprintElementI = {
    title: title,
    createdTime: new Date(Date.now()).toJSON(),
    timesRequested: 0,
    savedBlueprintElement: savedBlueprintElement,
  };

  if (isExists) {
    const index = vault.savedBlueprintElements.findIndex(
      (e) => e.title === title
    );
    newSavedBlueprintElements = [
      ...vault.savedBlueprintElements
        .slice(0, index)
        .concat(vault.savedBlueprintElements.slice(index + 1)),
      newSavedBlueprintElement,
    ];
  } else {
    newSavedBlueprintElements = [
      ...vault.savedBlueprintElements,
      newSavedBlueprintElement,
    ];
  }

  localStorage.setItem(
    "savedBlueprintElements",
    JSON.stringify(newSavedBlueprintElements)
  );

  setVault({
    vaultVersion: vault.vaultVersion,
    savedBlueprints: vault.savedBlueprints,
    savedBlueprintElements: newSavedBlueprintElements,
  });

  return "success";
};

type saveBlueprintT = (
  vault: vaultI | null,
  setVault: React.Dispatch<React.SetStateAction<vaultI | null>> | null,
  title: string,
  savedBlueprint: blueprintElementI[],
  overwrite: boolean
) => "success" | "exists" | "failed";

// * Save blueprint to localStorage

const saveBlueprint: saveBlueprintT = (
  vault,
  setVault,
  title,
  savedBlueprintElement,
  overwrite
) => {
  if (!localStorageTest() || vault === null || setVault === null)
    return "failed";

  const isExists =
    vault.savedBlueprints.filter((e) => e.title === title).length > 0;

  if (isExists && !overwrite) return "exists";

  let newSavedBlueprints: savedBlueprintI[] = [];

  const newSavedBlueprint: savedBlueprintI = {
    title: title,
    createdTime: new Date(Date.now()).toJSON(),
    timesRequested: 0,
    savedBlueprint: convertToVaultBlueprint(savedBlueprintElement),
  };

  if (isExists) {
    const index = vault.savedBlueprints.findIndex((e) => e.title === title);
    newSavedBlueprints = [
      ...vault.savedBlueprints
        .slice(0, index)
        .concat(vault.savedBlueprints.slice(index + 1)),
      newSavedBlueprint,
    ];
  } else {
    newSavedBlueprints = [...vault.savedBlueprints, newSavedBlueprint];
  }

  localStorage.setItem("savedBlueprints", JSON.stringify(newSavedBlueprints));

  setVault({
    vaultVersion: vault.vaultVersion,
    savedBlueprints: newSavedBlueprints,
    savedBlueprintElements: vault.savedBlueprintElements,
  });

  return "success";
};

type removeBlueprintElementT = (
  vault: vaultI | null,
  setVault: React.Dispatch<React.SetStateAction<vaultI | null>> | null,
  title: string
) => "success" | "exists" | "failed";

// * Remove blueprint element from localStorage

const removeBlueprintElement: removeBlueprintElementT = (
  vault,
  setVault,
  title
) => {
  if (!localStorageTest() || vault === null || setVault === null)
    return "failed";

  const isExists = doesTitleExist(vault, "blueprintElement", title);

  if (!isExists) return "failed";

  let newSavedBlueprintElements: savedBlueprintElementI[] = [];

  const index = vault.savedBlueprintElements.findIndex(
    (e) => e.title === title
  );

  newSavedBlueprintElements = [
    ...vault.savedBlueprintElements
      .slice(0, index)
      .concat(vault.savedBlueprintElements.slice(index + 1)),
  ];

  localStorage.setItem(
    "savedBlueprintElements",
    JSON.stringify(newSavedBlueprintElements)
  );

  setVault({
    vaultVersion: vault.vaultVersion,
    savedBlueprints: vault.savedBlueprints,
    savedBlueprintElements: newSavedBlueprintElements,
  });

  return "success";
};

type removeBlueprintT = (
  vault: vaultI | null,
  setVault: React.Dispatch<React.SetStateAction<vaultI | null>> | null,
  title: string
) => "success" | "exists" | "failed";

// * Remove blueprint from localStorage

const removeBlueprint: removeBlueprintT = (vault, setVault, title) => {
  if (!localStorageTest() || vault === null || setVault === null)
    return "failed";

  const isExists = doesTitleExist(vault, "blueprint", title);

  if (!isExists) return "failed";

  let newSavedBlueprints: savedBlueprintI[] = [];

  const index = vault.savedBlueprints.findIndex((e) => e.title === title);
  newSavedBlueprints = [
    ...vault.savedBlueprints
      .slice(0, index)
      .concat(vault.savedBlueprints.slice(index + 1)),
  ];

  localStorage.setItem("savedBlueprints", JSON.stringify(newSavedBlueprints));

  setVault({
    vaultVersion: vault.vaultVersion,
    savedBlueprints: newSavedBlueprints,
    savedBlueprintElements: vault.savedBlueprintElements,
  });

  return "success";
};

type convertToVaultBlueprintT = (
  blueprint: blueprintElementI[]
) => blueprintElementI_vault[];

// * Convert realBlueprint to vault blueprint. Remove unnecessary properties

const convertToVaultBlueprint: convertToVaultBlueprintT = (blueprint) => {
  const newBlueprint = blueprint.map((e) => {
    return {
      id: e.id,
      key: e.key,
      buttonText: e.buttonText,
      valueData:
        e.valueData.type === "function"
          ? ({
              type: "function",
              functionName: e.valueData.functionName,
              argObject_STR: e.valueData.argObject_STR,
            } as functionI_STR)
          : e.valueData,
    } as blueprintElementI_vault;
  });
  return newBlueprint;
};

const localStorageTest = () => {
  try {
    localStorage.setItem("test", "");
    localStorage.removeItem("test");
  } catch (e) {
    return false;
  }
  return true;
};

type getBlueprintElementT = (
  vault: vaultI | null,
  title: string
) => null | functionI_STR;

const getBlueprintElement: getBlueprintElementT = (vault, title) => {
  if (!localStorageTest() || vault === null) return null;

  const isExists =
    vault.savedBlueprintElements.filter((e) => e.title === title).length > 0;

  if (!isExists) return null;

  const index: number = vault.savedBlueprintElements.findIndex(
    (e) => e.title === title
  );

  return vault.savedBlueprintElements[index].savedBlueprintElement;
};

type getBlueprintT = (
  vault: vaultI | null,
  title: string
) => blueprintElementI[] | null;

const getBlueprint: getBlueprintT = (vault, title) => {
  if (!localStorageTest() || vault === null) return null;

  const isExists =
    vault.savedBlueprints.filter((e) => e.title === title).length > 0;

  if (!isExists) return null;

  const index: number = vault.savedBlueprints.findIndex(
    (e) => e.title === title
  );

  return convertToRealBlueprint(vault.savedBlueprints[index].savedBlueprint);
};

type getVaultT = () => vaultI | null;

const getVault: getVaultT = () => {
  if (!localStorageTest()) return null;

  if (!localStorage.getItem("savedBlueprints"))
    localStorage.setItem("savedBlueprints", JSON.stringify([]));
  if (!localStorage.getItem("savedBlueprintElements"))
    localStorage.setItem("savedBlueprintElements", JSON.stringify([]));
  if (!localStorage.getItem("vaultVersion"))
    localStorage.setItem("vaultVersion", JSON.stringify(latestVaultVersion));

  const savedBlueprintString = localStorage.getItem("savedBlueprints");
  const savedBlueprintElementString = localStorage.getItem(
    "savedBlueprintElements"
  );
  let currentVaultVersion = localStorage.getItem("vaultVersion");

  let savedBlueprints = JSON.parse(
    savedBlueprintString ? savedBlueprintString : "[]"
  ) as savedBlueprintI[];
  let savedBlueprintElements = JSON.parse(
    savedBlueprintElementString ? savedBlueprintElementString : "[]"
  ) as savedBlueprintElementI[];

  if (currentVaultVersion !== latestVaultVersion) {
    const updatedVault = updateVaultToLatestVersion(
      savedBlueprints,
      savedBlueprintElements,
      currentVaultVersion as string
    );

    savedBlueprints = updatedVault.savedBlueprints;
    savedBlueprintElements = updatedVault.savedBlueprintElements;
    currentVaultVersion = updatedVault.vaultVersion;
  }

  return {
    vaultVersion: currentVaultVersion,
    savedBlueprints,
    savedBlueprintElements,
  };
};
type updateVaultToLatestVersionT = (
  savedBlueprints: savedBlueprintI[],
  savedBlueprintElements: savedBlueprintElementI[],
  currentVaultVersion: string
) => vaultI;

const updateVaultToLatestVersion: updateVaultToLatestVersionT = (
  savedBlueprints,
  savedBlueprintElements,
  currentVaultVersion
) => {
  // There have never been an update on vaultVersion

  return {
    savedBlueprints,
    savedBlueprintElements,
    vaultVersion: currentVaultVersion,
  };
};

type doesTitleExistT = (
  vault: vaultI | null,
  type: "blueprint" | "blueprintElement",
  title: string | null
) => boolean | null;

const doesTitleExist: doesTitleExistT = (vault, type, title) => {
  if (!localStorageTest() || vault === null || title === null) return null;

  if (type === "blueprint") {
    return vault.savedBlueprints.filter((e) => e.title === title).length > 0;
  } else if (type === "blueprintElement") {
    return (
      vault.savedBlueprintElements.filter((e) => e.title === title).length > 0
    );
  }

  return false;
};

export {
  saveBlueprintElement,
  saveBlueprint,
  getVault,
  getBlueprintElement,
  doesTitleExist,
  getBlueprint,
  removeBlueprint,
  removeBlueprintElement,
  convertToVaultBlueprint,
};
