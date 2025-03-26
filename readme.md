# Posts By Tabs

**Plugin Type:** WordPress block editor (Gutenberg) - This plugin is designed for use with the WordPress block editor, Gutenberg.
**Contributors:** Cédric Moris Kelly  
**Tags:** gutenberg, block, tabs, posts, events, calendar, material-ui  
**Requires at least:** 6.0  
**Tested up to:** 6.7  
**Requires PHP:** 7.4  
**Stable tag:** 1.0.1b  
**License:** GPL-3.0-or-later  
**License URI:** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

## Description

## Installation

1. Upload the plugin files to the `/wp-content/plugins/posts-by-tabs` directory, or install the provided plugin zip through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Use the Gutenberg editor to add a "Posts By Tabs" block to your page.
4. Configure tabs by adding content in the sidebar panel.

## Frequently Asked Questions

### Can I customize the tab colors and fonts?

### How many tabs can I add?

There is no set limit to the number of tabs you can create, though for usability we recommend keeping the number reasonable.

### Does it work with page builders like Elementor, Divi or VisualComposer?

No. Posts By Tabs is built specifically for the native WordPress block editor, Gutenberg. It is not compatible with other page builders.

## Development

### Installation

Clone or download the repository and type at the root of the package:

```sh
npm install
```
or
```sh
yarn
```

You may use the following commands in the root of the package:

```sh
npm run build
```
Build the package for production.

```sh
npm run start
```
Build the package for development and watch.

```sh
npm run tailwind
```
Build tailwindcss output and watch.

```sh
npm run plugin-zip
```
Zip the plugin for distribution.

```sh
npm run format
npm run lint:css
npm run lint:js
```
Lint commands.

```sh
npm run packages-update
```
Update command.

### 1.0.0

Initial version of Posts By Tabs.

## Developer Notes

This plugin uses:

- React for components
- Material UI for design elements
- WordPress Block API
- Tailwind CSS for utilities

For contribution guidelines, please see the GitHub repository.