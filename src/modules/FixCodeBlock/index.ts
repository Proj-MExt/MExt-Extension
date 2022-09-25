import { MExtModule } from "../../inject/Core";

export default {
	style: `pre:not([id]) code {
        background: #f7f7f7;
        display: block;
        font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
        font-size: 12px;
        line-height: 1.8em;
        padding: 10px;
        border: #ccc solid 1px;
        position: relative;
    }
    
    .pl .blockcode ol li:hover {
        background: none;
        color: #666
    }
    
    .pl .blockcode ol li {
        white-space: nowrap;
        list-style: none;
        padding-left: 0;
        margin-left: 0;
    }
    
    .pl pre em,
    .pl .blockcode em {
        font-size: 0;
    }
    
    .pl pre em::after,
    .pl .blockcode em::after {
        content: 'Copy';
        position: absolute;
        top: 3px;
        right: 7px;
        display: block;
        font-size: 14px;
        border: #369 dashed 1px;
        padding: 0 7px;
        border-radius: 3px;
        transition-duration: .1s;
        opacity: 0.3;
        color: #369;
        cursor: pointer;
        font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
    }
    
    .pl .blockcode,
    .pl pre:not([id]) {
        position: relative;
        padding: 0;
    }
    
    .pl pre em:active::after,
    .pl .blockcode em:active::after {
        background: #369;
        border: #369 solid 2px;
        color: white;
    }
    
    .pl .blockcode em:hover::after,
    .pl pre em:hover::after {
        opacity: 1;
    }
    
    .pl .blockcode div[id],
    pre:not([id]) code {
        max-height: 500px;
        overflow: auto;
        padding: 10px 30px 5px 50px;
        background: #F7F7F7 url(https://www.mcbbs.net/template/mcbbs/image/codebg.gif) repeat-y 0 0;
        scrollbar-width: thin;
    }
    
    .pl .blockcode div[id]::-webkit-scrollbar,
    pre:not([id]) code::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }
    
    .pl .blockcode div[id]::-webkit-scrollbar-thumb,
    pre:not([id]) code::-webkit-scrollbar-thumb {
        background: #00000040
    }
    
    .line-counter {
        position: sticky;
        float: left;
        left: -50px;
        line-height: 1.8em;
        padding-top: 3px;
        user-select: none;
        margin: -4px 0px -50px -50px;
        border-right: #d6d6d6 solid 1px;
        width: 38px;
        background: #ededed;
        font-size: 12px;
        font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
        padding-right: 4px;
        text-align: right;
    }
    
    .pl .blockcode ol {
        margin: 0 !important;
    }
    
    .pl .t_table .blockcode ol li {
        width: 0;
    }
    
    pre:not([id]) code br {
        display: none;
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		// 构建代码行计数器
		const LnBuilder = (ln: number) => {
			let str = "";
			for (let i = 1; i <= ln; i++) {
				str += (i < 10 ? "0" + i.toString() : i.toString()) + ".\n";
			}
			return str;
		};
		// 为代码块添加行数显示与复制按钮
		const fixCode = () => {
			const copycode = (window as any).copycode;
			$(".pl pre:not([id]) code:not([code-fixed])")
				.attr("code-fixed", "")
				.each((i, v) => {
					// 构建计数器
					const ln = v.innerHTML.split("\n").length;
					const lnC = LnBuilder(ln);
					const counter = document.createElement("div");
					counter.className = "line-counter";
					counter.innerText = lnC;
					// 构建按钮
					const copy = document.createElement("em");
					copy.className = "code-copy";
					copy.addEventListener("click", (e: any) => {
						let n = e.currentTarget.previousSibling;
						copycode(n);
					});
					v.prepend(counter);
					v.parentElement!.append(copy);
				});
			$(".pl div.blockcode:not([code-fixed])")
				.attr("code-fixed", "")
				.each((i, v) => {
					// 构建计数器
					let ln = v.firstElementChild!.firstElementChild!.childElementCount;
					let lnC = LnBuilder(ln);
					let counter = document.createElement("div");
					counter.className = "line-counter";
					counter.innerText = lnC;
					v.firstElementChild!.prepend(counter);
				});
			MExt.debugLog("Line counter appended.");
		};
		(window as any).copycode = t => {
			(window as any).setCopy(
				t.innerText
					.replace(/\n\n/g, "\n")
					.replace(t.firstElementChild.innerText, ""),
				"代码已复制到剪贴板"
			);
			MExt.debugLog("Code copied.");
		};
		$(fixCode);
		$(window).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", fixCode);
	},
	config: [
		{
			id: "fixCodeBlock",
			default: true,
			type: "check",
			name: "美化代码块样式",
			desc: "修正代码块的一些样式,如滚动条."
		}
	],
	predicate: MExt => {
		return MExt.ValueStorage.get<boolean>("fixCodeBlock");
	}
} as MExtModule;
