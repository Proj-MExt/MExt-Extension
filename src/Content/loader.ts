export type RunAt = "document_start" | "document_body" | "document_end" | "document_idle";

export const loadScript = async (src: string, runAt: RunAt = "document_body") => {
	if (runAt === "document_body") {
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
	} else if (runAt == "document_end") {
		await new Promise(resolve => {
			document.addEventListener("DOMContentLoaded", () => {
				resolve(true);
			});
		});
	} else if (runAt == "document_idle") {
		await new Promise(resolve => {
			document.addEventListener("load", () => {
				resolve(true);
			});
		});
	}

	const s = document.createElement("script");
	s.src = src;
	s.onload = function () {
		s.remove();
	};
	(document.head || document.documentElement).appendChild(s);
};
