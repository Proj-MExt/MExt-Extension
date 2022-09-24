export default (): MessagePort => {
	const channel = new MessageChannel();
	window.postMessage("MExtMsgPort", "*", [channel.port2]);
	return channel.port1;
}