import { MExtModule } from "../../Inject/Core";

export default {
	predicate: MExt => MExt.ValueStorage.get("fixTopBarPopMenu"),
	config: [
		{
			id: "fixTopBarPopMenu",
			default: true,
			type: "check",
			name: "弹出菜单美化",
			desc: "美化弹出菜单的样式,如个人信息菜单."
		}
	],
	style: `.p_pop:not(.blk) a {
        border-radius: 5px;
        border-bottom: none;
    }

    div#user_info_menu {
        margin-top: 5px;
    }

    .user_info_menu_info>li {
        margin-top: 2px;
    }

    a.rank {
        padding: 2px 7px!important;
        border-radius: 14px;
    }

    a.rank:hover {
        text-decoration: none;
    }

    ul.user_info_menu_btn {
        padding-top: 6px;
    }
    ul.user_info_menu_btn>li>a {
        padding: 5px 8px;
        border-radius: 5px;
    }

    ul.user_info_menu_btn>li>a[onclick]:hover {
        background: red!important;
    }

    #myprompt_menu {
        margin-left: -10px;
    }

    #myprompt_menu, #usertools_menu, #sslct_menu {
        z-index: 791!important;
        margin-top: 5px!important;
        transform: translateX(-50%);
        margin-left: 20px;
    }

    .p_pop:not(.h_pop) {
        border: 1px solid #d1d1d1;
        min-width: unset;
        border-radius: 5px;
    }

    #myprompt_menu>li>a, #usertools_menu>li>a, #scbar_type_menu>li>a {
        border: none;
        border-radius: 5px;
        text-align: center;
        padding: 3px 15px;
    }

    #myprompt_menu>li>a:hover, #scbar_type_menu>li>a:hover, #usertools_menu>li>a:hover {
        background: #36b030;
        color: white;
    }

    div#sslct_menu {
        margin-left: 54px;
        padding-left: 14px;
    }

    .sslct_btn {
        border: none!important;
        width: 15px;
        height: 15px;
        padding: 2px;
    }

    .sslct_btn i {
        border-radius: 50%;
        width: 13px;
        height: 13px;
    }

    #scbar_type_menu {
        background: url(https://www.mcbbs.net/template/mcbbs/image/bg-wool-white.png);
    }

    a#scbar_type:after {
        content: "▼";
        margin-left: 10px;
    }

    #scbar_type_menu>li>a {
        padding: 3px 5px;
        line-height: 20px;
        height: 20px;
    }

    .scbar_type_td {
        background: url(https://www.mcbbs.net/template/mcbbs/image/scbar_txt.png) -95px center no-repeat
    }

    .y_search {
        width: 249px;
        border-radius: 3px;
        overflow: hidden;
    }
    .y_search_inp {
        float: unset;
    }

    #scbar_txt {
        width: 130px;
        background-color: transparent;
    }
    body.winter{
        --MExtBtnClr: #5c8dff!important;
    }
    body.nether{
        --MExtBtnClr: #a42e0b!important;
    }
    body{
        --MExtBtnClr: #36b030!important;
    }
    .user_info_menu_info li a.rank, .user_info_menu_info li a.rank font, ul.user_info_menu_btn>li>a:hover, .p_pop:not(.blk) a:hover,#myprompt_menu>li>a:hover, #scbar_type_menu>li>a:hover, #usertools_menu>li>a:hover, .p_pop:not(.blk) a:hover {
        background: var(--MExtBtnClr);
        color: white!important;
    }
    `,
	core: MExt => {
		const $ = MExt.jQuery!;
		let __extstyle = (window as any).extstyle;
		let checkStyle = (style?: string | null) => {
			let theme = style == null ? (window as any).getcookie("extstyle") : style;
			if (theme == "./template/mcbbs/style/winter") {
				$("body").removeClass("nether").addClass("winter");
			} else if (theme == "./template/mcbbs/style/default") {
				$("body").removeClass("winter nether");
			} else {
				$("body").addClass("nether").removeClass("winter");
			}
		};
		(window as any).extstyle = (style: string) => {
			__extstyle(style);
			checkStyle(style);
		};
		checkStyle();
	}
} as MExtModule;
