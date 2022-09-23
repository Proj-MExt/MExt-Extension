import { MExtModule } from "../../Inject/Core";

const AtBtnImage =
	"data:image/png;base64,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";

export default {
	predicate: MExt => MExt.ValueStorage.get<string>("quickAtList")!.length > 0,
	config: [
		{
			id: "quickAtList",
			default: "",
			name: "快速 @ 列表",
			type: "text",
			desc: '按下Ctrl+Shift+A/或者按钮以快速在当前输入框内插入预定义的@用户名代码.用户名之间用","(半角逗号)分隔.'
		}
	],
	style:
		`#fastpostatList.in_editorbtn, #postatList {
        background-size: 54px;
        background-position: -23px 3px;
    }

    #fastpostatList, #postatList {
        background-image: url(` +
		AtBtnImage +
		`);
        background-size: 50px;
        background-position: -6px 2px;
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		let getAtCode = () => {
			// 分隔list
			let quickAtList =
				MExt.ValueStorage.get<string>("quickAtList")!.split(",");
			let atstr = "";
			//拼接@代码
			$(quickAtList).each((i, v) => {
				atstr += "@" + v + " ";
			});
			return atstr;
		};
		// 将函数暴露到全局
		(window as any).MExt_Func_getAtCode = getAtCode;
		// 监听按键事件
		$(document).on("keydown", e => {
			if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
				// 判断是否在输入框内
				if (
					$(document.activeElement!).prop("nodeName") == "INPUT" &&
					$(document.activeElement!).prop("type") == "text"
				) {
					// 拼接方法插入
					$(document.activeElement!).val(
						$(document.activeElement!).val() + getAtCode()
					);
					dlg("@ string added");
				} else if ($(document.activeElement!).prop("nodeName") == "TEXTAREA") {
					// discuz内建函数插入
					(window as any).seditor_insertunit("fastpost", getAtCode(), "");
					dlg("@ string added");
				}
			}
		});
		// 高级编辑模式插入@代码
		$(() => {
			if ($("#e_iframe").length) {
				// 由于高级模式的输入框是iFrame,无法直接监听,故再次监听高级输入框的按键事件
				$(($("#e_iframe")[0] as any).contentWindow).on("keydown", e => {
					if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
						// 判断是否在输入框内
						if ($(document.activeElement!).prop("nodeName") == "IFRAME") {
							//discuz内建函数插入
							(window as any).insertText(getAtCode());
							dlg("@ string added");
						}
					}
				});
			}
		});
		let hookReplyBtn = () => {
			if ($("#postatList").length > 0) {
				return false;
			}
			$("#postat.fat").after(
				'<a id="postatList" href="javascript:;" title="快速@" onclick="seditor_insertunit(\'post\',MExt_Func_getAtCode(), \'\');">快速@</a> '
			);
			dlg("Reply at bottons appends.");
		};
		$("#append_parent").on("DOMNodeInserted", hookReplyBtn);
		$(() => {
			$("#fastpostat").after(
				'<a id="fastpostatList" href="javascript:;" title="快速@" class="" onclick="seditor_insertunit(\'fastpost\',MExt_Func_getAtCode(), \'\');">快速@</a> '
			);
			$("#e_adv_s1").append(
				'<a id="fastpostatList" href="javascript:;" title="快速@" class="in_editorbtn" onclick="insertText(MExt_Func_getAtCode());">快速@</a>'
			);
		});
	}
} as MExtModule;
