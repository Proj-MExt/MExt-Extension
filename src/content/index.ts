import { loadScript } from "./loader";
import { runtime } from "webextension-polyfill";
import getMessagePort from "./MessageClient";
import handleStorage from "./Storage";
import MessageBridge from "../utils/MessageBridge";

(async () => {
	const msgPort = getMessagePort();
	loadScript(runtime.getURL("inject.js"));
	const PageBridge = new MessageBridge(await msgPort);
	handleStorage(PageBridge);
	runtime.onConnect.addListener(port => {
		if (port.name === "popup") {
			const PopupBridge = new MessageBridge(port);
			handleStorage(PopupBridge);
			PopupBridge.onCommand("get_plugin_list", (e) => {
				PageBridge.sendCommand("get_plugin_list").then(data => {
					e.resolve(data)
				});
			});
		}
	});
})();
