import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get<number>("maxMedalLine")! >= 0,
	config: [
		{
			id: "maxMedalLine",
			default: -1,
			type: "num",
			name: "最大勋章行数",
			desc: "限制楼层勋章的最大行数,提升鼠标滚轮寿命,设置为-1以禁用此功能."
		}
	],
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		const Stg = MExt.ValueStorage;
		const line = Stg.get<number>("maxMedalLine")!;
		const restrict = () => {
			// 判断是否在个人主页
			if ($("#uhd").length > 0) {
				$("#restrictMedalLine").remove();
				return;
			}
			// 限制勋章行数
			dlg("Restricting line...");
			$(".md_ctrl:not([restrictline])")
				.attr("restrictline", "true")
				.append(
					$('<span class="toggle-all">展开/收起勋章</span>').on("click", e => {
						$(e.target).parent().toggleClass("show-all");
					})
				)
				.each((i, v: any) => {
					if (
						(v.childElementCount - 2 <= line * 3 &&
							Stg.get("hoverableMedal")) ||
						(v.firstChild.childElementCount - 2 <= line * 3 &&
							!Stg.get("hoverableMedal"))
					) {
						v.removeChild(v.lastChild);
					}
				});
		};
		$(restrict);
		$(window).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", restrict);
		MExt.Utils.appendStyle(
			`.md_ctrl span.toggle-all {
            width: 125px;
            display: block;
            position: absolute;
            bottom: 0;
            text-align: center;
            left: 0;
            padding: 30px 0px 5px 0px;
            background-image: linear-gradient(0deg, #e3c99e, #e3c99e, transparent);
            color: #3e6c99;
            cursor: pointer;
            user-select: none;
        }
    
        .md_ctrl {
            position: relative;
            overflow-y: hidden;
            max-height: ` +
				(line * (Stg.get("hoverableMedal") ? 60 : 55) + 45).toString() +
				`px!important;
            transition:unset!important;
        }
    
        .md_ctrl.show-all {
            max-height: 3000px!important;
            padding-bottom: 40px;
        }`
		);
	}
} as MExtModule;
