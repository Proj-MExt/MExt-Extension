import mdui from "mdui";
import { MExtModuleConfig } from "../inject/Core";
import { ValueStorage } from "../inject/utils";
import { storage } from "webextension-polyfill";

export const createConfigList = (list: MExtModuleConfig[], storage: ValueStorage) => {
	const ConfigListEle = document.querySelector("#config-list");
	if (!ConfigListEle) return;
	list.forEach(v => {
		const item = document.createElement("div");
		item.className = "mdui-list-item";
		const content = document.createElement("div");
		content.className = "mdui-list-item-content mdui-m-r-1";
		const title = document.createElement("div");
		title.className = "mdui-list-item-title mdui-list-item-one-line";
		title.innerText = v.name;
		const desc = document.createElement("div");
		desc.className = "mdui-list-item-text";
		desc.innerText = v.desc;
		content.appendChild(title);
		content.appendChild(desc);
		item.appendChild(content);
		if (v.type == "textarea" || v.type == "text"){
			const btn = document.createElement("button");
			btn.className = "mdui-btn mdui-btn-icon";
			const icon = document.createElement("i");
			icon.className = "mdui-icon material-icons";
			icon.innerText = "edit";
			btn.appendChild(icon);
			item.appendChild(btn);
			btn.addEventListener("click", () => {
				const dialog = mdui.prompt("", v.name, (result) => {
					storage.set(v.id, result);
					v.value = result;
					mdui.snackbar({
						message: "已保存, 刷新生效",
						timeout: 500
					});
				}, () => {}, {
					type: v.type as any,
					defaultValue: (v.value ?? v.default) as string,
					confirmOnEnter: v.type == "text",
					confirmText: "确定",
					cancelText: "取消"
				});
				if (v.type == "textarea") {
					dialog.$element.find(".mdui-textfield").append("<div class=\"mdui-textfield-helper\">支持多行输入</div>");
				}
				mdui.mutation(dialog.$element[0] as any);
			});
		} else {
			let input = document.createElement("input");
			if (v.type == "check") {
				const check = document.createElement("label");
				check.className = "mdui-switch";
				input.type = "checkbox";
				input.checked = (v.value ?? v.default) as boolean;
				const icon = document.createElement("i");
				icon.className = "mdui-switch-icon";
				check.appendChild(input);
				check.appendChild(icon);
				item.appendChild(check);
			} else if (v.type == "num") {
				const text = document.createElement("div");
				text.className = "mdui-textfield";
				input.className = "mdui-textfield-input";
				input.type =  "number";
				input.value = (v.value ?? v.default) as string;
				text.appendChild(input);
				item.appendChild(text);
			}
			input.addEventListener("change", (e) => {
				const target = (e.target as HTMLInputElement);
				const result = v.type == "check" ? target.checked : target.value;
				storage.set(v.id, result);
				v.value = result;
				mdui.snackbar({
					message: "已保存, 刷新生效",
					timeout: 500
				});
			});
		}
		ConfigListEle.appendChild(item);
	});
	mdui.mutation();
}

export const ColorSelector = async () => {
	const ColorAvailable = [
		"red",
		"pink",
		"purple",
		"deep-purple",
		"indigo",
		"blue",
		"light-blue",
		"cyan",
		"teal",
		"green",
		"light-green",
		"lime",
		"yellow",
		"amber",
		"orange",
		"deep-orange"
	];
	const store = storage.sync ?? storage.local;
	const dialog = mdui.dialog({
		title: "选择主题颜色",
		content: (() => {
			let content = "";
			ColorAvailable.forEach(v => {
				content += `<button class="color-btn mdui-btn mdui-btn-icon mdui-color-${v} mdui-m-x-1 mdui-m-b-1" data-color="${v}"></button>`
			})
			return content;
		})(),
		buttons: [
			{
				text: "取消",
				close: true
			}
		]
	});
	dialog.$element.find(".color-btn").on("click", function(e) {
		if (e.target instanceof HTMLElement) {
			const color = e.target.getAttribute("data-color");
			store.set({
				"theme-color": color
			}).then(() => {
				setThemeColor();
				dialog.close();
			});
		}
	});
}

export const setThemeColor = async () => {
	const color = (await (storage.sync ?? storage.local).get("theme-color"))["theme-color"];
	document.body.className = document.body.className.replace(/mdui-theme-primary-.*/g, "");
	document.body.className = document.body.className.replace(/mdui-theme-accent-.*/g, "");
	document.body.className += ` mdui-theme-primary-${color} mdui-theme-accent-${color}`;
}