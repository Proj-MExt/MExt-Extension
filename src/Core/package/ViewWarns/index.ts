import { MExtModule } from "../Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("useIgInQuickReply"),
	config: [
		{
			id: "useIgInQuickReply",
			default: true,
			name: "快速回复使用个人签名",
			type: "check",
			desc: "在页脚快速回复帖子时使用个人签名."
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		// 快速回复框使用个人签名
		const hookReplyBtn = () => {
			if ($("#fwin_reply #usesig").length > 0) {
				return;
			}
			$("#fwin_reply #postsubmit").after(
				'<label for="usesig" style="margin-left: 10px;float: left;margin-top: 3px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>'
			);
			dlg("Use Ig Checkbox appended.");
		};
		$("#append_parent").on("DOMNodeInserted", hookReplyBtn);
		$(() => {
			// 底部快速回复增加选项
			$("#fastpostsubmit").after(
				'<label for="usesig" style="margin-left: 10px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>'
			);
		});
	}
} as MExtModule;
