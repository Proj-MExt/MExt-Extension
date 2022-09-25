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
	public readonly port: MessagePort;
	private list = new Map<string, ((event: MessageRespObject<any>) => void)[]>();
	private waiting = new Map<string, (event: any) => void>();

	constructor(port: MessagePort) {
		this.port = port;
		port.addEventListener("message", (e: MessageEvent<MessageObject<any>>) => {
			const { type, data, _id } = e.data;
			if (type == "response") {
				const id = _id.toString();
				this.waiting.get(id)?.(e.data as any);
				this.waiting.delete(id);
				return;
			}
			const list = this.list.get(type);
			const resolve = (value: any) => {
				port.postMessage({
					_id: e.data._id,
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
		port.start();
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
				resolve(data.data);
			});
		});
	}
}