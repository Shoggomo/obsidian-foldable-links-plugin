import {App, setIcon, TFile} from "obsidian";
import CollapsibleList from "./CollapsibleList";

export class FoldableLink {
	private app: App;
	private currentFile: TFile | null;
	private wrapper: HTMLElement;
	private link: HTMLElement;
	private collapseIcon: HTMLElement;
	private subLinks: string[];
	private list: CollapsibleList | null = null;

	public get element() {
		return this.wrapper
	}


	public static async createFoldableLink(app: App, linkPath: string, file: TFile | null, parent: HTMLElement) {
		const subLinks = await FoldableLink.searchLinkpaths(app, file);
		return new FoldableLink(app, linkPath, file, parent, subLinks);
	}

	private constructor(app: App, linkPath: string, file: TFile | null, parent: HTMLElement, subLinks: string[]) {
		this.app = app;
		this.currentFile = file;
		this.subLinks = subLinks;
		this.collapseIcon = this.createCollapseIconElement();
		this.wrapper = parent;
		this.link = this.createLinkElement(linkPath);

		FoldableLink.styleWrapper(this.wrapper);
		this.addOnClickListener();
		parent.prepend(this.collapseIcon, this.link);
	}

	private hasSublinks() {
		return this.subLinks.length > 0;
	}

	private static async searchLinkpaths(app: App, currentFile: TFile | null) {
		if (!currentFile)
			return [];

		const content = await app.vault.cachedRead(currentFile);
		const matches = Array.from(content.matchAll(/\[\[(.+?)]]/g));
		return matches.map(match => match[1]);
	}

	private static styleWrapper(wrapper: HTMLElement) {
		wrapper.addClass("link-wrapper", "is-collapsed");
	}

	private createCollapseIconElement() {
		const collapseElement = createDiv({
			cls: `collapse-icon ${!this.hasSublinks() ? "no-links" : ""}`,
		});

		const iconId = this.hasSublinks() ? "right-triangle" : "dot";
		setIcon(collapseElement, iconId, 8)

		return collapseElement;
	}

	private addOnClickListener() {
		if (!this.hasSublinks() || !this.currentFile)
			return;

		this.wrapper.onClickEvent(async () => {
			if (!this.list) {
				this.list = await this.createList();
				this.list.element.insertAfter(this.wrapper)
			}
			this.toggleList(this.list);
		})

	}

	private createLinkElement(filepath: string) {
		return createEl("a", {
			text: filepath,
			cls: `internal-link ${!this.currentFile ? "is-unresolved" : ""}`,
			href: filepath,
			attr: {
				"data-href": filepath,
				target: "_blank",
				rel: "noopener",
			}
		});
	}

	async createList() {
		const subList = new CollapsibleList({
			cls: "link-list"
		});

		const lis = await Promise.all(this.subLinks.map(async linkpath => {
			const li = createEl("li");
			const subFile = this.currentFile ? this.app.metadataCache.getFirstLinkpathDest(linkpath, this.currentFile.path) : null;
			const foldableLink = await FoldableLink.createFoldableLink(this.app, linkpath, subFile, li);
			return foldableLink.element;
		}))

		subList.addItems(lis);

		return subList;
	}

	private toggleList(list: CollapsibleList) {
		if (list.isCollapsed()) {
			list.unfold();
			this.wrapper.removeClass("is-collapsed");
		} else {
			list.collapse();
			this.wrapper.addClass("is-collapsed");
		}
	}

}
