import { MExtModule } from "../../Inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("fixAnchor"),
	config: [
		{
			id: "fixAnchor",
			default: false,
			name: "帖内锚点修复",
			type: "check",
			desc: "防止帖内锚点被意外的赋予样式."
		}
	],
	style: `table.plhin td.t_f span[id]:not([id^=anchor-]), .fastpreview span[id]:not([id^=anchor-]) {
        display: none!important
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		let lastHash: string;
		let handleAnchorJump = () => {
			if (
				!location.hash ||
				location.hash.substr(0, 1) !== "#" ||
				lastHash === location.hash
			)
				return;
			lastHash = location.hash;
			const hash = lastHash.substr(1);
			if (hash.length == 0) return;
			const offset = $(`span#anchor-${hash}`).offset();
			const body = window.document.scrollingElement!;
			if (!offset) return;
			$(body).animate(
				{
					scrollTop: offset.top - 48
				},
				300
			);
		};
		let fix = () => {
			$(
				"table.plhin td.t_f span[id]:not([id^=anchor-]), .fastpreview .bm_c div[id^=post_] span[id]:not([id^=anchor-])"
			).each((i, v) => {
				v.id = "anchor-" + v.id;
			});
			handleAnchorJump();
			dlg("Anchor fixed.");
		};
		$(fix);
		$(window)
			.on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", fix)
			.on("hashchange", handleAnchorJump);
	}
} as MExtModule;
