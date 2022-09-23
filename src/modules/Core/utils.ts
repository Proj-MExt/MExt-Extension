const hookDiscuzAjax = ($: JQueryStatic) => {
	// 钩住DiscuzAjax函数,使其触发全局事件
	const __ajaxpost = window.ajaxpost;
	window.ajaxpost = (
		formid: any,
		showid: any,
		waitid: any,
		showidclass: any,
		submitbtn: any,
		recall: any
	) => {
		let relfunc = () => {
			if (typeof recall == "function") {
				recall();
			} else {
				eval(recall);
			}
			$(window).trigger("DiscuzAjaxPostFinished");
		};
		__ajaxpost(formid, showid, waitid, showidclass, submitbtn, relfunc);
	};
	const __ajaxget = window.ajaxget;
	window.ajaxget = (url: any, showid: any, waitid: any, loading: any, display: any, recall: any) => {
		let relfunc = () => {
			if (typeof recall == "function") {
				recall();
			} else {
				eval(recall);
			}
			$(window).trigger("DiscuzAjaxGetFinished");
		};
		__ajaxget(url, showid, waitid, loading, display, relfunc);
	};
};

const initValueStorage = () => {
	const valueList = window.MExtConfig || {};
	const migrate = localStorage.getItem("MExt_config");
	if (migrate) {
		try {
			const preList = JSON.parse(migrate);
			if (typeof preList == "object" && preList != null) {
				Object.assign(valueList, preList);
			}
		} finally {
			// localStorage.removeItem("MExt_Config");
		}
	}
	const setValue = <T>(name: string, val: T): void => {
		valueList[name] = val;
		localStorage.setItem("MExt_config", JSON.stringify(valueList));
	};
	const getValue = <T>(name: string): T | undefined => {
		return valueList[name] as T;
	};
	const deleteValue = (name: string): void => {
		delete valueList[name];
		localStorage.setItem("MExt_config", JSON.stringify(valueList));
	};
	return {
		get: getValue,
		set: setValue,
		delete: deleteValue
	};
};

export { hookDiscuzAjax, initValueStorage };