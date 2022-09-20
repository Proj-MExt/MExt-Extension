import { runtime } from "webextension-polyfill";

export const loadCore = async () => {
	// Code from TamperMonkey
	// Make plugin action like before
	if (!document.body) {
		await new Promise(resolve => {
			const wait = () => {
				if (!document.body) return;
				document.removeEventListener("load", wait, false);
				document.removeEventListener("DOMNodeInserted", wait, false);
				document.removeEventListener("DOMContentLoaded", wait, false);
				resolve(true);
			};
			document.addEventListener("load", wait, false);
			document.addEventListener("DOMNodeInserted", wait, false);
			document.addEventListener("DOMContentLoaded", wait, false);
		});
	}

	const s = document.createElement("script");
	s.src = runtime.getURL("core.js");
	s.onload = function () {
		s.remove();
	};
	(document.head || document.documentElement).appendChild(s);
};
