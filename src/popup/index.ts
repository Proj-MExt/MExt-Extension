import "mdui/dist/css/mdui.min.css";
import "./index.css";

import mdui from "mdui";
import { tabs } from "webextension-polyfill";
import MessageBridge from "../utils/MessageBridge";
import { MExtModuleConfig } from "../inject/Core";
import { ColorSelector, createConfigList, setThemeColor } from "./utils";
import { initValueStorage } from "../inject/utils";

(async () => {
  const TabID = await tabs.query({active: true, currentWindow: true}).then((tab) => {
    if (tab[0].id != null) {
      return tab[0].id;
    }
  });
  if (!TabID) return;
  const port = tabs.connect(TabID, { name: "popup"});
  const bridge = new MessageBridge(port);
  const storage = await initValueStorage(bridge);
  const list = await bridge.sendCommand<MExtModuleConfig[], undefined>("get_plugin_list");
  await setThemeColor();
  createConfigList(list, storage);
  document.querySelector("#color-selector")?.addEventListener("click", ColorSelector);
  mdui.mutation();
})();
