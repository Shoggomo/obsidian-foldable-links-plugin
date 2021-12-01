import {
	MarkdownPostProcessorContext,
	Plugin,
} from 'obsidian';

import {FoldableLink} from "./FoldableLink";
import FoldableLinksSettingTab from "./SettingsTab";

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

	convertLinkListIntoFoldable(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const linkListItems = el.querySelectorAll("ul > li > a.internal-link");

		console.log(linkListItems)

		linkListItems.forEach(async link => {
			const sourcePath = ctx.sourcePath;
			const subFile = this.app.metadataCache.getFirstLinkpathDest(link.getText(), sourcePath)
			const li = link.parentNode as HTMLElement;
			const ul = li.parentNode as HTMLElement; // This is save, because the above selector ensures two parents

			await FoldableLink.createFoldableLink(this.app, link.getText(), subFile, li);
			ul.addClass("link-list")

			link.remove();
		});
	}
}
