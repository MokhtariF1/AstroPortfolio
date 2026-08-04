import type { UIStrings } from "./types";
import fa from "./lang/fa";

export { tplStr } from "./format";

/** The public site currently has one locale: Persian. */
export function useTranslations(_locale: string = "fa"): UIStrings {
  return fa;
}
