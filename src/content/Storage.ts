import type MessageBridge from "src/utils/MessageBridge";
import { storage } from "webextension-polyfill";

export default (msg: MessageBridge) => {
	msg.onCommand<Record<string, unknown>>("storage_save", async (data) => {
		await storage.local.set(data.data);
		msg.sendCommand("storage_updated", data.data);
		data.resolve();
	});
	msg.onCommand("storage_load", async (data) => {
		data.resolve(await storage.local.get());
	});
	async function get<T>(key: string, defaultValue: T): Promise<T>;
	async function get<T>(key: string, defaultValue?: T): Promise<T | undefined>;
	async function get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
		return (await storage.local.get({
			[key]: defaultValue
		}))[key];
}
	return {
		get,
		set(key: string, value: any): Promise<void> {
			return storage.local.set({
				[key]: value
			});
		}
	};
}