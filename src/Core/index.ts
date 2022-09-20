import createCore from "./package/Core";

import AnimationGoToTop from "./package/AnimationGoToTop";
import DisableAutoPlay from "./package/DisableAutoPlay";
import FixCodeBlock from "./package/FixCodeBlock";
import FixImgZoom from "./package/FixImgZoom";
import FixTopBarPopMenu from "./package/FixTopBarPopMenu";
import FixAnchor from "./package/FixAnchor";
import HighlightThreads from "./package/HighlightThreads";
import HoverableMedal from "./package/HoverableMedal";
import MiscFix from "./package/MiscFix";
import MyCSS from "./package/MyCSS";
import MyLinks from "./package/MyLinks";
import MyReportReason from "./package/MyReportReason";
import PinnedTopBar from "./package/PinnerTopBar";
import QueryMessage from "./package/QueryMessage";
import QuickAt from "./package/QuickAt";
import RememberEditorMode from "./package/RememberEditorMode";
import RememberPage from "./package/RememberPage";
import RemoveLinkWarn from "./package/RemoveLinkWarn";
import ReplaceFlash from "./package/ReplaceFlash";
import RestrictMedalLine from "./package/RestrictMedalLine";
import UseIGInQuickReply from "./package/UseIGInQuickReply";
import ViewWarns from "./package/ViewWarns";

declare global {
	interface Window {
		jQuery?: JQueryStatic;
		MExt?: import("./package/Core").MExtInst;
		MExtConfig?: Record<string, unknown>;
		ajaxget: any;
		ajaxpost: any;
	}
}

(($?: JQueryStatic) => {
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
		ShouldRun = false;
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
	const core = createCore($, ShouldRun);
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
		RememberEditorMode,
		RememberPage,
		RemoveLinkWarn,
		ReplaceFlash,
		RestrictMedalLine,
		UseIGInQuickReply,
		ViewWarns
	);
})(window.jQuery);
