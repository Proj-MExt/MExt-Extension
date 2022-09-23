import { MExtModule } from "../Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<string>("myLinks")!.length > 0,
	config: [
		{
			id: "myLinks",
			default: "",
			name: "自定义工具菜单链接",
			type: "textarea",
			desc: '在右上角"工具"菜单里添加自定义的链接,以"[名称] [链接]"的格式添加(如"个人主页 home.php"),一行一个.'
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		// 分割
		MExt.ValueStorage.get<string>("myLinks")!
			.split("\n")
			.forEach(v => {
				try {
					//判断是否合法
					if (!v.split(" ")[1] || !v.split(" ")[0]) {
						return true;
					}
					// 添加
					$(() => {
						$("#usertools_menu").append(
							'<li><a href="' +
								v.split(" ")[1] +
								'">' +
								v.split(" ")[0] +
								"</a></li>"
						);
					});
				} catch (ignore) {}
			});
	}
} as MExtModule;
