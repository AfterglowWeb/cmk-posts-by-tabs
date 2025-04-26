<?php namespace Cmk\PostsByTabs;

/**
 * Plugin Name:       Posts By Tabs
 * Description:       Display the same posts in multiple template formats using tabs : grid, list, slider, calendar, google map (events, venues).
 * Version:           1.0.3
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

RestExtend::get_instance();
OptionPage::get_instance();
PrepareAcfPostsRelations::get_instance();

add_action( 'init', function () {
	register_block_type( __DIR__ . '/build/posts-by-tabs' );
} );

add_action('enqueue_block_editor_assets', function () {
    
	$asset_file_path = plugin_dir_path(__FILE__) . 'build/posts-by-tabs/index.asset.php';
	
	if ( ! file_exists( $asset_file_path ) ) {
		return;
	}

	$asset_file = include( $asset_file_path );
    
    wp_register_script(
        'posts-by-tabs-editor',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );
    
    $options = OptionPage::get_instance()->get_options();

    wp_localize_script(
        'posts-by-tabs-editor',
        'postsByTabsSettings',
        [
            'dateFormat'        => $options['date_format'],
            'googleMapsApiKey'  => $options['google_maps_api_key'],
            'defaultLatitude'   => $options['google_maps_default_lat'],
            'defaultLongitude'  => $options['google_maps_default_lng'],
            'postsPerPage'      => $options['posts_per_page'],
            'defaultTemplate'   => $options['default_template'],
            'placePostType' => $options['place_post_type'],
            'placeForeignKey' => $options['place_foreign_key'],
            'eventPostType' => $options['event_post_type'],
            'eventForeignKey' => $options['event_foreign_key'],
            'cacheDuration'     => $options['cache_duration'],
        ]
    );
    
    wp_enqueue_script('posts-by-tabs-editor');
});

