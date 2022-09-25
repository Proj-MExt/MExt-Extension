import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<boolean>("pinnedTopBar"),
	config: [
		{
			id: "pinnedTopBar",
			default: true,
			name: "更好的固定顶栏",
			type: "check",
			desc: "优化固定顶栏的行为,如与编辑栏的兼容性,以及在极窄窗口下的显示."
		}
	],
	style: `#toptb {
position: fixed;
width: 100%;
z-index: 790;
top: 0;
box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 5px 1px;
min-width: 510px;
}

.new_wp {
max-width: 1130px;
width: 100%;
}

.mc_map_wp {
padding-top: 45px;
}

.mw {
padding-top: 60px
}

#user_info_menu, #myprompt_menu, #usertools_menu, #sslct_menu, #scbar_type_menu {
position: fixed!important;
top: 47px!important
}

#scbar_type_menu {
top: 38px!important;
}

#e_controls {
z-index: 790!important
}

@media screen and (max-width: 860px) {
#toptb .z.light {
    display: none;
}
#toptb>.new_wp>.y {
    float: none;
    margin-left: 12px;
}
}`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		$(() => {
			// 重写editorcontrolpos函数,与固定顶栏兼容
			(window as any).editorcontrolpos = () => {
				if ((window as any).editorisfull) {
					return;
				}
				let scrollTop = Math.max(
					document.documentElement.scrollTop,
					document.body.scrollTop
				);
				if (
					scrollTop + 47 > (window as any).editorcontroltop &&
					(window as any).editorcurrentheight > (window as any).editorminheight
				) {
					$("#" + (window as any).editorid + "_controls")
						.prop("style", "z-index:0!important")
						.css("position", "fixed")
						.css("top", "47px")
						.css("width", (window as any).editorcontrolwidth + "px");
					$("#" + (window as any).editorid + "_controls_mask").css(
						"display",
						""
					);
				} else {
					$("#" + (window as any).editorid + "_controls")
						.css("position", "")
						.css("top", "")
						.css("width", "");
					$("#" + (window as any).editorid + "_controls_mask").css(
						"display",
						"none"
					);
				}
			};
			//增加一个5px的遮罩,防止鼠标经过空隙时碰到底层内容
			$("#toptb").after(
				'<div style="position: fixed;top: 47px;height: 5px;width: 100%;z-index:700;"></div>'
			);
			dlg("Mask appended.");
		});
	}
} as MExtModule;
