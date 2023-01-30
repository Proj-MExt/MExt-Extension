import createCore from "./Core";
import createMsgChannel from "./MessageHost";
import MessageBridge from "../utils/MessageBridge";

import AnimationGoToTop from "../modules/AnimationGoToTop";
import DisableAutoPlay from "../modules/DisableAutoPlay";
import FixCodeBlock from "../modules/FixCodeBlock";
import FixImgZoom from "../modules/FixImgZoom";
import FixTopBarPopMenu from "../modules/FixTopBarPopMenu";
import FixAnchor from "../modules/FixAnchor";
import HighlightThreads from "../modules/HighlightThreads";
import HoverableMedal from "../modules/HoverableMedal";
import MiscFix from "../modules/MiscFix";
import MyCSS from "../modules/MyCSS";
import MyLinks from "../modules/MyLinks";
import MyReportReason from "../modules/MyReportReason";
import PinnedTopBar from "../modules/PinnerTopBar";
import QueryMessage from "../modules/QueryMessage";
import QuickAt from "../modules/QuickAt";
import QuickSwitchGroup from "../modules/QuickSwitchGroup";
import RememberEditorMode from "../modules/RememberEditorMode";
import RememberPage from "../modules/RememberPage";
import RemoveLinkWarn from "../modules/RemoveLinkWarn";
import ReplaceFlash from "../modules/ReplaceFlash";
import RestrictMedalLine from "../modules/RestrictMedalLine";
import UseIGInQuickReply from "../modules/UseIGInQuickReply";
import ViewWarns from "../modules/ViewWarns";

(async ($?: JQueryStatic) => {
	const bridge = new MessageBridge(createMsgChannel());
	bridge.onCommand("get_plugin_list", e => {
		e.resolve(core.configList);
	});
	let ShouldRun = true;
	//夹带私货
	console.log(
		" %c Zapic's Homepage %c https://i.zapic.moe ",
		"color: #ffffff; background: #E91E63; padding:5px;",
		"background: #000; padding:5px; color:#ffffff"
	);
	// Gear浏览器上的Polyfill
	if (typeof console.debug == "undefined") {
		console.debug = function () {};
	}
	// jQuery检查
	if (typeof $ == "undefined") {
		console.error(
			"This page does NOT contain JQuery,MCBBS Extender will not work."
		);
		return;
	}
	//在手机页面主动禁用
	const meta = document.getElementsByTagName("meta");
	for (const m of meta) {
		if (m.name === "viewport") {
			console.log(
				"MCBBS Extender not fully compatible with Mobile page,exit manually"
			);
			ShouldRun = false;
			return;
		}
	}
	const core = await createCore($, bridge, ShouldRun);
	window.MExt = core;
	core.use(
		AnimationGoToTop,
		DisableAutoPlay,
		FixAnchor,
		FixCodeBlock,
		FixImgZoom,
		FixTopBarPopMenu,
		HighlightThreads,
		HoverableMedal,
		MiscFix,
		MyCSS,
		MyLinks,
		MyReportReason,
		PinnedTopBar,
		QueryMessage,
		QuickAt,
		QuickSwitchGroup,
		RememberEditorMode,
		RememberPage,
		RemoveLinkWarn,
		ReplaceFlash,
		RestrictMedalLine,
		UseIGInQuickReply,
		ViewWarns
	);
})(window.jQuery);
