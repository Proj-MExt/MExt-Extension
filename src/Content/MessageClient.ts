export default (): Promise<MessagePort> => {
	return new Promise(resolve => {
		const handler = (e: MessageEvent<any>) => {
			if (e.data != "MExtMsgPort") return;
			const client = e.ports?.[0];
			if (client instanceof MessagePort) {
				window.removeEventListener("message", handler);
				resolve(client);
			}
		};
		window.addEventListener("message", handler);
	})
}