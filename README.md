## Obsidian Foldable Links Plugin

This plugin allows unfolding of internal links like a folder tree. Just like the navigation pane. When unfolding the
link to a file all internal links in the file will be listed and can be unfolded again.

Example:

![Example](img/example.png)

**Note:** This plugin is in early development. Feature requests are welcome.

## Usage

Create a list and add one internal list per line. When rendered the list items will be foldable.

**Example**:

<table><tr>
<td>

```markdown
# Index

- [[📆 Daily Notes]]
- [[🍳 Cooking]]
- [[💻 Technology]]
```

</td>
<td>

![Example](img/example.png)

</td>
</tr></table>

## TODOs / Bugs

- Better project structure
- Add settings to configure the plugin
    - Setting to change list markers (also for links without sub links)
    - Other styling features (padding, indentations, etc)
- Decide on bahaviour on mixed lists (links and normal text)
- Order of text and links in a list item gets scrambled
