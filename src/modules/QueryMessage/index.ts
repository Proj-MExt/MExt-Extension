import { MExtModule } from "../Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<boolean>("queryMessage"),
	config: [
		{
			id: "queryMessage",
			default: true,
			type: "check",
			name: "后台轮询消息",
			desc: "在后台自动查询是否有新的消息并推送,需保证至少打开一个页面."
		},
		{
			id: "queryMessageInterval",
			default: 60,
			type: "num",
			name: "后台轮询消息间隔",
			desc: "两次轮询消息之间的间隔,单位秒.注意,过低的值可能会导致你被论坛屏蔽,超过200的值可能会导致消息反复推送."
		}
	],
	core: MExt => {
		const dlg = MExt.debugLog;
		const $ = MExt.jQuery!;
		const hash = (window as any).hash;
		const getRequest = MExt.Utils.getRequest;
		let checkNotification = (noNotify = false) => {
			if (localStorage.getItem("MExt_ActiveQueryId") != queryId) {
				return false;
			}
			dlg("Checking message...");
			$.get("/forum.php?mod=misc", d => {
				// 设置最后通知时间为当前时间,以防止反复推送
				localStorage.setItem(
					"notification-time",
					new Date().getTime().toString()
				);
				let dom = $(d);
				// 获得顶栏图标类
				let notifyClass = dom.find("#myprompt").attr("class") || "";
				// 获得通知菜单元素
				let notifyMenu = dom.filter("#myprompt_menu");
				// 将顶栏图标类写入当前页
				$("#myprompt").attr("class", notifyClass);
				// 将通知菜单写入当前页
				$("#myprompt_menu").html(notifyMenu.html());
				// 获得消息内容,用作缓存
				let notifyContent = notifyMenu.html();
				// 判断是否应该发送消息
				if (
					!noNotify &&
					localStorage.getItem("MExt_LastNoticeContent") != notifyContent
				) {
					// 获得通知脚本(暴力)
					let scp = dom
						.filter("script[src*=html5notification]")
						.nextUntil("div")
						.last()
						.text();
					// 将最后通知时间设置为1,强行启用通知
					localStorage.setItem("notifica-time", "1");
					// 执行通知脚本
					eval(scp);
					dlg("Notification sent.");
					// 写入消息缓存
					localStorage.setItem("MExt_LastNoticeContent", notifyContent);
					localStorage.setItem("MExt_LastNoticeCount", notifyClass);
				}
			});
		};
		// 刷新消息缓存
		let flushContent = () => {
			$.get("/forum.php?mod=misc", d => {
				let dom = $(d);
				let notifyContent = dom.filter("#myprompt_menu").html();
				let notifyClass = dom.find("#myprompt").attr("class") || "";
				// 写入消息缓存
				localStorage.setItem("MExt_LastNoticeContent", notifyContent);
				localStorage.setItem("MExt_LastNoticeCount", notifyClass);
			});
		};
		// 生成queryID,用于页面间的互斥
		let queryId = hash(new Date().getTime().toLocaleString(), 16);
		// 判断是否在消息页面||最后通知时间是否超过200秒
		if (
			(location.pathname == "/home.php" &&
				(getRequest("do") == "pm" || getRequest("do") == "notice")) ||
			new Date().getTime() -
				parseInt(localStorage.getItem("notifica-time") || "0") >
				200000
		) {
			flushContent();
		} else {
			checkNotification();
		}
		dlg("Query id is " + queryId + ".");
		// 运行定时器,用于检查其他页面是否在运行
		setInterval(() => {
			if (localStorage.getItem("MExt_LastQuery") == "") {
				localStorage.setItem("MExt_LastQuery", "0");
			}
			let nowtime = Math.floor(new Date().getTime() / 1000);
			if (
				(localStorage.getItem("MExt_ActiveQueryId") == "" ||
					nowtime - parseInt(localStorage.getItem("MExt_LastQuery") || "0") >
						5) &&
				localStorage.getItem("MExt_ActiveQueryId") != queryId
			) {
				localStorage.setItem("MExt_ActiveQueryId", queryId);
				checkNotification();
				dlg("Kick off inactive querier,start query.");
			}
			if (localStorage.getItem("MExt_ActiveQueryId") == queryId) {
				localStorage.setItem("MExt_LastQuery", nowtime.toString());
			}
		}, 1000);
		dlg("Running checker actived.");
		// 判断是否有HTML5Notification
		if (!(window as any).Html5notification) {
			$.getScript("data/cache/html5notification.js?xm6");
			dlg("Html5notification added.");
		}
		//
		$(window).on("focus", () => {
			dlg("Get content from cache");
			$("#myprompt_menu").html(
				localStorage.getItem("MExt_LastNoticeContent") || ""
			);
			$("#myprompt").attr(
				"class",
				localStorage.getItem("MExt_LastNoticeCount")
			);
		});
		// 定时运行检查函数
		setInterval(
			checkNotification,
			parseInt(MExt.ValueStorage.get("queryMessageInterval") || "0") * 1000
		);
		dlg("Message query actived.");
	}
} as MExtModule;
