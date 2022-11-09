import type MessageBridge from "src/utils/MessageBridge";
import { storage } from "webextension-polyfill";

export default (msg: MessageBridge) => {
	const store = storage.local;
	msg.onCommand<Record<string, unknown>>("storage_save", async (data) => {
		await store.set(data.data);
		data.resolve();
		await msg.sendCommand("storage_updated", data.data);
	});
	msg.onCommand<{key: string} | undefined>("storage_load", async (data) => {
		if (typeof data.data != "undefined") {
			data.resolve((await store.get())[data.data.key]);
		} else {
			data.resolve(await store.get());
		}
	});
	async function get<T>(key: string): Promise<T | undefined>;
	async function get<T>(key: string, defaultValue: T): Promise<T>;
	async function get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
		return (await store.get({
			[key]: defaultValue
		}))[key];
}
	return {
		get,
		set(key: string, value: any): Promise<void> {
			return store.set({
				[key]: value
			});
		}
	};
}