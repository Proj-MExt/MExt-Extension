import { MExtModule } from "../../inject/Core";

const module: MExtModule = {
	core: MExt => {
		const $ = MExt.jQuery!;
		const getRequest = MExt.Utils.getRequest;
		$(() => {
			// 发送警告
			if (
				location.pathname == "/forum.php" &&
				getRequest("mod") == "post" &&
				getRequest("action") == "newthread" &&
				getRequest("fid") == "246"
			) {
				$("body").append(
					$(
						`<div id="close_script_alert" style="max-width:430px;position: fixed; left: 20px; top: 80px; z-index: 9999; transform: matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025) translateX(-120%); background: rgba(228, 0, 0, 0.81); color: white; padding: 15px; transition-duration: 0.3s; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.66) 2px 2px 5px 0;"><h1 style="font-size: 3em;float: left;margin-right: 12px;font-weight: 500;margin-top: 6px;">警告</h1><span style="font-size: 1.7em;">您正在向反馈与投诉版发表新的帖子</span><br>如果您正在向论坛报告论坛内的Bug,请先关闭此插件再进行一次复现,以确保Bug不是由MCBBS Extender造成的.</div>`
					)
				);
				setTimeout(() => {
					$("#close_script_alert")[0].style.transform =
						"matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025)";
				}, 10);
				setTimeout(() => {
					$("#close_script_alert")[0].style.transform = "none";
				}, 300);
				setTimeout(() => {
					$("#close_script_alert")[0].style.transform = "translateX(-120%)";
				}, 10000);
				MExt.debugLog("Warning send");
			}
			// 设置界面初始化
			$("#user_info_menu .user_info_menu_btn").append(
				"<li><a href='javascript: void(0);' id=\"MExt_config\">MCBBS Extender 设置</a></li>"
			);

			MExt.debugLog("Setting window content loaded.");
			$("#MExt_config").on("click", () => {
				const showDialog = (window as any).showDialog;
				showDialog(
					"MCBBS Extender的设置界面已经移动到插件弹出窗口, 请点击浏览器上的插件图标打开设置界面",
					"notice"
				);
			});
		});
	}
};
export default module;
