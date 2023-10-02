import { allArgObjectIs, allArgObjectIs_ } from "../functions/formFunctions";
import { useFormInputCheck, useFormInputTextField } from "./useFormInput";

export default function useBaseOptions(
  argObjectMemo: allArgObjectIs,
  bookmarkedFunctionDataArgObj: allArgObjectIs_<string> | undefined
) {
  return {
    unique: useFormInputCheck(
      argObjectMemo.options.unique,
      bookmarkedFunctionDataArgObj?.options.unique
    ),
    customMap: useFormInputTextField(
      "custom map function",
      "custom_map",
      argObjectMemo.options.customMap,
      bookmarkedFunctionDataArgObj?.options.customMap
    ),
    customCompare: useFormInputTextField(
      "custom compare function",
      "custom_compare",
      argObjectMemo.options.customCompare,
      bookmarkedFunctionDataArgObj?.options.customCompare
    ),
  };
}
