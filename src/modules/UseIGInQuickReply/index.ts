import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("viewWarns"),
	config: [
		{
			id: "viewWarns",
			default: true,
			name: "查看警告记录",
			type: "check",
			desc: "为每一层楼和每一个个人主页(除自己)添加查看警告记录按钮"
		}
	],
	style: `.view_warns_inposts {
        background: url(template/mcbbs/image/warning.gif) no-repeat 0px 2px;
        background-size: 16px;
        width: 90px!important;
    }

    .view_warns_home a {
        background: url(template/mcbbs/image/warning.gif) no-repeat 1px 2px!important;
        background-size: 16px!important;
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		const addVWLink = () => {
			$(".plhin:not([vw-added*=true])").each((i, v) => {
				const href = $(v).find(".authi .xw1").attr("href");
				if (!href) {
					return false;
				}
				const uid = /uid=(\d*)/.exec(href)![1];
				$(v)
					.attr("vw-added", "true")
					.find("ul.xl.xl2.o.cl")
					.append(
						$(
							'<li class="view_warns_inposts"><a href="forum.php?mod=misc&action=viewwarning&tid=952104&uid=' +
								uid +
								'" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>'
						)
					);
			});
			dlg("In-posts view warns link added");
		};
		// 在DiscuzAjax时重新调用添加函数,防止失效
		$(window).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", addVWLink);
		dlg("add VWLink Ajax Event attached.");
		$(() => {
			// 添加查看警告按钮
			addVWLink();
			// 用户信息界面添加查看警告按钮
			const href = $("#uhd .cl a").attr("href");
			if (!href) {
				return;
			}
			const uid = /uid=(\d*)/.exec(href)![1];
			if (!uid) {
				return;
			}
			$("#uhd .mn ul").append(
				'<li class="view_warns_home"><a href="forum.php?mod=misc&action=viewwarning&tid=952104&uid=' +
					uid +
					'" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>'
			);
			dlg("Home page view warns link added.");
		});
	}
} as MExtModule;
