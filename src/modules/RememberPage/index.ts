import { MExtModule } from "../../Inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<boolean>("rememberPage"),
	config: [
		{
			id: "rememberPage",
			default: true,
			type: "check",
			name: "板块内翻页记忆",
			desc: "点击板块内下一页按钮时记忆当前页."
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		$(() => {
			const npbtn = $("#autopbn");
			if (npbtn.length) {
				// 绑定事件
				const orgfunc = npbtn[0].onclick as any;
				npbtn[0].onclick = null;
				npbtn.on("click", e => {
					if (npbtn.html() == "正在加载, 请稍后...") {
						return false;
					}
					let nextpageurl = npbtn.attr("rel")!;
					const curpage = parseInt(npbtn.attr("curpage")!);
					npbtn.attr("curpage", curpage + 1);
					nextpageurl = nextpageurl.replace(
						/&page=\d+/,
						"&page=" + (curpage + 1)
					);
					$("#threadlisttableid").append(
						'<a class="mext_rempage" rel="' + nextpageurl + '"></a>'
					);
					history.replaceState(null, "", nextpageurl);
					orgfunc();
				});
				$("#separatorline").after(
					'<a class="mext_rempage" rel="' + window.location + '"></a>'
				);
				let timer = -1;
				// 事件防抖
				$(window).on("scroll", () => {
					clearTimeout(timer);
					timer = setTimeout(() => {
						let scroll =
							document.scrollingElement!.scrollTop - window.innerHeight / 2;
						let url = null;
						document.querySelectorAll(".mext_rempage").forEach((v: any, i) => {
							let vtop = v.offsetTop;
							if (vtop < scroll || i == 0) {
								url = v.rel;
							}
						});
						if (url) {
							history.replaceState(null, "", url);
						}
					}, 250);
				});
			}
			dlg("Page remember is active.");
		});
	}
} as MExtModule;
