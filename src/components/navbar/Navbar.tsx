import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { mainPagesT } from "../mainContent/MainContent";
import DataObjectIcon from "@mui/icons-material/DataObject";
import FunctionsIcon from "@mui/icons-material/Functions";
import styles from "./navbar.module.css";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useContext } from "react";
import { SmallContext } from "../../context/SmallContext";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Navbar({
  currentPage,
  setCurrentPage,
}: {
  currentPage: mainPagesT;
  setCurrentPage: React.Dispatch<React.SetStateAction<mainPagesT>>;
}) {
  const smallStatus = useContext(SmallContext);

  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Box className={styles.navbar}>
        <NavbarLogo></NavbarLogo>
        <Box className={styles.navbarRight}>
          <Tabs
            value={["object", "value"].findIndex((e) => e === currentPage)}
            onChange={(_e, v) => {
              setCurrentPage(["object", "value"][v as number] as mainPagesT);
            }}
            className="secondaryIndicator miniTab"
          >
            <Tab icon={<DataObjectIcon />} />
            <Tab icon={<FunctionsIcon />} />
          </Tabs>

          <IconButton onClick={() => setShowInfo(true)}>
            <InfoIcon color={"primary"}></InfoIcon>
          </IconButton>
          <Dialog
            onClose={() => setShowInfo(false)}
            open={showInfo}
            scroll="body"
            fullWidth
            fullScreen={smallStatus === "<500"}
          >
            <DialogTitle className="flexSpaceBetween">
              How To Generate{currentPage === "object" ? " Objects" : " Items"}
              <IconButton
                onClick={() => {
                  setShowInfo(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}
            >
              <p style={{ lineHeight: "25px" }}>
                {currentPage === "object"
                  ? "Assign keys and values, whether static or dynamic, set the object quantity, and press play to finalize."
                  : "Choose one function, set the item quantity, and press play to finalize. "}
                Keep an eye on system resources—memory and CPU influence upper
                quantity limits and time. There is always an option to terminate
                the process. After creation, you can download or copy the result
                by clicking the download icon. Additionally,you can save your{" "}
                {currentPage === "object" ? " blueprints " : " functions "}
                to VAULT for later use. If you're into JavaScript, feel free to
                use custom map and compare options in function forms for a
                personalized touch. And for ultra-specific needs, dive into
                custom JS functions.
              </p>
            </DialogContent>
            <DialogTitle>About</DialogTitle>
            <DialogContent
              sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}
            >
              <p style={{ lineHeight: "25px" }}>
                This react site fully developed by me. You can check git-hub
                repository to learn which technologies I used to develop this
                site.
              </p>
            </DialogContent>
            <DialogTitle>Contact</DialogTitle>
            <DialogContent
              sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}
            >
              <IconButton
                title="eyupensarkara@gmail.com"
                onClick={() => {
                  window.open("mailto:eyupensarkara@gmail.com", "blank");
                }}
              >
                <EmailIcon></EmailIcon>
              </IconButton>
              <IconButton
                title="https://github.com/ensarkr/random-objects-react"
                onClick={() => {
                  window.open(
                    "https://github.com/ensarkr/random-objects-react",
                    "blank"
                  );
                }}
              >
                <GitHubIcon></GitHubIcon>
              </IconButton>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}

function NavbarLogo() {
  const smallStatus = useContext(SmallContext);

  return (
    <Box className={styles.navbarLogo}>
      <span style={{ color: "purple", fontSize: " 30px", paddingRight: 5 }}>
        {"{"}
      </span>
      <span style={{ color: "var(--primary)" }}>
        {smallStatus === "<500" ? "rng" : "random"}
      </span>
      :
      <span
        style={{
          color: "var(--secondary)",
          paddingLeft: "5px",
        }}
      >
        {smallStatus === "<500" ? '"obj"' : '"objects"'}
      </span>
      <span style={{ color: "purple", fontSize: " 30px", paddingLeft: 5 }}>
        {"}"}
      </span>
    </Box>
  );
}
