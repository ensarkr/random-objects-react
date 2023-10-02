import { createContext } from "react";

export const SmallContext = createContext<"<500" | "<1000" | "max">("max");
