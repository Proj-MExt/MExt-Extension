import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt => (MExt.ValueStorage.get<string>("myCSS")?.length || 0) > 0,
	config: [
		{
			id: "myCSS",
			default: "",
			name: "自定义CSS",
			type: "textarea",
			desc: "在框内的CSS会被加载到页面内,可自由发挥."
		}
	],
	core: MExt => {
		MExt.Utils.appendStyle(MExt.ValueStorage.get<string>("myCSS") || "");
	}
} as MExtModule;
