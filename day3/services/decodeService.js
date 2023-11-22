function decodeBase64(encodedString) {
	const buff = Buffer.from(encodedString, "base64");
	return buff.toString("utf-8");
}

module.exports = { decodeBase64 };
