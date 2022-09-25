import { MExtModule } from "../../inject/Core";

const medalReflectImage =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAA3CAYAAACGnvPUAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA1UlEQVRYw+3Qy6rBARRGcQcjl1zCG5AkkY48gUiEMHU/7/8GS/vUHoqif1/ZgzX/tVLAn0qpwAQmMIH5NsxECWM1gYMKxsoBUxWM1wKOKhgrD8xUMF47yUvPMFYBmKtgvA5wUsFYRWChgrF+gC5wVsB4JWCpgvFLvU9dehfjlYGVCsYv9YGLAsarAGsVjJUGBsBVAeNVgY0Kxi8NX7mUBMarAVsVjF/6fXQpaYxXB3YqGCsDjICbAsZrAHsVjJUFxiqY/wITmMAEJjCBCUxgAhOYb8PcAbo5rkGPsZmjAAAAAElFTkSuQmCC";

export default {
	predicate: MExt => MExt.ValueStorage.get("hoverableMedal"),
	config: [
		{
			id: "hoverableMedal",
			default: true,
			name: "玻璃质感勋章",
			type: "check",
			desc: "亮闪闪的勋章~"
		}
	],
	style:
		`.hoverable-medal:hover:after {
        margin-top: 0px !important;
        opacity: 1 !important;
    }
    
    .hoverable-medal:after {
        display: block;
        content: '';
        margin-top: -15px;
        opacity: 0.6;
        transition-duration: .4s;
        background-image: url(` +
		medalReflectImage +
		`);
        width: 100%;
        height: 100%;
        filter: blur(2px);
    }
    
    div.tip.tip_4[id*=md_] {
        width: 105px;
        height: 165px;
        border: none;
        box-shadow: black 0px 2px 10px -3px;
        margin-left: 38px;
        margin-top: 115px;
        background: black;
        overflow: hidden;
        pointer-events: none !important;
        border-radius: 5px;
        padding: 0px;
    }
    
    div.tip.tip_4[id*=md_] .tip_horn {
        background-size: cover;
        background-position: center;
        height: 200%;
        width: 200%;
        z-index: -1;
        filter: blur(7px) brightness(0.8);
        top: -50%;
        left: -50%;
    }
    
    div.tip.tip_4[id*=md_] .tip_c {
        color: rgba(255, 255, 255, 0.98);
    }
    
    div.tip.tip_4[id*=md_] h4 {
        text-align: center;
        padding: 10px 5px;
        background-color: rgba(255, 255, 255, 0.3);
    }
    
    div.tip.tip_4[id*=md_] p {
        padding: 0px 10px;
        position: absolute;
        top: calc(50% + 38px);
        transform: translateY(calc(-50% - 26px));
    }
    
    .md_ctrl {
        margin-left: 17px !important;
        padding-bottom: 15px;
    }
    
    .hoverable-medal {
        width: 31px;
        height: 53px;
        transition-duration: 0.4s;
        border-radius: 3px;
        display: inline-block;
        margin: 5px;
        background-position: center;
        box-shadow: 0px 2px 5px 0px black;
        overflow: hidden;
    }
    
    .hoverable-medal:hover {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, -0.003, 0, 0, 1, 0, 0, -1.5, 0, 0.9);
        box-shadow: 0px 2px 10px -3px black;
    }
    
    .pg_medal .mgcl img {
        margin-top: 12px !important
    }
    
    .mg_img {
        box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
    }
    
    .md_ctrl:not([glassmedal]) {
        display: none;
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const showMenu = (window as any).showMenu;
		const rewriteMedal = () => {
			// 遍历所有未重写楼层
			$(".md_ctrl:not([glassmedal])")
				.attr("glassmedal", "true")
				.each((t, v) => {
					// 遍历楼层所有勋章
					// TODO: 为什么是0还不知道
					$(v)
						.children(0 as any)
						.children("img")
						.each((b, n) => {
							// 获得勋章ID
							let id = "md" + /_\d*$/.exec(n.id)![0];
							// 重写勋章结构
							$(v).append(
								$(
									'<span class="hoverable-medal" id="' +
										n.id +
										'" style="background-image:url(' +
										n.src +
										')"></span>'
								).on("mouseover", () => {
									showMenu({
										ctrlid: n.id,
										menuid: id + "_menu",
										pos: "12!"
									});
								})
							);
							// 重写提示样式
							$("#" + id + "_menu .tip_horn").css(
								"background-image",
								"url(" + n.src + ")"
							);
							// 移除旧的勋章
							n.remove();
						});
				});
		};
		//调用重写勋章函数
		$(rewriteMedal);
		// 在Ajax时重新调用Ajax函数,保存勋章样式
		$(window).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", rewriteMedal);
	}
} as MExtModule;
