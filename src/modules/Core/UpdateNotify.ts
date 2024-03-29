import { MExtModule } from "../../inject/Core";

const UpdateList = [
	"1. 新增 快捷切换用户组功能",
	'2. 孩子没有钱了, 赏口饭吃吧! -> <a href="https://afdian.net/@Zapic" target="_blank" style="color: #369;text-decoration: underline;">爱发电赞助</a>'
];

export default {
	core: MExt => {
		const showDialog = (window as any).showDialog;
		if (typeof MExt.ValueStorage.get("LastVersion") == "undefined") {
			MExt.ValueStorage.set("LastVersion", MExt.versionCode);
			showDialog(
				'<b>欢迎使用MCBBS Extender</b>.<br>请点击浏览器上的插件图标打开设置界面.<br><a href="https://afdian.net/@Zapic" target="_blank" style="color: #E91E63;text-decoration: underline;">在爱发电赞助我!</a>',
				"right",
				"欢迎"
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
