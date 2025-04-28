
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

### Posts By Tabs
Posts By Tabs is a Gutenberg block for WordPress that displays posts and custom post types in interactive tabbed layouts. The block presents the same collection of post data across multiple tabs, with each tab offering a different display template.

Originally developed for events and venues management, Posts By Tabs includes template options such as:
- Calendar layouts for events
- Geolocated maps for venues
- Grid, card, or hero-style views
- Gallery-style post displays
Visitors can seamlessly switch between visualization methods while viewing the same content.

### Use Cases
This block addresses a common need across various industries where users manage:
- Custom post types for events, venues, or shops
- Groups of meta fields associated with existing WordPress post types

### Features
#### Query Builder
A comprehensive query builder supports filtering and organizing content, including:
- Post type selection
- Posts per page and pagination controls
- Sorting (order, order by, meta key)
- Taxonomy term filtering
- Advanced meta queries with AND/OR logic, comparison operators, and data types

#### Template System
Flexible templates allow content to be displayed in multiple formats, each suited to different contexts.

#### Security & Visibility
The plugin automatically filters out private post types and unpublished posts. Future updates may include a "Preview Drafts" option for the editor.

#### Meta Field Integration
The meta query selector dynamically fetches meta fields attached to the selected post type.

## Currently Under Development ##
This plugin is in beta, with core functionality complete and ready for testing. The following templates are fully implemented and operational:

- Grid
- Slider
- Calendar
- Google Maps

While functional, the plugin is not yet recommended for production environments as it requires further testing.

### Upcoming Features
Additional template views and frontend post filtering components are in active development and will be included in future releases.
We recommend testing this plugin in staging or development environments until a stable version is available.

### Key Features
#### Layout & Display
- Multiple Tab Layouts – Create and customize tabs, each with unique display templates and settings.
- Template Variations – Display posts as grids, sliders, event calendars, or Google Maps.
- Dynamic Loading – Seamless post loading without page reloads for improved UX.

#### Query & Filtering
- Advanced Query Builder – Filter by post type, taxonomy, terms, meta values, and sorting.
- Meta Query Support – Build complex queries using custom meta fields (supports ACF and native WordPress meta).

#### Templates in Development (WIP)
- Customizable Display Options – Control excerpt length, dates, authors, categories, and more.
- Card/Hero Templates – Multiple styling options for grid and slider layouts.

#### Specialized Templates
- Calendar View – Display events and venues in day/week/month layouts with post previews.
- Google Maps Integration with Markers Clutering – Plot locations with custom markers for places and venues.

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