<?php namespace cmk\postsByTabs;

defined( 'ABSPATH' ) || exit;

class map {

	protected static $instance = null;
	public static $endpoint    = 'posts-by-tabs/v1';

	public static function get_instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}
		return static::$instance;
	}

	public function __construct() {
		add_filter('cmk_posts_by_tabs_posts_prepared', array( $this, 'get_map' ), 10, 2);
	}

	public static function group_events_by_places( $posts ) {

		if ( ! is_array( $posts ) || empty( $posts ) ) {
			return array();
		}

		$options = optionPage::get_instance()->get_option('place_foreign_key');

		$grouped = array();

		foreach ( $posts as $post ) {

			$placeIds = null;

			if(isset($options['place_foreign_key'])) {
				$placeIds = self::place_ids_from_post( $post, $options['place_foreign_key'] );
			}

			if ( !is_array( $placeIds ) ) {
				continue;
			}

			foreach ( $placeIds as $placeId ) {
				if ( ! isset( $grouped[ $placeId ] ) ) {
					$grouped[ $placeId ] = (array) get_post( $placeId );
					$grouped[ $placeId ]['acf'] = get_fields( $placeId );
				}
				
				$grouped[ $placeId ]['events' ] = isset( $grouped[ $placeId ]['events'] ) ? $grouped[ $placeId ]['events'] : array();
				$grouped[ $placeId ]['events' ][] = $post;
			}

		}

		return false === empty($grouped) ? $grouped : $posts;
	}


	private static function place_ids_from_post($post, $place_foreign_key) {
	
		$places = get_post_meta( $post['id'], $place_foreign_key, true );
	
		if ( $places ) {
			$places = explode( ',', $places );
		} else if ( ! $places && function_exists( 'get_field' ) ) {
			$places = get_field( $place_foreign_key, $post['id'] );
		}

		if ( ! $places ) {
			continue;
		}

		if ( !is_array( $places ) ) {
			continue;
		}
		
		$placeIds = array_map( function($place) {
				if ( is_array( $place ) ) {
					return (int) $place['id'];
				}
				if ( is_numeric( $place ) ) {
					return (int) $place;
				}
			}, $places );

		$placeIds = array_filter(array_unique( $placeIds ));


		return $placeIds;
	}

}
