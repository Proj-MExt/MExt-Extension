import { MExtModule } from "../Core";

export default {
	predicate: MExt =>
		MExt.ValueStorage.get("removeLinkWarn") &&
		location.pathname == "/plugin.php" &&
		MExt.Utils.getRequest("id") == "link_redirect",
	config: [
		{
			id: "removeLinkWarn",
			default: true,
			name: "移除外链警告",
			type: "check",
			desc: "去除论坛跳转外链时的警告页面."
		}
	],
	core: MExt => {
		let url = MExt.Utils.getRequest("target");
		if (url) {
			// 跳就完事了
			location.href = decodeURIComponent(url);
		}
	}
} as MExtModule;
