import { useState } from "react";

export default function useSurePrompt() {
  const [showSurePrompt, setShowSurePrompt] = useState(false);
  const [surePromptInfo, setSurePromptInfo] = useState<
    | {
        title: string;
        message: string;
        onTrue: () => void;
        onFalse: () => void;
      }
    | undefined
  >(undefined);

  const showPrompt = (
    title: string,
    message: string,
    onTruePara: (() => void) | undefined,
    onFalsePara: (() => void) | undefined
  ) => {
    setSurePromptInfo({
      title: title,
      message: message,
      onTrue: () => {
        onTruePara && onTruePara();
        setShowSurePrompt(false);
      },
      onFalse: () => {
        onFalsePara && onFalsePara();
        setShowSurePrompt(false);
      },
    });
    setShowSurePrompt(true);
  };

  return {
    surePromptProps: {
      showSurePrompt,
      setShowSurePrompt,
      surePromptInfo,
    },
    showPrompt,
  };
}
