import { Box } from "@mui/material";
import styles from "./errorDiv.module.css";

export default function VaultNoAccess({
  type,
}: {
  type: "noAccessVault" | "noElementVault";
}) {
  const mainContent =
    type === "noAccessVault" ? (
      <>
        <h1> ╮(╯_╰)╭</h1>
        <p className="title">VAULT couldn't access to storage.</p>
        <p className="title">Try accepting cookies.</p>
        <p className="title">Try allowing access to localStorage API.</p>
      </>
    ) : type === "noElementVault" ? (
      <>
        <h1> (｡•̀ᴗ-)✧</h1>
        <p className="title">You haven't added any item yet.</p>
        <p className="title">Try adding one by clicking bookmark icons.</p>
      </>
    ) : (
      <></>
    );

  return (
    <Box className={["flexCenter flexColumn", styles.errorDiv].join(" ")}>
      {mainContent}
    </Box>
  );
}
