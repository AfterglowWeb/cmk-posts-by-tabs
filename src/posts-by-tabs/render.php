<?php 

$tabs = isset($attributes['tabs']) ? $attributes['tabs'] : [];
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$background = isset($attributes['background']) ? $attributes['background'] : [];
$options = \cmk\postsByTabs\optionPage::get_instance()->get_options();

$attributes = array_merge(
    $attributes, 
    array(
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'options' => array(
            'dateFormat'        => isset($options['date_format']) ? $options['date_format'] : 'F j, Y',
            'googleMapsApiKey'  => isset($options['google_maps_api_key']) ? $options['google_maps_api_key'] : '',
            'defaultLatitude'   => isset($options['google_maps_default_lat']) ? $options['google_maps_default_lat'] : '',
            'defaultLongitude'  => isset($options['google_maps_default_lng']) ? $options['google_maps_default_lng'] : '',
            'postsPerPage'      => isset($options['posts_per_page']) ? $options['posts_per_page'] : 10,
            'defaultTemplate'   => isset($options['default_template']) ? $options['default_template'] : '',
            'placePostType' => isset($options['place_post_type']) ? $options['place_post_type'] : '',
            'placeForeignKey' => isset($options['place_foreign_key']) ? $options['place_foreign_key'] : '',
            'eventPostType' => isset($options['event_post_type']) ? $options['event_post_type'] : '',
            'eventForeignKey' => isset($options['event_foreign_key']) ? $options['event_foreign_key'] : '',
            'cacheDuration'     => isset($options['cache_duration']) ? $options['cache_duration'] : 3600
        )
    )
);

?>
<div <?php echo get_block_wrapper_attributes(['class' => 'posts-by-tabs-block w-full min-w-full']); ?>>
   
