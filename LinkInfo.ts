export default class LinkInfo {

	private constructor(public path: string, public name: string) {
	}

	public static fromElement(linkElement: HTMLLinkElement): LinkInfo {
		const path = linkElement.href.replace("app://obsidian.md/", "");
		// decoding is important, because of spaces and emojis
		const decodedPath = decodeURI(path);

		return new LinkInfo(decodedPath, linkElement.getText())
	}

	public static fromRawText(rawLink: string): LinkInfo {
		const matches = rawLink.match(/(.+?)(?:\|(.+))?$/);

		if (!matches) {
			throw new Error("Could not parse raw link.")
		}

		return new LinkInfo(matches[1], matches[2] || matches[1]);
	}

}
