<?php namespace cmk\postsByTabs;

class restExtend {

    protected static $instance = null;
    public static $endpoint = 'posts-by-tabs/v1';

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

            $post_types = join('|', self::public_post_types());
            register_rest_route(self::$endpoint, "/meta/(?P<post_type>$post_types)", [
                'methods' => 'GET',
                'callback' => ['\cmk\postsByTabs\restExtend', 'get_metafields_rest'],
                'permission_callback' => '__return_true',//'\cmk\postsByTabs\restExtend::validate_token',
                'args' => [
                    'post_type' => [
                        'default' => 'evenement',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'keys_only' => [
                        'default' => false,
                        'sanitize_callback' => 'rest_sanitize_boolean',
                    ]
                ],
            ]);
        
            register_rest_route(self::$endpoint, '/posts', [
                'methods' => 'POST',
                'callback' => ['\cmk\postsByTabs\restExtend', 'get_posts_rest'],
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
                    'terms' => [
                        'default' => [],
                        'sanitize_callback' => function($param) {
                            foreach ($param as $taxonomy => $term_ids) {
                                $param[$taxonomy] = array_map('absint', $term_ids);
                            }
                            return $param;
                        }
                    ],
                    'meta_query' => [
                        'default' => [],
                        'sanitize_callback' => '\cmk\postsByTabs\restExtend::sanitize_meta_fields',
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
                    ]
                ],
            ]);

        });

    }

    public static function validate_token( \WP_REST_Request $request ): bool {
		return wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ? true : false;
	}

    public static function get_posts_rest(\WP_REST_Request $request): \WP_REST_Response
    {

        $args = array(
            'post_status' => 'publish',
            'post_type' => $request->get_param('post_type'),
            'paged' => $request->get_param('paged'),
            'posts_per_page' => $request->get_param('per_page'),
            'order' => $request->get_param('order'),
            'orderby' => $request->get_param('orderby'),
            'meta_key' => $request->get_param('meta_key'),
        );

        $response = [
            'posts' => array(),
            'total' => 0,
            'calendarPosts' => array(),
        ];

        $terms = $request->get_param('terms');
        if(!empty($terms)) {
            $args['tax_query'] = array(
                'relation' => 'OR',
            );
            foreach ($terms as $taxonomy => $term_ids) {
                $args['tax_query'][] = [
                    'taxonomy' => $taxonomy,
                    'terms' => $term_ids,
                    'field' => 'term_id',
                    'include_children' => false,
                ];
            }
        }

        $meta_query = $request->get_param('meta_query');
        if (!empty($meta_query) && 
            is_array($meta_query) && 
            !empty($meta_query['fields'])) {
                
            $args['meta_query'] = [
                'relation' => $meta_query['relation'],
                $meta_query['fields'],
            ];

        }
        
        $query = new \WP_Query($args);
        $posts = $query->get_posts();
        
        wp_reset_postdata();

        $posts_prepared = array();
        if (empty($posts)) {
            return new \WP_REST_Response( $response, 200 );
        }
        
        $post_controller = new \WP_REST_Posts_Controller($args['post_type']);
        foreach ($posts as $post) {
            $prepared = $post_controller->prepare_item_for_response( $post, $request );
            $post_prepared = $post_controller->prepare_response_for_collection( $prepared );
            $post_prepared['featured_media'] = get_the_post_thumbnail_url($post->ID, 'full');
            $post_prepared['acf'] = apply_filters( 'rest_prepare_acf_fields', get_fields($post->ID), $post, $request);
            $posts_prepared[] = $post_prepared;
        }

        apply_filters( 'cmk_posts_by_tabs_posts_prepared', $posts_prepared, $args );

        $response['posts'] = $posts_prepared;
        $response['total_posts'] = $query->found_posts;

        return new \WP_REST_Response( $response, 200 );

    }

    public static function get_metafields_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $post_type = $request->get_param('post_type');
        $keys_only = $request->get_param('keys_only');
        $meta_fields = array();
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
                $meta_fields[$key][] = get_post_meta( $post->ID, $key, true );
            }
        }

        $meta_fields = array_map( function( $values ) {
            return array_values(array_unique( array_filter( $values ) ));
        }, $meta_fields );

        if ($keys_only) {
            $keys_array = [];
            foreach ($meta_fields as $key => $values) {
                $keys_array[$key] = [];
            }
            return new \WP_REST_Response($keys_array);
        }

        return new \WP_REST_Response( $meta_fields, 200 );
    }

    public static function get_places_rest(\WP_REST_Request $request): \WP_REST_Response
    {
        $params = [
            'towns' => $request->get_param('towns'),
        ];
        
        $towns = self::places($params);
        return new \WP_REST_Response( $towns, 200 );

    }

    private static function places($towns = []) : array
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

    public static function sanitize_meta_fields($param): array
    {
        if (is_string($param) && !empty($param)) {
            $param = json_decode($param, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return [];
            }
        }

        if (!is_array($param)) {
            return [];
        }
        
        $sanitized = [];
        
        $sanitized['relation'] = isset($param['relation']) && 
            in_array($param['relation'], ['AND', 'OR']) ? 
            $param['relation'] : 'AND';
        
        $sanitized['fields'] = array();
        if (isset($param['fields']) && is_array($param['fields'])) {
            
            foreach ($param['fields'] as $field) {
                
                if (!is_array($field)) {
                    continue;
                } 

                $value = '';
                $type = isset($field['type']) ? $field['type'] : 'CHAR';

                switch($type) {
                    case 'CHAR':
                        $value = isset($field['value']) ? sanitize_text_field($field['value']) : '';
                        break;
                    case 'NUMERIC':
                        $value = isset($field['value']) ? absint($field['value']) : '';
                        break;
                    case 'DATE':
                        $value = isset($field['value']) ? sanitize_text_field($field['value']) : '';
                        break;
                    case 'BOOLEAN':
                        $value = isset($field['value']) ? (bool) $field['value'] : false;
                        break;
                    default:
                        $value = isset($field['value']) ? sanitize_text_field($field['value']) : '';
                        break;
                }
              
                
                $sanitized_field = [
                    'key' => isset($field['key']) ? sanitize_key($field['key']) : '',
                    'value' => $value,
                    'compare' => isset($field['compare']) ? html_entity_decode(sanitize_text_field($field['compare'])) : '=',
                    'type' => $type,
                ];
                
                $sanitized['fields'][] = $sanitized_field;
            }
        }
        
        return $sanitized;
    }

    private static function public_post_types()
    {
		$types = array_keys( get_post_types( array( 'public' => true ) ) );
		return array_diff($types, ['attachment', 'nav_menu_item']);
	}

}