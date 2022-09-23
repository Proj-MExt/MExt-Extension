import { MExtModule } from "../../Inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<boolean>("replaceFlash"),
	config: [
		{
			id: "replaceFlash",
			default: true,
			name: "Flash播放器替换",
			type: "check",
			desc: "将网易云Flash播放器替换成H5播放器."
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		const replace = () => {
			$("span[id*=swf] embed").each((i, v: any) => {
				let player = document.createElement("iframe");
				if (v.src.indexOf("style/swf/widget.swf") == -1) {
					return;
				}
				player.src = v.src
					.replace("style/swf/widget.swf", "outchain/player")
					.replace("sid=", "id=");
				player.width = v.width;
				player.height = v.height;
				player.frameBorder = "no";
				player.allow = "autoplay; fullscreen";
				player.id = v.parentElement.id + "_no_autoplay";
				v.parentElement.after(player);
				v.parentElement.remove();
			});
		};
		$(replace);
		$(window).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", replace);
	}
} as MExtModule;
