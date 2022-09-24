declare global {
	interface Window {
		jQuery?: JQueryStatic;
		MExt?: import("./Core").MExtInst;
		MExtConfig?: Record<string, unknown>;
		ajaxget: any;
		ajaxpost: any;
	}
}

export {};