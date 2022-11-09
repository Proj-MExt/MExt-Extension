import { MExtModule } from "../../inject/Core";

const UpdateList = [
	"1. 修复 帖子类型高亮的一个小问题",
	"2. 优化 优化图像缩放 显示放大倍数的精度",
	"3. 新增 插件弹出设置界面",
	'4. 孩子没有钱了, 赏口饭吃吧! -> <a href="https://afdian.net/@Zapic" target="_blank" style="color: #369;text-decoration: underline;">爱发电赞助</a>'
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
