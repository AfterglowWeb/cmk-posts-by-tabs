
# Posts By Tabs
## Events and Venues viewer

**Plugin Type:** WordPress Block Editor (Gutenberg)  
**Contributors:** Cédric Moris Kelly  
**Tags:** gutenberg, block, tabs, posts, custom post types, meta query, filters  
**Requires at least:** 6.0  
**Tested up to:** 6.7  
**Requires PHP:** 8.1  
**Stable tag:** 1.0.1b  
**License:** GPL-3.0-or-later  
**License URI:** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

## Currently under development ##

## Description

Posts By Tabs is a Gutenberg WordPress block that allows you to display posts, custom post types, and other content in interactive tab layouts. The block is intend to display the same posts through tabs with various template .

### Key Features (WIP):

- **Multiple Tab Layouts**: Create and customize multiple tabs, each with its own display template and settings
- **Advanced Query Builder**: Filter posts by type, taxonomy, multiple terms, and order
- **WIP: Meta Query Support**: Advanced filtering using custom fields (post metadatas and ACF fields). Choose metafields related to a post type and build complex queries.
- **Template Variations**: Choose different display templates for your posts : grid, slider, calendar (events), map (venues)
- **Customizable Options**: Control excerpt length, display of dates, authors, categories, and more
- **Material UI Interface**: Modern, responsive design powered by Material UI components
- **Dynamic Loading**: Load posts without page reload for better user experience
- **Calendar template** : Display Events and Venues in a day/week/month fullscreen calendar. Preview each post.
- **Google Map template** : Display Places and Venues on Google Map with custom markers.

## Installation

1. Upload the plugin files to the `/wp-content/plugins/posts-by-tabs` directory, or install the provided plugin zip through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Use the Block Editor (Gutenberg) to add a "Posts By Tabs" block to your page.
4. Configure the block settings in the sidebar panel:
   - Add tabs with custom titles and templates
   - Set post queries by type, taxonomy, and terms
   - Configure meta queries for advanced filtering
   - Customize display options for each tab

## Frequently Asked Questions

### How do I filter posts by custom fields?

Use the Meta Query panel in the block settings sidebar. You can create complex queries with multiple conditions using AND/OR logic. Each meta query can specify a key, value, comparison operator, and data type.

### Can I display different post types in different tabs?

No. Each tab presents the same posts with a different view

### How do I customize the appearance of posts?

Each tab has template options controlling how content is displayed. You can toggle visibility of elements like featured images, excerpts, author information, and more.

### Does it support custom post types?

Yes, the plugin works with any registered public post type in your WordPress installation.

### Can I select multiple taxonomy terms?

Yes, you can select multiple terms from any taxonomy to create more refined content displays.

## Development

### Installation

Clone or download the repository and run at the root of the package:

```sh
npm install
```
or
```sh
yarn
```

### Development Commands

```sh
npm run build
```
Build the package for production.

```sh
npm run start
```
Build the package for development and watch for changes.

```sh
npm run tailwind
```
Build tailwindcss output and watch for changes.

```sh
npm run plugin-zip
```
Create a plugin zip file for distribution.

```sh
npm run format
npm run lint:css
npm run lint:js
```
Lint and format code.

## Technical Details

Posts By Tabs uses:

- React for component architecture
- Material UI for interface elements
- WordPress Block API for integration
- WordPress REST API for dynamic data fetching
- Meta query support for advanced filtering
- Tailwind CSS for utility styling

## Changelog

### 1.0.1b

- Added support for multiple term selection
- Improved meta query interface with field type options
- Fixed REST API integration for custom endpoints
- Enhanced error handling and state management

### 1.0.0

- Initial version of Posts By Tabs

## Credits

Developed by Cédric Moris Kelly

Similar code found with 1 license type