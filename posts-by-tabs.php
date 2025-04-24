<?php namespace cmk\postsByTabs;

/**
 * Plugin Name:       Posts By Tabs
 * Description:       Display the same posts in multiple template formats using tabs : grid, list, slider, calendar, google map (events, venues).
 * Version:           1.0.2
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

defined( 'ABSPATH' ) || exit;

if (!file_exists(plugin_dir_path(__FILE__) . '/vendor/autoload.php')) {
	return;
}
require_once realpath(plugin_dir_path(__FILE__) . '/vendor/autoload.php');

restExtend::get_instance();

add_action( 'init', function () {
	register_block_type( __DIR__ . '/build/posts-by-tabs' );
} );

