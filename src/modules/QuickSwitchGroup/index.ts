import { MExtModule } from "../../inject/Core";
import style from "./index.css?inline";

interface MGroup {
	name: string,
	id: string
}
interface MGroupCache {
	t: number,
	group: MGroup[]
}
function getCurrentGroup(): MGroup {
	const currentGroupMatch = document.querySelector<HTMLAnchorElement>("#user_info_menu .rank")!;
	return {
		name: currentGroupMatch.innerText,
		id: currentGroupMatch.href.match(/gid=(\d+)/)![1]
	};
}
async function getGroups(): Promise<MGroup[]> {
	const groups: MGroup[] = [getCurrentGroup()];
	const resp = await (await fetch("/home.php?mod=spacecp&ac=usergroup&inajax=1")).text();
	const matchArrays = /<div id="gmy_menu".*?>([\s\S]*?)<\/div>/.exec(resp)?.[1]?.matchAll(/gid=(\d+)">(.*?)</g);
	if (!matchArrays) return groups;

	for (const group of matchArrays) {
		groups.push({
			id: group[1],
			name: group[2]
		});
	}
	return groups.sort((a,b) => parseInt(a.id) - parseInt(b.id));
}
async function switchGroup(id: string) {
	const hash = document.querySelector<HTMLInputElement>("input[name=formhash]")?.value;
	if (!hash) return;
	await fetch(`https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup&do=switch&groupid=${id}`, {
		"body": `referer=&groupsubmit=true&gid=${id}&formhash=${hash}&editsubmit_btn=true`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
}
function setActive(index: number) {
	document.querySelector(".group-switch-item.active")?.classList.remove("active");
	document.querySelectorAll(".group-switch-item")[index]!.classList.add("active");
	document.querySelector<HTMLDivElement>(".group-switcher-popup")!.style.setProperty("--current-group", index.toString());
}
export default {
	predicate: MExt => MExt.ValueStorage.get<boolean>("quickSwitchGroup") === true,
	config: [
		{
			id: "quickSwitchGroup",
			default: true,
			name: "快速切换用户组",
			type: "check",
			desc: '在用户弹出菜单内快速切换用户组, 无需确认.'
		}
	],
	style,
	core: async (MExt) => {
		let groups = MExt.ValueStorage.get<MGroupCache>("quickSwitchGroupCache");
		if (!groups || Date.now() - groups.t > 24 * 60 * 60 * 1e3 ) {
			groups = {
				t: Date.now(),
				group: await getGroups()
			}
			MExt.ValueStorage.set<MGroupCache>("quickSwitchGroupCache", groups);
		}
		if (groups.group.length <= 1) return;
		let currentGroupId = getCurrentGroup().id;
		let currentGroupIndex = groups.group.findIndex(v => v.id == currentGroupId);
		const MenuRoot = document.createElement("div");
		Object.assign(MenuRoot, {
			className: "group-switcher-popup"
		});
		for (const index in groups.group) {
			const group = groups.group[index];
			const child = document.createElement("span");
			Object.assign(child, {
				innerText: group.name,
				className: "group-switch-item"
			});
			child.addEventListener("click", async () => {
				await switchGroup(group.id);
				setActive(parseInt(index));
			});
			MenuRoot.append(child);
		}
		let GroupRoot = document.querySelector("#user_info_menu")?.querySelector(".rank")?.parentElement;
		while (!(GroupRoot = document.querySelector("#user_info_menu")?.querySelector(".rank")?.parentElement)) {
			await MExt.Utils.sleep(50);
		}
		GroupRoot.className = "group-switcher-wrapper";
		GroupRoot.append(MenuRoot);
		GroupRoot.querySelector<HTMLAnchorElement>(".rank")!.style.display = "none";
		MenuRoot.style.setProperty("--group-count", groups.group.length.toString());
		setActive(currentGroupIndex);
	}
} as MExtModule;
