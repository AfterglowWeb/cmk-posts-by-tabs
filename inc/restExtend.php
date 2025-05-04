<?php namespace Cmk\PostsByTabs;

defined('ABSPATH') || exit;

use Cmk\PostsByTabs\OptionPage;

class RestExtend
{

    protected static $instance = null;
    public static $endpoint    = 'posts-by-tabs/v1';

    public static function get_instance()
    {
        if (null === static::$instance ) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    private function __construct()
    {
        $this->register_rest_routes();
        

        add_action(
            'init',
            function () {
                $post_type_names = array( 'post', 'page', 'lieu', 'evenement' );    

                foreach ( $post_type_names as $post_type_name ) {
                    add_filter(
                        "rest_{$post_type_name}_collection_params",
                        function ( $query_params ) {
                            if (isset($query_params['per_page']) ) {
                                $query_params['per_page']['default'] = 1000;
                                $query_params['per_page']['maximum'] = 1000;
                            }
                            return $query_params;
                        },
                        10,
                        2
                    );
                }
            },
            20
        );
    }

    public function register_rest_routes(): void
    {
        add_action(
            'rest_api_init',
            function () {

                $post_types = join('|', self::public_post_types());
                register_rest_route(
                    self::$endpoint,
                    "/meta/(?P<post_type>$post_types)",
                    array(
                    'methods'             => 'GET',
                    'callback'            => array( '\Cmk\PostsByTabs\restExtend', 'get_metafields_rest' ),
                    'permission_callback' => '\Cmk\PostsByTabs\restExtend::validate_token',
                    'args'                => array(
                    'post_type' => array(
                                    'sanitize_callback' => 'sanitize_text_field',
                                    'required'          => true,
                    ),
                    'keys_only' => array(
                                    'sanitize_callback' => 'rest_sanitize_boolean',
                    ),
                            ),
                    )
                );

                register_rest_route(
                    self::$endpoint,
                    '/posts',
                    array(
                    'methods'             => 'POST',
                    'callback'            => array( '\Cmk\PostsByTabs\restExtend', 'get_posts_rest' ),
                    'permission_callback' => '\Cmk\PostsByTabs\restExtend::validate_token',
                    'args'                => array(
                    'post_type'      => array(
                    'sanitize_callback' => 'sanitize_text_field',
                    'required'          => true,
                    ),
                    'paged'          => array(
                                    'sanitize_callback' => 'absint',
                    ),
                    'posts_per_page' => array(
                                    'sanitize_callback' => 'absint',
                    ),
                    'terms'          => array(
                                    'default'           => array(),
                                    'sanitize_callback' => function ( $param ) {
                                        foreach ( $param as $taxonomy => $term_ids ) {
                                            $param[ $taxonomy ] = array_map('absint', $term_ids);
                                        }
                                        return $param;
                                    },
                    ),
                    'meta_query'     => array(
                                    'sanitize_callback' => '\Cmk\PostsByTabs\restExtend::sanitize_meta_fields',
                    ),
                    'order'          => array(
                                    'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'orderby'        => array(
                                    'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'meta_key'       => array(
                                    'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'search'        => array(
                                    'sanitize_callback' => 'sanitize_text_field',
                    ),
                    ),
                    )
                );

                register_rest_route(
                    self::$endpoint,
                    '/places',
                    array(
                    'methods'             => 'POST',
                    'callback'            => array( '\Cmk\PostsByTabs\restExtend', 'get_places_rest' ),
                    'permission_callback' => '\Cmk\PostsByTabs\restExtend::validate_token',
                    'args'                => array(
                    'towns' => array(
                    'sanitize_callback' => function ( $param ) {
                        return is_array($param) ? $param : array();
                    },
                    ),
                    ),
                    )
                );
            }
        );
    }

    public static function validate_token( \WP_REST_Request $request ): bool
    {
        return wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest') ? true : false;
    }

    public static function get_posts_rest( \WP_REST_Request $request ): \WP_REST_Response
    {

        $params = $request->get_params();
        
        $args = array(
        'post_status'    => 'publish',
        'post_type'      => $params['post_type'] ?? 'post',
        'paged'          => $params['paged'] ?? 1,
        'posts_per_page' => $params['posts_per_page'] ?? 10,
        'order'          => $params['order'] ?? 'DESC',
        'orderby'        => $params['orderby'] ?? 'date',
        'meta_key'       => $params['meta_key'] ?? '',
        );

        $response = array(
        'posts'         => array(),
        'total'         => 0,
        );

        if (! empty($params['search']) ) {
            $args['s'] = $params['search'];
        }

        if (! empty($params['terms']) ) {
            $args['tax_query'] = array(
            'relation' =>  isset($params['tax_query']['relation']) ? $params['tax_query']['relation'] : 'OR',
            );
            foreach ( $params['terms'] as $taxonomy => $term_ids ) {
                $args['tax_query'][] = array(
                'taxonomy'         => $taxonomy,
                'terms'            => $term_ids,
                'field'            => 'term_id',
                'include_children' => false,
                );
            }
        }

        if (true === isset($params['meta_query'])  
            && true === isset($params['meta_query']['fields']) 
        ) {

            if(false === empty($params['meta_query']['fields'])) {
                $args['meta_query'] = array(
                'relation' => isset($params['meta_query']['relation']) ? $params['meta_query']['relation'] : 'AND',
                $params['meta_query']['fields'],
                );
            }

        }

        try {

            $query = new \WP_Query($args);
            $posts = $query->get_posts();

            wp_reset_postdata();

            $posts_prepared = array();
            if (empty($posts) ) {
                return new \WP_REST_Response($response, 200);
            }

            $posts_prepared = array();
            $post_controller = new \WP_REST_Posts_Controller($args['post_type']);
            
            foreach ( $posts as $post ) {
                $prepared                        = $post_controller->prepare_item_for_response($post, $request);
                $post_prepared                   = $post_controller->prepare_response_for_collection($prepared);
                
                $post_prepared['featured_media'] = get_the_post_thumbnail_url($post->ID, 'full');
                $post_prepared['terms']          = self::get_post_terms($post->ID);
                $post_prepared['acf']            = apply_filters('cmk_posts_by_tabs_acf_posts_relations', get_fields($post->ID), $post, $request);
                
                $posts_prepared[]                = $post_prepared;
            }

            $posts_prepared = apply_filters('cmk_posts_by_tabs_posts_prepared', $posts_prepared, $args);

            $response['posts']       = $posts_prepared;
            $response['total_posts'] = $query->found_posts;
            $response['max_pages']   = $query->max_num_pages;
            $response['current_page'] = $query->get('paged');

            return new \WP_REST_Response($response, 200);

        } catch (\Exception $e) {
            error_log('Posts-by-tabs API error: ' . $e->getMessage());
            return new \WP_REST_Response(
                [
                'error' => $e->getMessage() . json_encode($args),
                'code' => 'posts_query_error'
                ], 500
            );
        }
    }

    private static function get_post_terms( $post_id ): array
    {
        $taxonomies = get_object_taxonomies(get_post_type($post_id));
        $terms      = array();

        foreach ( $taxonomies as $taxonomy ) {
            $term_list = get_the_terms($post_id, $taxonomy);
            if (is_wp_error($term_list) || empty($term_list) ) {
                continue;
            }
            foreach ( $term_list as $term ) {
                $terms[ $taxonomy ][] = array(
                'id'   => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                );
            }
        }
        return $terms;
    }

    public static function get_metafields_rest( \WP_REST_Request $request ): \WP_REST_Response
    {
        $post_type   = $request->get_param('post_type');
        $keys_only   = $request->get_param('keys_only');
        $meta_fields = array();
        $postIds       = get_posts(
            array(
            'fields'        => 'ids',
            'post_type'      => $post_type,
            'posts_per_page' => -1,
            'paged'          => 1,
            'order'          => 'DESC',
            'orderby'        => 'DATE',
            'status'         => 'publish',
            )
        );

        if (empty($postIds) ) {
            return new \WP_REST_Response('No posts found', 404);
        }

        foreach ( $postIds as $postId ) {
            $post_meta_keys = get_post_custom_keys($postId);

            if (empty($post_meta_keys) ) {
                continue;
            }
            $post_meta_keys = array_filter(
                $post_meta_keys,
                function ( $key ) {
                    return strpos($key, '_') !== 0;
                }
            );

            foreach ( $post_meta_keys as $key ) {
                $meta_fields[ $key ][] = get_post_meta($postId, $key, true);
            }
        }

        $meta_fields = array_map(
            function ( $values ) {
                return array_values(array_unique(array_filter($values)));
            },
            $meta_fields
        );

        if ($keys_only ) {
            $keys_array = array();
            foreach ( $meta_fields as $key => $values ) {
                $keys_array[ $key ] = array();
            }
            return new \WP_REST_Response($keys_array, 200);
        }

        return new \WP_REST_Response($meta_fields, 200);
    }

    public static function get_places_rest( \WP_REST_Request $request ): \WP_REST_Response
    {
        $params = array(
        'towns' => $request->get_param('towns'),
        );

        $towns = self::places($params);
        return new \WP_REST_Response($towns, 200);
    }

    private static function places( $towns = array() ): array
    {
        
        $place_post_type = OptionPage::get_instance()->get_option('place_post_type');

        $args = array(
        'post_type'      => $place_post_type  ?? 'lieu',
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
        'posts_per_page' => -1,
        );

        if (! empty($towns) ) {
            $args['meta_query'] = array(
            'relation' => 'OR',
            array_map(
                function ( $town ) {
                    return array(
                    'key'     => 'town',
                    'value'   => '"' . $town . '"',
                    'compare' => 'LIKE',
                    );
                },
                $towns
            ),
            );
        }

        $posts = new \WP_Query($args);
        $posts = $posts->get_posts();
        wp_reset_postdata();
        return $posts;
    }

    public static function sanitize_meta_fields( $param ): array
    {
        if (is_string($param) && ! empty($param) ) {
            $param = json_decode($param, true);
            if (json_last_error() !== JSON_ERROR_NONE ) {
                return array();
            }
        }

        if (! is_array($param) ) {
            return array();
        }

        $sanitized = array();

        $sanitized['relation'] = true === isset($param['relation']) &&
        true === in_array($param['relation'], array( 'AND', 'OR' )) ?
        $param['relation'] : 'AND';

        $sanitized['fields'] = array();
        if (isset($param['fields']) && is_array($param['fields']) ) {

            foreach ( $param['fields'] as $field ) {

                if (! is_array($field) ) {
                    continue;
                }

                $value = '';
                $type  = isset($field['type']) ? $field['type'] : 'CHAR';

                switch ( $type ) {
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

                $sanitized_field = array(
                'key'     => isset($field['key']) ? sanitize_key($field['key']) : '',
                'value'   => $value,
                'compare' => isset($field['compare']) ? html_entity_decode(sanitize_text_field($field['compare'])) : '=',
                'type'    => $type,
                );

                $sanitized['fields'][] = $sanitized_field;
            }
        }

        return $sanitized;
    }

    private static function public_post_types()
    {
        $types = array_keys(get_post_types(array( 'public' => true )));
        return array_diff($types, array( 'attachment', 'nav_menu_item' ));
    }
}
