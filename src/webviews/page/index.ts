import { App as Translate } from "./webviews/translate";

const registerPages: Record<string, string> = {
  "wa-translate": Translate,
  "wa-aes-decrypt": "",
};

export default registerPages;
