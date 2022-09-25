import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt =>
		MExt.ValueStorage.get<string>("myReportReason")!.length > 0,
	config: [
		{
			id: "myReportReason",
			default: "",
			name: "自定义举报理由",
			type: "textarea",
			desc: "在举报时提供自定义的举报理由,一行一个理由."
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		// 获得举报内容列表函数
		const getReasons = () => {
			// 分隔list
			const reportReason =
				MExt.ValueStorage.get<string>("myReportReason")!.split("\n");
			let rrstr = '<p class="mtn mbn">';
			//拼接HTML
			$(reportReason).each((i, v) => {
				rrstr +=
					"<label><input type=\"radio\" name=\"report_select\" class=\"pr\" onclick=\"$('report_other').style.display='none';$('report_msg').style.display='none';$('report_message').value='" +
					v +
					'\'" value="' +
					v +
					'"> ' +
					v +
					"</label><br>";
			});
			rrstr += "</p>";
			return rrstr;
		};
		// 举报按钮钩子函数
		const hookReportWin = () => {
			if ($("#report_reasons[appended]").length > 0) {
				return false;
			}
			$("#report_reasons").attr("appended", "true").before(getReasons());
		};
		$("#append_parent").on("DOMNodeInserted", hookReportWin);
	}
} as MExtModule;
