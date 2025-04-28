<?php namespace Cmk\PostsByTabs;

defined('ABSPATH') || exit;

class PrepareAcfPostsRelations
{
    protected static $instance = null;
    public static $endpoint = 'posts-by-tabs/v1';

    public static function get_instance()
    {
        if (null === static::$instance ) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    private function __construct()
    {
        
        add_filter(
            'cmk_posts_by_tabs_acf_posts_relations', function ($fields, $post, $request) {

                $relational_field_keys = [
                'bidirection-places-events','lieu'
                ];
        
                foreach($relational_field_keys as $key) {
                    if (isset($fields[$key])) {
                        if(!is_array($fields[$key])) {
                            $fields[$key] = array($fields[$key]);
                        }

                        $fields[$key] = array_map(
                            function ($post_id) use ($request) {
                                if(!is_numeric($post_id)) {
                                    return is_array($post_id) ? $post_id : null;
                                }
                                $sub_post = get_post($post_id);
                                if(is_a($sub_post, 'WP_Post')) {
                                    $post_controller = new \WP_REST_Posts_Controller($sub_post->post_type);
                                    $prepared = $post_controller->prepare_item_for_response($sub_post, $request);
                                    $post_prepared = $post_controller->prepare_response_for_collection($prepared);
                                    $post_prepared['terms'] = self::get_post_terms($post_id);
                                    $post_prepared['featured_media'] = get_the_post_thumbnail_url($post_id, 'full');
                                    $post_prepared['acf'] = get_fields($post_id);

                                    return $post_prepared;
                                }
                            }, $fields[$key]
                        );

                        $fields[$key] = array_filter(
                            $fields[$key], function ($item) {
                                return !is_null($item);
                            }
                        );
                    
                    }
                } 
           
                return $fields;
            }, 10, 3
        );

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

}
