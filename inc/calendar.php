<?php namespace cmk\postsByTabs;

defined( 'ABSPATH' ) || exit;

use cmk\postsByTabs\restExtend;

class calendar {

	protected static $instance = null;

	public static function get_instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}
		return static::$instance;
	}

	public function __construct() {
		add_filter( 'cmk_posts_by_tabs_calendar', array( $this, 'group_events_by_date' ), 10, 2 );
	}

	public function group_events_by_date($posts, $options) {

		if ( ! is_array( $posts ) || empty( $posts ) ) {
			return array();
		}

		$startKey = $options['start_key'] ?? 'start';
		$endKey = $options['end_key'] ?? 'end';
		
		$grouped = array();
		
		foreach($posts as $post) {

			$start = null;
			$end = null;

			$post = (array) $post;
			if (isset($post['acf'])) {
				if(isset($post['acf'][ $startKey ])) {
					$start = $post['acf'][ $startKey ];
				}
				if(isset($post['acf'][ $endKey ])) {
					$end = $post['acf'][ $endKey ];
				}
			}

			if(!$start) {
				$start = get_post_meta($post['id'], $startKey, true);
			}
			if(!$end) {
				$end = get_post_meta($post['id'], $endKey, true);
			}

			if(!$start) {
				continue;
			}

			$startDate = date_create_from_format('d/m/Y', $start);
			$endDate = $startDate;
			if($end) {
				$endDate = date_create_from_format('d/m/Y', $end);
			}

			$dates = new \DatePeriod($startDate, new \DateInterval('P1D'), $endDate->modify('+1 day'));
			$countedDates = iterator_count($dates);
			foreach($dates as $i => $date) {
				$dateKey = $date->format('Y-m-d');
				if(!isset($grouped[$dateKey])) {
					$grouped[$dateKey] = array();
				}

				$eventWithPosition = array(
					...$post,
					'multiDay' => $countedDates > 1 ?? false,
					'position' => $date === $startDate ? 'start' : ($date === $endDate ? 'end' : 'middle'),
					'totalDays' => $countedDates
				);

				$grouped[$dateKey][] = $eventWithPosition;
			}

		}

		return $grouped;
	}

	public static function format_date_range( $start, $end ) {
		if ( ! $start ) {
			return '';
		}
		$startParts = explode( $start, ' ' );
		$endParts   = $end ? explode( $end, ' ' ) : array();
		for ( $i = count( $endParts ); 0 < $i; $i-- ) {
			if ( $startParts[ $i ] == $endParts[ $i ] ) {
				$startParts[ $i ] = '';
			} else {
				break;
			}
		}

		$newStart = array_filter(
			$startParts,
			function ( $part ) {
				return $part !== '';
			}
		);
		$newStart = implode( ' ', $newStart );

		return array(
			'start' => $newStart,
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
			'noend'        => !$end ?? false,
		);

		if ( $args['start'] && $args['end'] ) {
			list($startYear, $startMonth, $stardDay) = explode( '-', $args['start'] );
			list($endYear, $endMonth, $endDay)       = explode( '-', $args['end'] );

			if ( $startYear === $endYear && $startMonth === $endMonth && $stardDay === $endDay ) {
				$args['end']        = false;
				$args['string_end'] = false;
				$args['noend']      = false;
			}
		}

			$themeObj   = wp_get_theme();
			$textDomain = $themeObj->get( 'TextDomain' );

			$string = false;
		switch ( true ) {
			case $args['end'] && ! $args['noend']:
				$string = sprintf(
					esc_html__( 'Du %1$s au %2$s', $textDomain ),
					'<time datetime="' . $args['start'] . '">' . $args['string_start'] . '</time>',
					'<time datetime="' . $args['end'] . '">' . $args['string_end'] . '</time>'
				);

				break;

			case ! $args['end'] && ! $args['noend']:
				$string = sprintf(
					esc_html__( 'Le %s', $textDomain ),
					'<time datetime="' . $args['start'] . '">' . $args['string_start'] . '</time>'
				);

				break;

			case ! $args['end'] && $args['noend']:
				$string = sprintf(
					esc_html__( 'À partir du %s', $textDomain ),
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
		$now       = new \DateTime();
		$startDate = new \DateTime( $start );

		if ( ! $end ) {
			$endDate = $startDate;
			$endDate = $endDate->setTime( 23, 59, 59 );
		} else {
			$endDate = new \DateTime( $end );
		}

		return $startDate <= $now && $now <= $endDate;
	}

	public static function exists( $array, $key ) {
		return array_key_exists( $key, $array ) && ! empty( $array[ $key ] );
	}
}
