import { initValueStorage, hookDiscuzAjax } from "./utils";
import MessageBridge from "../utils/MessageBridge";
import Settings from "../modules/Core/Settings";
import UpdateNotify from "../modules/Core/UpdateNotify";

export interface MExtInst {
	ValueStorage: Awaited<ReturnType<typeof initValueStorage>>;
	use: (...module: MExtModule[]) => MExtInst;
	debugLog: (message: string) => void;
	versionName: string;
	versionCode: number;
	jQuery?: JQueryStatic;
	configList: MExtModuleConfig[];
	Utils: {
		appendStyle: (style: string) => void;
		getRequest: (name: string, url?: string) => string | undefined;
	};
}

export type ConfigType = "num" | "check" | "text" | "textarea";
export type AcceptType = string | number | boolean;
export interface MExtModuleConfigDeclare {
	id: string;
	default: AcceptType;
	type: ConfigType;
	name: string;
	desc: string;
}

export interface MExtModuleConfig extends MExtModuleConfigDeclare {
	value?: unknown;
}

export interface MExtModule {
	core?: (MExt: MExtInst) => unknown;
	style?: string | ((MExt: MExtInst) => string);
	config?: MExtModuleConfigDeclare[];
	predicate?: (MExt: MExtInst) => boolean;
}

export default async ($: JQueryStatic | undefined, bridge: MessageBridge, ShouldRun: boolean): Promise<MExtInst> => {
	const ValueStorage = await initValueStorage(bridge);
	const ConfigList: MExtModuleConfig[] = [];
	// 导出模块
	const exportModule = (...modules: MExtModule[]) => {
		if (!ShouldRun) {
			return MExt;
		}
		for (const module of modules) {
			try {
				// 载入配置项
				if (typeof module.config !== "undefined") {
					module.config.forEach((v: MExtModuleConfig) => {
						if (typeof ValueStorage.get(v.id) == "undefined") {
							ValueStorage.set(v.id, v.default);
						}
						ConfigList.push(
							Object.assign(
								{
									value: ValueStorage.get(v.id)
								},
								v
							)
						);
					});
				}
				// 判断是否应该运行
				if (typeof module.predicate == "function" && !module.predicate(MExt)) {
					continue;
				}
				// 加载模块CSS
				if (typeof module.style == "string") {
					appendStyle(module.style);
				} else if (typeof module.style == "function") {
					appendStyle(module.style(MExt));
				}
				// 运行模块Core
				if (typeof module.core == "function") {
					module.core(MExt);
				}
			} catch (e) {
				console.error("Error occurred while try to load a module");
				console.error(e);
			}
		}
		return MExt;
	};
	const dlg = (msg: string) => {
		console.debug("[MCBBS Extender]" + msg);
	};

	const appendStyle = (style: string) => {
		const s = document.createElement("style");
		s.innerHTML = style;
		document.head.appendChild(s);
	};
	const getRequest = (variable: string, url = ""): string | undefined => {
		const query =
			/\?(.*)/.exec(url)?.[1] || window.location.search.substring(1);
		return query
			.split("&")
			.find(v => {
				const pair = v.split("=");
				return pair[0] == variable;
			})
			?.split("=")[1];
	};

	if ($) {
		hookDiscuzAjax($);
	}
	const MExt = {
		ValueStorage,
		use: exportModule,
		debugLog: dlg,
		versionName: import.meta.env.VITE_CORE_VERSION_STR,
		versionCode: parseInt(import.meta.env.VITE_CORE_VERSION),
		jQuery: $,
		configList: ConfigList,
		Utils: {
			appendStyle: appendStyle,
			getRequest: getRequest
		}
	};
	exportModule(Settings, UpdateNotify);
	return MExt;
};
