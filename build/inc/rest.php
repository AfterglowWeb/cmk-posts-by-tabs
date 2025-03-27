<?php namespace cmk\postsByTabs;

class restExtend {

    protected static $instance = null;

	public static function get_instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}
		return static::$instance;
	}

	private function __construct() {
		$this->register_rest_routes();
	}


    public function register_rest_routes(): void
    {
        add_action('rest_api_init', function() {
        
            register_rest_route('posts-by-tabs/v1', '/events', [
                'methods' => 'GET',
                'callback' => ['\cmk\postsByTabs\restExtend::get_events_rest'],
                'permission_callback' => '__return_true',
                'args' => [
                    'paged' => [
                        'default' => 1,
                        'sanitize_callback' => 'absint',
                    ],
                    'types' => [
                        'default' => [],
                        'sanitize_callback' => function($param) {
                            return is_array($param) ? array_map('absint', $param) : [];
                        }
                    ],
                    'towns' => [
                        'default' => [],
                        'sanitize_callback' => function($param) {
                            return is_array($param) ? array_map('sanitize_text_field', $param) : [];
                        }
                    ],
                    'places' => [
                        'default' => [],
                        'sanitize_callback' => function($param) {
                            return is_array($param) ? array_map('absint', $param) : [];
                        }
                    ],
                    'period' => [
                        'default' => 'now',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                ],
            ]);
        });
    }

    public static function get_events_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $params = [
            'paged' => $request->get_param('paged'),
            'types' => $request->get_param('types'),
            'towns' => $request->get_param('towns'),
            'places' => $request->get_param('places'), 
            'period' => $request->get_param('period'),
        ];
        
        $events = self::events($params);
        
        $formatted_events = array_map(function($event) {
 
            $eventFields = get_fields($event->ID);

            $lieu = isset($eventFields['lieu']) ? get_post($eventFields['lieu']) : null; 
            $start_date = isset($eventFields['datedebut']) ? $eventFields['datedebut'] : null;
            $end_date = isset($eventFields['datefin']) ? $eventFields['datefin'] : null;
                
            return [
                'id' => $event->ID,
                'title' => get_the_title($event->ID),
                'permalink' => get_permalink($event->ID),
                'start_date' => $start_date,
                'end_date' => $end_date,
                'formatted_date' => self::format_event_date($start_date, $end_date),
                'venue' => $lieu ? [
                    'id' => $lieu->ID,
                    'title' => $lieu->post_title,
                    'permalink' => get_permalink($lieu->ID),
                ] : null,
                'thumbnail' => get_the_post_thumbnail_url($event->ID, 'medium'),
                'excerpt' => get_the_excerpt($event->ID),
            ];
        }, $events);

        return new \WP_REST_Response( $formatted_events, 200 );

    }

public static function events($params) {

    $args = array(
        'post_type' => 'evenement',
        'posts_per_page' => -1,
        'order' => 'DESC',
        'orderby' => 'meta_value_num',
        'meta_key' => 'datefin',
        'order' => 'DESC',
    );

    $args['paged'] = !empty($params['paged']) ? (int) $params['paged'] : (get_query_var('paged') ? get_query_var('paged') : 1);

    if(!empty($params['towns'])) {
        $towns = $params['towns'];
        $placesIds = self::places_by_towns($towns);
        $params['places'] = array_merge($params['places'], $placesIds);
    }

    if(!empty($params['places'])) {
        $args['meta_query'] = array(
            array(
                'key' => 'lieu',
                'value' => $params['places'],
                'compare' => 'IN',
            ),
        );		
    }

    if(!empty($params['types'])) {
        $args['tax_query'] = [
            'taxonomy' => 'type',
            'terms' => $params["types"],
            'field' => 'term_id',
            'include_children' => false,
        ];
    }

    if(!empty($params['period']) && $params['period'] !== 'all') {

        $today = date('Y-m-d');
        $period = is_array($params['period']) ? $params['period'][0] : $params['period'];
        switch($period) {
            case 'upcoming' :
                $args['meta_query'] = array(
                    'relation' => 'AND',
                    array(
                        'key' => 'datedebut',
                        'value' => $today,
                        'type'  => 'DATE',
                        'compare' => '>',
                    ),
                );
    
                $args['order'] = 'ASC';
                $args['meta_key'] = 'datedebut';
                $args['orderby'] = 'meta_value_num';
                break;
            case 'last_days' :
                $nDays = get_field('last-days','option') ? '+'.get_field('last-days','option').' days' : '+10 days';
                $inXdays = date('Y-m-d', strtotime($nDays));
                $today = date('Y-m-d');
                $args['meta_query'] = array(
                        'relation' => 'AND',
                        array(
                            'key' => 'datefin',
                            'value' => $inXdays,
                            'type'  => 'DATE',
                            'compare' => '<',
                        ),
                        array(
                            'key' => 'datefin',
                            'value' => $today,
                            'type'  => 'DATE',
                            'compare' => '>=',
                        ),
                    );
                $args['order'] = 'ASC';
                $argss['meta_key'] = 'datefin';
                break;
            case 'passed' :
                $args['meta_query'] = [
                    'datefin' => [
                        'key' => 'datefin',
                        'value' => date('Y-m-d'),
                        'type'  => 'DATE',
                        'compare' => '<',
                    ],
                ];
                $args['order'] = 'DESC';
                $args['orderby'] = 'datefin';
                break;
            case 'now' :
            default :
                $args['meta_query'] = array(
                    'relation' => 'AND',
                    array(
                        'key' => 'datedebut',
                        'value' => $today,
                        'type'  => 'DATE',
                        'compare' => '<=',
                    ),
                    array(
                        'key' => 'datefin',
                        'value' => $today,
                        'type' => 'DATE',
                        'compare' => '>='
                    )
                );

                $args['order'] = 'ASC';
                $args['meta_key'] = 'datefin';
                $args['orderby'] = 'meta_value_num';
                break;

        }
    }


    $posts = new \WP_Query($args);
    $posts = $posts->get_posts();
    wp_reset_postdata();
    return $posts;
}

private static function format_event_date($start_date, $end_date) {
    if (!$start_date) {
        return '';
    }
    
    $start = strtotime($start_date);
    $end = $end_date ? strtotime($end_date) : null;
    
    if ($end && date('Y-m-d', $start) !== date('Y-m-d', $end)) {
        return sprintf(
            '%s - %s',
            date_i18n(get_option('date_format'), $start),
            date_i18n(get_option('date_format'), $end)
        );
    }
    
    return date_i18n(get_option('date_format'), $start);
}

public static function places_by_towns($towns) {
		
    if(empty($towns)) {
        return false;
    }

    if(!is_array($towns)) {
        $towns = array($towns);
    }

    $args = [
        'post_type'      => 'lieu',
        'post_status'    => 'publish',
        'orderby' => 'title',
        'order' => 'ASC',
        'posts_per_page' => -1,
        'meta_query' =>  [
            'relation' => 'OR',
            array_map(function($town) {
                return array(
                    'key' => 'town',
                    'value' => '"'.$town.'"',
                    'compare' => 'LIKE',
                );
            }, $towns),
        ],
    ];

    $posts = new \WP_Query($args);
    $posts = $posts->get_posts();
    wp_reset_postdata();
    return $posts;
}


}