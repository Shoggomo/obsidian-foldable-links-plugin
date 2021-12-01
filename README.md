## Obsidian Foldable Links Plugin

This plugin allows unfolding of internal links like a folder tree. Just like the navigation pane.
When unfolding the link to a file all internal links in the file will be listed and can be unfolded again.

Example:

Image here TBA

**Note:** This plugin is in early development. Feature requests are welcome.

## Usage

Create a list and add one internal list per line. When rendered the list items will be foldable.

Example:
```markdown
# Index
- [[📆 Daily Notes]]
- [[🍳 Cooking]]
- [[💻 Technology]]
```

## TODOs / Bugs
 - [ ] Better project structure
 - [ ] Add settings to configure the plugin
   - [ ] Setting to change list markers (also for links without sub links)
   - [ ] Other styling features (padding, indentations, etc)
 - [ ] If a link occurs multiple times in a file, only show it once
 - [ ] If multiple links are in one line, they all unfold together in one list (maybe it's a feature)
