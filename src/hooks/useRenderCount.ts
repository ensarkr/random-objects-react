import { useRef } from "react";

export default function useRenderCount(componentName: string) {
  const count = useRef<number>(0);

  count.current++;
  console.log(
    `%c${componentName + " render count:" + count.current.toString()}`,
    "color: blue"
  );

  return;
}