<?php if (empty($tabs)) : ?>
        <div class="posts-by-tabs-empty">
            <?php esc_html_e('No tabs available.', 'posts-by-tabs'); ?>
        </div>
    <?php else : ?>
        <div class="container mx-auto xl:max-w-screen-xl">

            <!-- Tab Navigation -->
            <div class="posts-by-tabs-nav mb-3 overflow-x-auto" role="tablist">
                <?php foreach ($tabs as $index => $tab) : 
                    $is_active = $index === 0 ? 'active' : '';
                    $title = isset($tab['title']) ? esc_html($tab['title']) : '';
                    $subtitle = isset($tab['subtitle']) ? esc_html($tab['subtitle']) : '';
                    $meta_1 = isset($tab['meta_1']) ? esc_html($tab['meta_1']) : '';
                    $meta_2 = isset($tab['meta_2']) ? esc_html($tab['meta_2']) : '';
                ?>
                <button type="button" 
                    class="complex-tab-button <?php echo $is_active; ?> px-4 py-2 focus:outline-none" 
                    data-index="<?php echo $index; ?>" 
                    role="tab" 
                    aria-selected="<?php echo ($index === 0 ? 'true' : 'false'); ?>" 
                    aria-controls="panel-<?php echo esc_attr($block_id); ?>-<?php echo $index; ?>">
                    <div class="flex flex-col items-start text-left">
                        <span class="block">
                            <?php if ($title) : ?>
                                <span class="block font-bold"><?php echo $title; ?></span>
                            <?php endif; ?>
                            <?php if ($subtitle) : ?>
                                <span class="block font-regular text-secondary"><?php echo $subtitle; ?></span>
                            <?php endif; ?>
                        </span>
                        <span class="block">
                            <?php if ($meta_1) : ?>
                                <span class="block font-regular text-gray-600"><?php echo $meta_1; ?></span>
                            <?php endif; ?>
                            <?php if ($meta_2) : ?>
                                <span class="block font-regular text-gray-600"><?php echo $meta_2; ?></span>
                            <?php endif; ?>
                        </span>
                    </div>
                </button>
                <?php endforeach; ?>
            </div>

            <!-- Tab Panels -->
            <?php foreach ($tabs as $index => $tab) : 
                $is_active = $index === 0 ? '' : 'hidden';
                $title = isset($tab['title']) ? esc_html($tab['title']) : '';
                $subtitle = isset($tab['subtitle']) ? esc_html($tab['subtitle']) : '';
                $meta_1 = isset($tab['meta_1']) ? esc_html($tab['meta_1']) : '';
                $meta_2 = isset($tab['meta_2']) ? esc_html($tab['meta_2']) : '';
                $content = isset($tab['content']) ? wp_kses_post($tab['content']) : '';
            ?>
            <div id="panel-<?php echo esc_attr($block_id); ?>-<?php echo $index; ?>" 
                class="complex-tab-panel <?php echo $is_active; ?>" 
                role="tabpanel" 
                aria-labelledby="tab-<?php echo $index; ?>" 
                data-index="<?php echo $index; ?>">
                
                <div class="bg-white rounded-md shadow p-6">
                    <!-- Header -->
                    <h3 class="flex justify-between pb-4">
                        <span class="block">
                            <?php if ($title) : ?>
                                <span class="block text-xl font-bold"><?php echo $title; ?></span>
                            <?php endif; ?>
                            <?php if ($subtitle) : ?>
                                <span class="block text-2xl text-secondary font-regular"><?php echo $subtitle; ?></span>
                            <?php endif; ?>
                        </span>
                        <span class="block">
                            <?php if ($meta_1) : ?>
                                <span class="block text-xl font-regular"><?php echo $meta_1; ?></span>
                            <?php endif; ?>
                            <?php if ($meta_2) : ?>
                                <span class="block text-xl font-regular"><?php echo $meta_2; ?></span>
                            <?php endif; ?>
                        </span>
                    </h3>
                    
                    <!-- Content -->
                    <div class="flex justify-start flex-wrap border-y border-slate-50">
                        <div class="w-full md:w-1/2 p-2 flex flex-col gap-4 justify-between">
                            <div class="tab-content">
                                <?php echo $content; ?>
                            </div>

                            <div class="flex flex-col gap-2">
                                <?php if (isset($posts) && !empty($posts)) : ?>
                                    <?php foreach ($posts as $post) : 
                                        $post_id = isset($post['id']) ? $post['id'] : '';
                                        $post_title = isset($post['title']) ? esc_html($post['title']) : '';
                                        $post_url = isset($post['link']) ? esc_url($post['link']) : '';
                                        $post_date = isset($post['date']) ? esc_html($post['date']) : '';
                                        $post_excerpt = isset($post['excerpt']) ? wp_kses_post($post['excerpt']) : '';
                                        $media_url = isset($post['featured_media']) ? esc_url($post['featured_media']) : '';
                                        $post_terms = isset($post['terms']) ? $post['terms'] : [];
                                    ?>
                                    <article class="flex items">
                                        
                                        <div class="flex-shrink-0">
                                            <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($post_title); ?>" class="w-16 h-16 object-cover rounded-md" />
                                        </div>
                                        <div class="ml-4">
                                            <h4 class="text-lg font-bold">
                                                <a href="<?php echo esc_url($post_url); ?>" target="_blank" rel="noopener noreferrer"><?php echo $post_title; ?></a>
                                            </h4>
                                            <p class="text-sm text-gray-600"><?php echo $post_date; ?></p>
                                            <p class="text-sm text-gray-500"><?php echo $post_excerpt; ?></p>
                                        </div>
                                        <div class="flex-grow"></div>
                                        <div class="flex-shrink-0">
                                            <a href="<?php echo esc_url($post_url); ?>" target="_blank" rel="noopener noreferrer" class="text-primary font-bold">
                                                <?php esc_html_e('Read More', 'posts-by-tabs'); ?>
                                            </a>
                                        </div>
                                    </article>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                            
                        </div>
                
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    <?php
        echo '<script type="application/json" class="block-data">';
        echo wp_json_encode($attributes);
        echo '</script>';
    ?>
</div>