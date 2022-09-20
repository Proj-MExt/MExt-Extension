import { MExtModule } from "../Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("animateGoToTopButton"),
	config: [
		{
			id: "animateGoToTopButton",
			default: true,
			name: "回到顶部按钮美化",
			type: "check",
			desc: "为右侧回到顶部按钮增加动画以及位置修正."
		}
	],
	style: `#scrolltop {
        bottom: 270px!important;
        visibility: visible;
        overflow-x: hidden;
        width: 120px;
    }
    
    .scrolltopa {
        transition-duration: .15s;
        margin-left: -40px;
        opacity: 0;
    }
    
    .scrolltopashow {
        margin-left: 0px;
        opacity: 1;
    }`,
	core: MExt => {
		const $ = MExt.jQuery!;
		const showTopLink = () => {
			let ft = $("#ft")[0];
			if (ft) {
				let scrolltop = $("#scrolltop")[0];
				if (!scrolltop) {
					return;
				}
				let scrolltopbtn = $(".scrolltopa");
				let scrollHeight = document.body.getBoundingClientRect().top;
				let basew = ft.clientWidth;
				let sw = scrolltop.clientWidth;
				if (basew < 1000) {
					let left = parseInt((window as any).fetchOffset(ft)["left"]);
					left = left < sw ? left * 2 - sw : left;
					scrolltop.style.left = basew + left + 44 + "px";
				} else {
					scrolltop.style.left = "auto";
					scrolltop.style.right = "0";
				}
				if (scrollHeight < -100) {
					scrolltopbtn.addClass("scrolltopashow");
				} else {
					scrolltopbtn.removeClass("scrolltopashow");
				}
			}
		};
		(window as any).showTopLink = showTopLink;
		$(showTopLink);
	}
} as MExtModule;
