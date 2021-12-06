import {App, setIcon, TFile} from "obsidian";
import CollapsibleList from "./CollapsibleList";
import LinkInfo from "./LinkInfo";
import {uniqBy} from "lodash";

export class FoldableLink {
	private app: App;
	private currentFile: TFile | null;
	private wrapper: HTMLElement;
	private collapseIcon: HTMLElement;
	private subLinks: LinkInfo[];
	private list: CollapsibleList | null = null;

	public get element() {
		return this.wrapper
	}


	public static async createFoldableLink(app: App, linkInfo: LinkInfo, file: TFile | null, parent: HTMLElement, path: string[]) {
		const subLinks = await FoldableLink.searchLinks(app, file);
		const parentLinksFiltered = subLinks.filter(link => !path.includes(link.path));
		return new FoldableLink(app, linkInfo, file, parent, parentLinksFiltered, path);
	}

	private constructor(app: App, linkInfo: LinkInfo, file: TFile | null, parent: HTMLElement, subLinks: LinkInfo[], path: string[]) {
		this.app = app;
		this.currentFile = file;
		this.subLinks = subLinks.filter(link => !path.includes(link.path));
		this.collapseIcon = this.createCollapseIconElement();
		this.wrapper = parent;

		FoldableLink.styleWrapper(this.wrapper);
		this.addOnClickListener(path);
		const linkElement = this.createLinkElement(linkInfo);
		parent.prepend(this.collapseIcon, linkElement);
	}

	private hasSublinks() {
		return this.subLinks.length > 0;
	}

	private static async searchLinks(app: App, currentFile: TFile | null): Promise<LinkInfo[]> {
		if (!currentFile)
			return [];

		const content = await app.vault.cachedRead(currentFile);
		const matches = Array.from(content.matchAll(/\[\[(.+?)]]/g));
		const links = matches.map(match => LinkInfo.fromRawText(match[1]));
		return uniqBy(links, link => link.name)
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

	private addOnClickListener(path: string[]) {
		if (!this.hasSublinks() || !this.currentFile)
			return;

		this.collapseIcon.onClickEvent(async () => {
			if (!this.list) {
				this.list = await this.createList(path);
				this.list.element.insertAfter(this.wrapper)
			}
			this.toggleList(this.list);
		})

	}

	private createLinkElement(link: LinkInfo) {
		return createEl("a", {
			text: link.name,
			cls: `internal-link ${!this.currentFile ? "is-unresolved" : ""}`,
			href: link.path,
			attr: {
				"data-href": link.path,
				target: "_blank",
				rel: "noopener",
			}
		});
	}

	async createList(path: string[]) {
		const subList = new CollapsibleList({
			cls: "link-list"
		});

		const lis = await Promise.all(this.subLinks.map(async linkInfo => {
			const li = createEl("li");
			const subFile = this.currentFile ? this.app.metadataCache.getFirstLinkpathDest(linkInfo.path, this.currentFile.path) : null;
			const foldableLink = await FoldableLink.createFoldableLink(this.app, linkInfo, subFile, li, [...path, linkInfo.path]);
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
