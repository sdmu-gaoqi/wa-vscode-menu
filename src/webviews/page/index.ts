import { App as Translate } from "./webviews/translate";
import { App as Aes } from "./webviews/aes-decrypt";

const registerPages: Record<string, string> = {
  "wa-translate": Translate,
  "wa-aes-decrypt": Aes,
};

export default registerPages;
