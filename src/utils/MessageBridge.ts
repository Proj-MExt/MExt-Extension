import type { Runtime } from "webextension-polyfill";
type Port = Runtime.Port;

interface MessageObject<T> {
	_id: number,
	type: string,
	data: T
}

interface MessageRespObject<T> {
	type: string,
	data: T,
	resolve: (value?: any) => void
}

export default class MessageBridge {
	public readonly port: MessagePort | Port;
	private list = new Map<string, ((event: MessageRespObject<any>) => void)[]>();
	private waiting = new Map<string, (event: any) => void>();

	constructor(port: MessagePort | Port) {
		this.port = port;
		const addListener = port instanceof MessagePort ? (handler: any) => port.addEventListener("message", handler) : (handle: any) => port.onMessage.addListener(handle);
		addListener((e: any) => {
			const { type, data, _id } = (e instanceof MessageEvent ? e.data : e) as MessageObject<any>;
			if (type == "response") {
				const id = _id.toString();
				this.waiting.get(id)?.(data);
				this.waiting.delete(id);
				return;
			}
			const list = this.list.get(type);
			const resolve = (value: any) => {
				port.postMessage({
					_id,
					type: "response",
					data: value
				});
			};
			if (list) {
				list.forEach(cb => {
					cb({
						type,
						data,
						resolve
					});
				});
			}
		});
		if (port instanceof MessagePort) {
			port.start();
		}
	}

	public onCommand<T>(type: string, callback: (event: MessageRespObject<T>) => void) {
		if (!this.list.has(type)) {
			this.list.set(type, []);
		}
		this.list.get(type)?.push(callback);
	}
	public sendCommand<T, V>(type: string, data?: V): Promise<T>{
		const _id = Date.now();
		this.port.postMessage({
			_id,
			type,
			data
		});
		return new Promise(resolve => {
			this.waiting.set(_id.toString(), (data) => {
				resolve(data);
			});
		});
	}
}