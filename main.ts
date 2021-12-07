import {
	addIcon,
	MarkdownPostProcessorContext,
	Plugin,
} from 'obsidian';

import {FoldableLink} from "./FoldableLink";
import FoldableLinksSettingTab from "./SettingsTab";
import LinkInfo from "./LinkInfo";

interface FoldableLinksSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: FoldableLinksSettings = {
	mySetting: 'default'
}

export default class FoldableLinksPlugin extends Plugin {
	settings: FoldableLinksSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.addIcons();

		this.addSettingTab(new FoldableLinksSettingTab(this.app, this));

		this.registerMarkdownPostProcessor(this.convertLinkListIntoFoldable.bind(this))
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addIcons() {
		addIcon("circle", `<circle cx="50" cy="50" r="34" fill="currentColor" />`)
	}

	convertLinkListIntoFoldable(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const linkListItems = el.querySelectorAll("ul > li > a.internal-link");

		linkListItems.forEach(async linkElement => {
			const linkInfo = LinkInfo.fromElement(linkElement as HTMLLinkElement);
			const sourcePath = ctx.sourcePath;
			const subFile = this.app.metadataCache.getFirstLinkpathDest(linkInfo.path, sourcePath)
			const li = linkElement.parentNode as HTMLElement;
			const ul = li.parentNode as HTMLElement;
			const path = [sourcePath.replace(".md", ""), linkInfo.path];

			await FoldableLink.createFoldableLink(this.app, linkInfo, subFile, li, path);
			ul.addClass("link-list")

			linkElement.remove();
		});
	}
}
