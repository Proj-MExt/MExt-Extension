import { MExtModule } from "../../inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("fixImgZoom"),
	config: [
		{
			id: "fixImgZoom",
			default: true,
			name: "优化图片缩放",
			type: "check",
			desc: "使用更现代的方法实现图片缩放."
		}
	],
	style: `#img_scale {
        opacity: 0;
        position: absolute;
        right: 20px;
        bottom: 20px;
        background: #0006;
        transition-duration: .2s;
        color: white;
        padding: 10px;
        pointer-events: none;
        border-radius: 10px;
    }

    #imgzoom_zoom {
        height: auto;
        transition-duration: .2s
    }

    #imgzoom_zoomlayer {
        height: auto!important
    }

    #imgzoom {
        width: auto!important;
        height: auto!important
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const dlg = MExt.debugLog;
		const __zoom = (window as any).zoom;
		let t = 0;
		// 初始化基本缩放信息对象
		const img = {
			width: 0,
			height: 0,
			top: 0,
			left: 0,
			radio: 1,
			scale: 1,
			orgwidth: 0
		};
		// 缩放函数
		const resize = (width: number) => {
			dlg("Image resizing...");
			clearTimeout(t);
			// 显示缩放比例
			$("#img_scale")
				.html(img.scale * 100 + "%")
				.css("opacity", 1);
			t = setTimeout(() => {
				$("#img_scale").css("opacity", 0);
			}, 2000);
			// 计算目标大小和位置
			let ow = img.width;
			img.width = width;
			ow = (ow - img.width) / -2;
			img.left -= ow;
			img.top -= ow * img.radio;
			// 修改
			$("#imgzoom_zoom").css("width", img.width + "px");
			$("#imgzoom").css("left", img.left + "px");
			$("#imgzoom").css("top", img.top + "px");
		};
		// 保存基本信息
		let initP = () => {
			dlg("Init Picture info");
			img.width = parseInt($("#imgzoom_zoom").attr("width") || "0");
			img.height = parseInt($("#imgzoom_zoom").attr("height") || "0");
			img.radio = img.height / img.width;
			img.top = parseInt($("#imgzoom").css("top"));
			img.left = parseInt($("#imgzoom").css("left"));
			img.scale = 1;
			img.orgwidth = img.width;
		};
		(window as any).zoom = (
			obj: any,
			zimg: any,
			nocover: any,
			pn: any,
			showexif: any
		) => {
			// 伪装成IE,使原函数的DOMMouseScroll事件监听器以可以被卸除的形式添加
			(window as any).BROWSER.ie = 6;
			__zoom(obj, zimg, nocover, pn, showexif);
			// 防止翻车,改回去
			setTimeout(() => {
				(window as any).BROWSER.ie = 0;
				dlg("IE canceled.");
			}, 1000);
			// 等待窗口出现
			let wait = setInterval(() => {
				if ($("#imgzoom_zoom").length) {
					dlg("Image found");
					clearInterval(wait);
					// 信息归零,准备下一次保存
					Object.assign(img, {
						width: 0,
						height: 0,
						top: 0,
						left: 0,
						radio: 1,
						scale: 1,
						orgwidth: 0
					});
					// 显示遮罩
					$("#imgzoom_cover").css("display", "unset");
					// 判断是否已经监听事件,防止超级加倍
					if ($("#imgzoom").attr("fixed") == "true") {
						return true;
					}
					// 原始尺寸按钮事件
					$("#imgzoom_adjust").on("click", () => {
						dlg("return source size");
						$("#imgzoom").css(
							"transition-property",
							"opacity,top,left,transform"
						);
						img.width == 0 ? initP() : 0;
						img.scale = 1;
						resize(parseInt($("#imgzoom_zoom").attr("width") || "0"));
					});
					// 屏蔽页面滚动
					$("#imgzoom_cover").on("mousewheel DOMMouseScroll", e => {
						if (e.ctrlKey || e.altKey || e.shiftKey) {
							return true;
						}
						e.preventDefault();
					});
					// 卸除原函数监听器
					($("#imgzoom")[0] as any).onmousewheel = null;
					// 增加显示缩放大小元素并监听事件
					$("#imgzoom")
						.append(`<span id="img_scale"></span>`)
						.on("mousewheel DOMMouseScroll", (e: any) => {
							// 判断是否按下功能键
							if (e.ctrlKey || e.altKey || e.shiftKey) {
								dlg("Func key pressed.");
								return true;
							}
							// 阻止滚动
							e.preventDefault();
							// 兼容火狐,正确判断滚轮方向
							const scroll = e.originalEvent.wheelDelta
								? e.originalEvent.wheelDelta
								: -e.originalEvent.detail;
							// 忽略无效滚动
							if (scroll == 0) {
								return true;
							}
							// 判断是否需要初始化
							img.width == 0 ? initP() : 0;
							// 规定需要显示过渡动画的属性
							$("#imgzoom").css(
								"transition-property",
								"opacity,top,left,transform"
							);
							// 判断是否过小
							if (
								scroll < 0 &&
								((img.width < 350 && img.radio < 1) ||
									(img.width * img.radio < 350 && img.radio >= 1))
							) {
								// 回弹动画
								dlg("Reach min size");
								$("#imgzoom").css("transform", "scale(0.8)");
								setTimeout(() => {
									$("#imgzoom").css("transform", "scale(1)");
								}, 200);
								return true;
							}
							// 修改缩放比例
							img.scale += scroll > 0 ? 0.1 : -0.1;
							// 判断比例是否过小
							if (img.scale < 0.1) {
								img.scale = 0.1;
								// 回弹动画
								dlg("Reach min size");
								$("#imgzoom").css("transform", "scale(0.8)");
								setTimeout(() => {
									$("#imgzoom").css("transform", "scale(1)");
								}, 200);
								return true;
							}
							// 缩放
							resize(img.orgwidth * Math.pow(img.scale, 2));
						})
						.attr("fixed", "true");
					// 按下鼠标事件
					$("#imgzoom").on("mousedown", e => {
						// 按下鼠标时移除修改位置的过渡动画,使窗口跟手
						dlg("Animate removed");
						$("#imgzoom").css("transition-property", "opacity");
					});
					// 释放鼠标事件
					$("#imgzoom").on("mouseup", e => {
						// 改回去
						$("#imgzoom").css(
							"transition-property",
							"opacity,top,left,transform"
						);
						// 保存移动后的窗口位置
						img.top = parseInt($("#imgzoom").css("top"));
						img.left = parseInt($("#imgzoom").css("left"));
						dlg("Animate added,Pos saved");
					});
				}
			}, 50);
		};
	}
} as MExtModule;
