<?php namespace cmk\postsByTabs;

defined( 'ABSPATH' ) || exit;

class calendar {

	protected static $instance = null;

	public static function get_instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}
		return static::$instance;
	}

	public function __construct() {
		add_filter( 'cmk_posts_by_tabs_posts_prepared', array( $this, 'group_events_by_date' ), 10, 2 );
	}

	public function group_events_by_date( $posts, $options ) {

		if ( ! is_array( $posts ) || empty( $posts ) ) {
			return array();
		}

		$start_key = $options['start_key'] ?? 'start';
		$end_key   = $options['end_key'] ?? 'end';

		$grouped = array();

		foreach ( $posts as $post ) {

			$start = null;
			$end   = null;

			$post = (array) $post;
			if ( isset( $post['acf'] ) ) {
				if ( isset( $post['acf'][ $start_key ] ) ) {
					$start = $post['acf'][ $start_key ];
				}
				if ( isset( $post['acf'][ $end_key ] ) ) {
					$end = $post['acf'][ $end_key ];
				}
			}

			if ( ! $start ) {
				$start = get_post_meta( $post['id'], $start_key, true );
			}
			if ( ! $end ) {
				$end = get_post_meta( $post['id'], $end_key, true );
			}

			if ( ! $start ) {
				continue;
			}

			$start_date = date_create_from_format( 'd/m/Y', $start );
			$end_date   = $start_date;
			if ( $end ) {
				$end_date = date_create_from_format( 'd/m/Y', $end );
			}

			$dates         = new \DatePeriod( $start_date, new \DateInterval( 'P1D' ), $end_date->modify( '+1 day' ) );
			$counted_dates = iterator_count( $dates );
			foreach ( $dates as $i => $date ) {
				$date_key = $date->format( 'Y-m-d' );
				if ( ! isset( $grouped[ $date_key ] ) ) {
					$grouped[ $date_key ] = array();
				}

				$event_with_position = array(
					...$post,
					'multiDay'  => $counted_dates > 1 ?? false,
					'position'  => $date === $start_date ? 'start' : ( $date === $end_date ? 'end' : 'middle' ),
					'totalDays' => $counted_dates,
				);

				$grouped[ $date_key ][] = $event_with_position;
			}
		}

		return $grouped;
	}

	public static function format_date_range( $start, $end ) {
		if ( ! $start ) {
			return '';
		}
		$start_parts = explode( $start, ' ' );
		$end_parts   = $end ? explode( $end, ' ' ) : array();
		for ( $i = count( $end_parts ); 0 < $i; $i-- ) {
			if ( $start_parts[ $i ] === $end_parts[ $i ] ) {
				$start_parts[ $i ] = '';
			} else {
				break;
			}
		}

		$new_start = array_filter(
			$start_parts,
			function ( $part ) {
				return '' !== $part;
			}
		);
		$new_start = implode( ' ', $new_start );

		return array(
			'start' => $new_start,
			'end'   => $end,
		);
	}

	public static function format_event_time( $start, $end = null ) {

		if ( ! $start ) {
			return;
		}

		$args = array(
			'start'        => date_i18n( 'Y-m-d', $start ),
			'end'          => $end ? date_i18n( 'Y-m-d', $end ) : false,
			'string_start' => date_i18n( get_option( 'date_format' ), $start ),
			'string_end'   => $end ? date_i18n( get_option( 'date_format' ), $end ) : false,
			'noend'        => ! $end ?? false,
		);

		if ( $args['start'] && $args['end'] ) {
			list($start_year, $start_month, $stard_day) = explode( '-', $args['start'] );
			list($end_year, $end_month, $end_day)       = explode( '-', $args['end'] );

			if ( $start_year === $end_year && $start_month === $end_month && $stard_day === $end_day ) {
				$args['end']        = false;
				$args['string_end'] = false;
				$args['noend']      = false;
			}
		}

			$theme_obj   = wp_get_theme();
			$text_domain = $theme_obj->get( 'TextDomain' );

			$string = false;
		switch ( true ) {
			case $args['end'] && ! $args['noend']:
				$string = sprintf(
					esc_html__( 'Du %1$s au %2$s', $text_domain ),
					'<time datetime="' . $args['start'] . '">' . $args['string_start'] . '</time>',
					'<time datetime="' . $args['end'] . '">' . $args['string_end'] . '</time>'
				);

				break;

			case ! $args['end'] && ! $args['noend']:
				$string = sprintf(
					esc_html__( 'Le %s', $text_domain ),
					'<time datetime="' . $args['start'] . '">' . $args['string_start'] . '</time>'
				);

				break;

			case ! $args['end'] && $args['noend']:
				$string = sprintf(
					esc_html__( 'À partir du %s', $text_domain ),
					'<time datetime="' . $args['start'] . '">' . $args['string_start'] . '</time>'
				);

				break;
		}

		if ( $string ) {
			return $string;
		}
			return false;
	}

	public static function is_current_event( $start, $end ) {
		$now        = new \DateTime();
		$start_date = new \DateTime( $start );

		if ( ! $end ) {
			$end_date = $start_date;
			$end_date = $end_date->setTime( 23, 59, 59 );
		} else {
			$end_date = new \DateTime( $end );
		}

		return $start_date <= $now && $now <= $end_date;
	}

	public static function exists( $array_object, $key ) {
		return array_key_exists( $key, $array_object ) && ! empty( $array_object[ $key ] );
	}
}
