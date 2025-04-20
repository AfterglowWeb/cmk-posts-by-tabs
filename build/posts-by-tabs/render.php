<?php 

$title = isset($attributes['title']) ? $attributes['title'] : '';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : '';
$tabs = isset($attributes['tabs']) ? $attributes['tabs'] : [];
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$background = isset($attributes['background']) ? $attributes['background'] : [];

$serialized_data = wp_json_encode($attributes);
?>
<script>
	var complexTabsData = <?php echo $serialized_data; ?>;			
</script>
<div <?php echo get_block_wrapper_attributes(['class' => 'posts-by-tabs-block bg-primary-light']); ?> id="block-<?php echo esc_attr($block_id); ?>" data-uuid="<?php echo esc_attr($block_id); ?>">
    
    <?php if (empty($tabs)) : ?>
        <div class="posts-by-tabs-empty">
            <?php esc_html_e('No tabs available.', 'posts-by-tabs'); ?>
        </div>
    <?php else : ?>
        <div class="container mx-auto xl:max-w-screen-xl">

            <!-- Background Image -->
            <?php if ( !empty($background) ) : ?>
                <?php if ( isset($background["mediaType"]) && isset($background["mediaUrl"] ) ) : ?>
                        <?php if ('video' === $background["mediaType"]) : ?>
                        <div class="posts-by-tabs-background">
                            <video autoplay muted loop playsinline title="<?php esc_attr_e($background["mediaAlt"]); ?>" >
                                <source src="<?php echo esc_url($background["mediaUrl"]); ?>"  type="video/mp4" />
                            </video>
                        </div>
                    <?php endif; ?>
                    <?php if ('image' === $background["mediaType"]) : ?>
                        <div class="posts-by-tabs-background">
                            <img src="<?php echo esc_url($background["mediaUrl"]); ?>" alt="<?php esc_attr_e($background["mediaAlt"]); ?>" />
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            <?php endif; ?>
               
            <!-- Block Title -->
            <?php if (!empty($title)) : ?>
                <h2 class=" text-secondary font-bold text-3xl lg:text-[40px] lg:leading-[50px] mb-0">
                    <?php esc_html_e($title); ?>
                </h2>
            <?php endif; ?>
            <?php if (!empty($subtitle)) : ?>
				<p class="font-bold text-xl text-[30px] mb-0">
                    <strong><?php esc_html_e($subtitle); ?></strong>
				</p>
            <?php endif; ?>
            

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
                $media_url = isset($tab['mediaUrl']) ? esc_url($tab['mediaUrl']) : '';
                $starts = isset($tab['starts']) ? $tab['starts'] : [];
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
                            
                            <?php if (!empty($starts)) : ?>
                            <div>
                                <h3 class="py-4">
                                    <span class="block text-lg font-bold"><?php esc_html_e('Départs', 'posts-by-tabs'); ?></span>
                                </h3>
                                <div class="flex gap-2 font-regular text-sm">
                                    <?php if (!empty($starts['white'])) : ?>
                                    <span class="block w-10 p-1 text-center rounded-lg border-2 border-solid border-slate-200 bg-white">
                                        <?php echo intval($starts['white']); ?>
                                    </span>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($starts['yellow'])) : ?>
                                    <span class="block w-10 p-1 text-center rounded-lg border-2 border-solid border-slate-200 bg-yellow-400">
                                        <?php echo intval($starts['yellow']); ?>
                                    </span>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($starts['blue'])) : ?>
                                    <span class="block w-10 p-1 text-center rounded-lg border-2 border-solid border-slate-200 bg-blue-400">
                                        <?php echo intval($starts['blue']); ?>
                                    </span>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($starts['red'])) : ?>
                                    <span class="block w-10 p-1 text-center rounded-lg border-2 border-solid border-slate-200 bg-red-400">
                                        <?php echo intval($starts['red']); ?>
                                    </span>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($starts['orange'])) : ?>
                                    <span class="block w-10 p-1 text-center rounded-lg border-2 border-solid border-slate-200 bg-orange-400">
                                        <?php echo intval($starts['orange']); ?>
                                    </span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($media_url) : ?>
                        <div class="w-full md:w-1/2 p-2">
                            <div class="aspect-video">
                                <div class="relative cursor-pointer tab-image-modal" data-image="<?php echo esc_url($media_url); ?>" data-title="<?php echo esc_attr($title); ?>">
                                    <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($title); ?>" class="aspect-video object-cover" />
                                    <button class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
                                        <?php esc_html_e('Détail', 'posts-by-tabs'); ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>