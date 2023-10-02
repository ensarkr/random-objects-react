import { useMemo } from "react";
import "./App.css";
import MainContent from "./components/mainContent/MainContent";
import { SmallContext } from "./context/SmallContext";
import { createTheme, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

function App() {
  const isSmall500 = useMediaQuery("(max-width:500px)");
  const isSmall1000 = useMediaQuery("(max-width:1000px)");

  const text = "#f0f7ff";
  const background = "#010c19";
  const primary = "#6ab0fb";
  const secondary = "#faa761";

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: "dark",
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
        },

        background: {
          default: background,
          paper: background,
        },
        text: {
          primary: text,
        },
        divider: primary,
      },
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SmallContext.Provider
        value={isSmall500 ? "<500" : isSmall1000 ? "<1000" : "max"}
      >
        <MainContent></MainContent>
      </SmallContext.Provider>
    </ThemeProvider>
  );
}

export default App;
