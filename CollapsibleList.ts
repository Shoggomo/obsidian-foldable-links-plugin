const COLLAPSE_ANIMATION_DURATION = 100;

export default class CollapsibleList {
	private list: HTMLElement;

	public get element() {
		return this.list
	}

	constructor(listAttributes: DomElementInfo) {
		this.list = CollapsibleList.createListElementCollapsed(listAttributes);
	}

	private static createListElementCollapsed(listAttributes: DomElementInfo) {
		const ul = createEl("ul", listAttributes);
		ul.style.maxHeight = "0";
		return ul;
	}

	public addItems(items: HTMLElement[]) {
		this.list.append(...items);
	}

	public isCollapsed() {
		return Number.parseInt(this.list.style.maxHeight) === 0;
	}

	public collapse() {
		this.list.style.maxHeight = `${this.list.scrollHeight}px`;
		requestAnimationFrame(() => this.list.style.maxHeight = "0")
	}

	public unfold() {
		this.list.style.maxHeight = "0";
		requestAnimationFrame(() => this.list.style.maxHeight = `${this.list.scrollHeight}px`)
		setTimeout(() => this.list.style.maxHeight = "initial", COLLAPSE_ANIMATION_DURATION)
	}

}
