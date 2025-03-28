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

            register_rest_route('posts-by-tabs/v1', '/meta/(?P<posttype>evenement|event|lieu|place)', [
                'methods' => 'GET',
                'callback' => ['\cmk\postsByTabs\restExtend', 'get_metafields_rest'],
                'permission_callback' => '__return_true',//'\cmk\postsByTabs\restExtend::validate_token',
                'args' => [
                    'posttype' => [
                        'default' => 'evenement',
                        'sanitize_callback' => 'sanitize_text_field',
                    ]
                ],
            ]);
        
            register_rest_route('posts-by-tabs/v1', '/events', [
                'methods' => 'POST',
                'callback' => ['\cmk\postsByTabs\restExtend::get_events_rest'],
                'permission_callback' => '\cmk\postsByTabs\restExtend::validate_token',
                'args' => [
                    'post_type' => [
                        'default' => 'evenement',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'paged' => [
                        'default' => 1,
                        'sanitize_callback' => 'absint',
                    ],
                    'posts_per_page' => [
                        'default' => 10,
                        'sanitize_callback' => 'absint',
                    ],
                    'term' => [
                        'default' => null,
                        'sanitize_callback' => 'absint',
                    ],
                    'metaFields' => [
                        'default' => [],
                        'sanitize_callback' => function($param) {
                        if (is_string($param) && !empty($param)) {
                            $decoded = json_decode($param, true);
                            if (json_last_error() === JSON_ERROR_NONE) {
                                return self::sanitize_meta_fields($decoded);
                            }
                        }
                        
                        if (is_array($param)) {
                            return self::sanitize_meta_fields($param);
                        }
                        
                        return [
                            'relation' => 'AND',
                            'fields' => []
                        ];
                    }
                    ],
                    'order' => [
                        'default' => 'DESC',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'orderby' => [
                        'default' => 'date',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'meta_key' => [
                        'default' => 'datedebut',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],   
                ],
            ]);

        });
    }

    public static function validate_token( \WP_REST_Request $request ): bool {
		return wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ? true : false;
	}

    public static function get_events_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $params = array(
            'post_type' => $request->get_param('post_type'),
            'paged' => $request->get_param('paged'),
            'posts_per_page' => $request->get_param('posts_per_page'),
            'terms' => $request->get_param('terms'),
            'metaFields' => $request->get_param('metaFields'),
            'order' => $request->get_param('order'),
            'orderby' => $request->get_param('orderby'),
            'meta_key' => $request->get_param('meta_key'),
        );

        $events = self::events( $params);
        return new \WP_REST_Response( $events, 200 );

    }

    public static function get_metafields_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $post_type = $request->get_param('posttype');
        $fields = self::get_meta_fields($post_type);
        return new \WP_REST_Response( $fields, 200 );
    }

    public static function get_meta_fields($post_type) : array
    {
        //$meta_keys = array();
        $meta_values = array();
        $posts = get_posts( array( 
            'post_type' => $post_type, 
            'posts_per_page' => -1,
            'paged' => 1,
            'order' => 'DESC', 
            'orderby' => 'DATE', 
            'status' => 'publish' )
        );

        foreach ( $posts as $post ) {
            $post_meta_keys = get_post_custom_keys( $post->ID );

            if ( empty( $post_meta_keys ) ) {
                continue;
            }
            $post_meta_keys = array_filter( $post_meta_keys, function( $key ) {
                return strpos( $key, '_' ) !== 0;
            } );

            foreach ( $post_meta_keys as $key ) {
                $meta_values[$key][] = get_post_meta( $post->ID, $key, true );
            }
        }

        $meta_values = array_map( function( $values ) {
            return array_values(array_unique( array_filter( $values ) ));
        }, $meta_values );

        return $meta_values;
    }

    public static function events(array $params) : array
    {

        if(!empty($params['terms'])) {
            $args['tax_query'] = [
                'taxonomy' => 'type',
                'terms' => $params['terms'],
                'field' => 'term_id',
                'include_children' => false,
            ];
        }

        if (!empty($params['metaFields']) && 
            is_array($params['metaFields']) && 
            !empty($params['metaFields']['fields'])) {
            
            $meta_query = [];
            
            $meta_query['relation'] = $params['metaFields']['relation'] ?? 'AND';
            
            foreach ($params['metaFields']['fields'] as $field) {
                if (!empty($field['key'])) {
                    $meta_query[] = [
                        'key' => $field['key'],
                        'value' => $field['value'],
                        'compare' => $field['compare'],
                        'type' => $field['type']
                    ];
                }
            }
            
            if (isset($args['meta_query'])) {
                $args['meta_query'] = array_merge(
                    ['relation' => 'AND'],
                    [$args['meta_query']],
                    [$meta_query]
                );
            } else {
                $args['meta_query'] = $meta_query;
            }
        }

        $posts = new \WP_Query($args);
        $posts = $posts->get_posts();
        wp_reset_postdata();
        return $posts;
    }

    public static function get_places_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $params = [
            'towns' => $request->get_param('towns'),
        ];
        
        $towns = self::places($params);
        return new \WP_REST_Response( $towns, 200 );

    }

    public static function places($towns = []) : array
    {
            
        if(!is_array($towns)) {
            $towns = array($towns);
        }

        $args = [
            'post_type'      => 'lieu',
            'post_status'    => 'publish',
            'orderby' => 'title',
            'order' => 'ASC',
            'posts_per_page' => -1,
        ];

        if(!empty($towns)) {
            $args['meta_query'] = array(
                'relation' => 'OR',
                array_map(function($town) {
                    return array(
                        'key' => 'town',
                        'value' => '"'.$town.'"',
                        'compare' => 'LIKE',
                    );
                }, $towns),
            );
        }

        $posts = new \WP_Query($args);
        $posts = $posts->get_posts();
        wp_reset_postdata();
        return $posts;
    }

    private static function sanitize_meta_fields($fields) {
        if (!is_array($fields)) {
            return ['relation' => 'AND', 'fields' => []];
        }
        
        $sanitized = [];
        
        $sanitized['relation'] = isset($fields['relation']) && 
            in_array($fields['relation'], ['AND', 'OR']) ? 
            $fields['relation'] : 'AND';
        
        $sanitized['fields'] = [];
        if (isset($fields['fields']) && is_array($fields['fields'])) {
            foreach ($fields['fields'] as $field) {
                if (!is_array($field)) continue;
                
                $sanitized_field = [
                    'key' => isset($field['key']) ? sanitize_text_field($field['key']) : '',
                    'value' => isset($field['value']) ? sanitize_text_field($field['value']) : '',
                    'compare' => isset($field['compare']) ? sanitize_text_field($field['compare']) : '=',
                    'type' => isset($field['type']) ? sanitize_text_field($field['type']) : 'CHAR'
                ];
                
                $sanitized['fields'][] = $sanitized_field;
            }
        }
        
        return $sanitized;
    }


}

 /*elseif(!empty($params['period']) && $params['period'] !== 'all') {
            
            
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
                                'key' => 'datedebut',
                                'value' => $today,
                                'type'  => 'DATE',
                                'compare' => '<=',
                            ),
                        );
                    $args['order'] = 'ASC';
                    $args['meta_key'] = 'datedebut';
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
                    $args['orderby'] = 'datedebut';
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
        }*/

