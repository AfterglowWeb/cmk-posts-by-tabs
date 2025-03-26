<?php
/**
 * Plugin Name:       Posts By Tabs
 * Description:       Display the same posts in multiple template formats using tabs : grid, list, slider, calendar, google map (events, venues).
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Cédric Moris Kelly
 * Author URI:        http://moriskelly.com
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       posts-by-tabs
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
function create_block_posts_by_tabs_block_init() {
	register_block_type( __DIR__ . '/build/posts-by-tabs' );
}
add_action( 'init', 'create_block_posts_by_tabs_block_init' );
