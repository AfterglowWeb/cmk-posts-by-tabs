
# Posts By Tabs
## Events and Venues viewer

**Plugin Type:** WordPress Block Editor (Gutenberg)  
**Contributors:** Cédric Moris Kelly  
**Tags:** gutenberg, block, tabs, posts, events, calendar, google map, custom post types, post query, tax query, meta query  
**Requires at least:** 6.0  
**Tested up to:** 6.7  
**Requires PHP:** 8.1  
**Stable tag:** 1.0.4  
**License:** GPL-3.0-or-later  
**License URI:** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

## Description

Posts By Tabs is a Gutenberg WordPress block that displays posts and custom post types in an interactive tabbed layouts. The block shows the same collection of post datas across multiple tabs, with each tab presenting a different display template.

Developed for events and venues management, Posts By Tabs includes display template options for your existing posts such as events calendar layouts, venues geolocated map, grid/card/heroe views (however you name it!), posts gallery view within a single block. Visitors can switch between different visualization methods for the same content.

The idea of this block comes from a recurring need among customers from so many various fields. The constant is that all of them has a custom post type for events, venues or shops or a group of metafields associated to an existing wordpress posttype.

The block features acomprehensive query builder with support for your existing posts and custom posts. The template system allows for organizing and displaying content in multiple formats, each appropriate to different contexts.

The query builder itself includes the following fields: post types, posts per page, number of pages, ordering, ordering by, ordering by meta key, terms per taxonomy, repeating metaquery constructor with AND/OR logic, comparison operators and data types.

The plugin will filter out any private postype and non published post.
A see draft posts option in editor will come later on.

The meta query selector automatically fetch the metafields attached to the currently selected post type.

## Currently under development ##

This plugin is currently in beta version with core functionality complete and ready for testing. The base grid, slider, calendar and Google Maps templates are fully implemented and operational. The plugin is not yet recommended for production environments.

Additional template views, including a Google Maps integration for venues/locations, are currently in active development. These templates will be included in upcoming releases.

A post filtering component for frontend users is also in active development. 

We recommend using this plugin in testing or staging environments until a stable release is available.

### Key Features:

- **Multiple Tab Layouts**: Create and customize multiple tabs, each with its own display template and settings
- **Advanced Query Builder**: Filter posts by type, taxonomy, multiple terms, meta values and order
- **Meta Query Support**: Advanced filtering using your existing custom meta fields (ACF and Wordpress meta fields support). Choose metafields associated to a post type and build complex queries.
- **Template Variations**: Choose different display templates for your posts : grid, slider, calendar (events), map (venues)
- **WIP Customizable Options**: Control excerpt length, display of dates, authors, categories, and more
- **WIP Various card/hero templates**: Choose between several card templates in grid and slider tabs
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
   - Set post queries by type, taxonomies, and terms
   - Configure meta queries for advanced filtering
   - Customize display options for each tab

## Frequently Asked Questions

### How do I filter posts by custom fields?

Use the Meta Query panel in the block settings sidebar. You can create complex queries with multiple conditions using AND/OR logic. Each meta query can specify a key, value, comparison operator, and data type.

### Can I display different post types in different tabs?

No. Each tab presents the same posts with a different view

### How do I customize the appearance of posts?

Under development: Each tab has template options controlling how content is displayed. You can toggle visibility of elements like featured images, excerpts, author information, and more.

### Does it support custom post types?

Yes, the plugin works with any registered public post type in your WordPress installation.
Of course, the plugin will not work with private post types (revision, nav_menu_item and plugins private post types).

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

Build the package for production:
```sh
npm run build
```
or
```sh
yarn build
```

Build the package for development and watch for changes:
```sh
npm run start
```
or
```sh
yarn start
```

Build tailwindcss output and watch for changes:
```sh
npm run tailwind
```
or
```sh
yarn tailwind
```

Create a plugin zip file for distribution:
```sh
npm run plugin-zip
```
or
```sh
yarn plugin-zip
```

Lint and format frontend code:
```sh
npm run format
npm run lint:css
npm run lint:js
```
or
```sh
yarn format
yarn lint:css
yarn lint:js
```

Build backend code:
```sh
composer build
```

Lint and format backend code:
```sh
composer lint
composer fix
composer build
```

## Technical Details

Posts By Tabs uses:

- React (WordPress Provided) for component architecture
- Material UI for interface elements
- WordPress Gutenberg Block API for integration
- WordPress REST API for dynamic data fetching
- Tailwind CSS for utility styling

## Changelog

### 1.0.4

- Refactorization of posttype, taxonomy, and metafield selectors in editor. Async queries on metafields were too heavy and have been replaced with server-rendered data
- Added Google Map tab with marker clustering for venue visualization
- Fixed editor UI interactions to prevent unwanted navigation while editing

### 1.0.3

- Front debug

### 1.0.2

- Added calendar templates support for day, week, month
- Removed block background options as setting up your own wrapper with Gutenberg group, columns etc. offers much more versatilty
- Verious styles and bug fixes

### 1.0.1b

- Added support for multiple term selection
- Improved meta query interface with field type options
- Fixed REST API integration for custom endpoints
- Enhanced error handling and state management

### 1.0.0

- Initial version of Posts By Tabs

## Credits

Developed by Cédric Moris Kelly