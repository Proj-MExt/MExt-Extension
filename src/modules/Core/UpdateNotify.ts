import { MExtModule } from "../../inject/Core";

const UpdateList = [
	"1. 迁移到浏览器拓展",
	'2. 孩子没有钱了, 赏口饭吃吧! -> <a href="https://afdian.net/@Zapic" target="_blank" style="color: #369;text-decoration: underline;">爱发电赞助</a>'
];

export default {
	core: MExt => {
		const $ = MExt.jQuery!;
		const showDialog = (window as any).showDialog;
		const showMenu = (window as any).showMenu;
		const hideMenu = (window as any).hideMenu;
		if (typeof MExt.ValueStorage.get("LastVersion") == "undefined") {
			MExt.ValueStorage.set("LastVersion", MExt.versionCode);
			showDialog(
				'<b>欢迎使用MCBBS Extender</b>.<br>本插件的设置按钮已经放进入了您的个人信息菜单里,如需调整设置请在个人信息菜单里查看.<br><a href="https://afdian.net/@Zapic" target="_blank" style="color: #E91E63;text-decoration: underline;">在爱发电赞助我!</a>',
				"right",
				"欢迎",
				() => {
					showMenu("user_info");
					$("#MExt_config")
						.css("background-color", "#E91E63")
						.css("color", "#fff");
					setTimeout(() => {
						hideMenu("user_info_menu");
						$("#MExt_config").css("background-color", "").css("color", "");
					}, 3000);
				}
			);
			return;
		}
		if (MExt.ValueStorage.get("LastVersion") == MExt.versionCode) {
			return;
		}
		let updateContent = "";
		UpdateList.forEach(v => {
			updateContent += "<br>" + v;
		});
		showDialog(
			"<b>MCBBS Extender 已经更新至 " +
				MExt.versionName +
				"</b>" +
				updateContent,
			"right"
		);
		MExt.ValueStorage.set("LastVersion", MExt.versionCode);
	}
} as MExtModule;
