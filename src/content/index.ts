import { loadScript } from "./loader";
import { runtime } from "webextension-polyfill";
import getMessagePort from "./MessageClient";
import handleStorage from "./Storage";
import MessageBridge from "../utils/MessageBridge";

(async () => {
	const msgPort = getMessagePort();
	loadScript(runtime.getURL("inject.js"));
	const bridge = new MessageBridge(await msgPort);
	handleStorage(bridge);
})();

