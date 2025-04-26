<?php namespace Cmk\PostsByTabs;

defined( 'ABSPATH' ) || exit;

class OptionPage {

    protected static $instance = null;
    protected $option_name = 'posts_by_tabs_options';
    protected $page_slug = 'posts-by-tabs-settings';

    public static function get_instance() {
        if ( null === static::$instance ) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_options_page' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
        add_filter( 'plugin_action_links_posts-by-tabs/posts-by-tabs.php', array( $this, 'add_settings_link' ) );
    }

    /**
     * Add options page to the admin menu
     */
    public function add_options_page() {
        add_options_page(
            __( 'Posts by Tabs Settings', 'posts-by-tabs' ),
            __( 'Posts by Tabs', 'posts-by-tabs' ),
            'manage_options',
            $this->page_slug,
            array( $this, 'render_options_page' )
        );
    }

    /**
     * Register plugin settings
     */
    public function register_settings() {
        register_setting(
            $this->option_name,
            $this->option_name,
            array( $this, 'validate_options' )
        );

        add_settings_section(
            'date_format_section',
            __( 'Date Format', 'posts-by-tabs' ),
            array( $this, 'date_format_section_callback' ),
            $this->page_slug
        );

        add_settings_field(
            'date_format',
            __( 'Date Format', 'posts-by-tabs' ),
            array( $this, 'date_format_callback' ),
            $this->page_slug,
            'date_format_section'
        );

        // Google Maps Section
        add_settings_section(
            'google_maps_section',
            __( 'Google Maps Settings', 'posts-by-tabs' ),
            array( $this, 'google_maps_section_callback' ),
            $this->page_slug
        );

        add_settings_field(
            'google_maps_api_key',
            __( 'API Key', 'posts-by-tabs' ),
            array( $this, 'google_maps_api_key_callback' ),
            $this->page_slug,
            'google_maps_section'
        );

        add_settings_field(
            'google_maps_default_lat',
            __( 'Default Latitude', 'posts-by-tabs' ),
            array( $this, 'google_maps_default_lat_callback' ),
            $this->page_slug,
            'google_maps_section'
        );

        add_settings_field(
            'google_maps_default_lng',
            __( 'Default Longitude', 'posts-by-tabs' ),
            array( $this, 'google_maps_default_lng_callback' ),
            $this->page_slug,
            'google_maps_section'
        );

        // Additional Options Section
        add_settings_section(
            'additional_options_section',
            __( 'Additional Options', 'posts-by-tabs' ),
            array( $this, 'additional_options_section_callback' ),
            $this->page_slug
        );

        add_settings_field(
            'posts_per_page',
            __( 'Default Posts Per Page', 'posts-by-tabs' ),
            array( $this, 'posts_per_page_callback' ),
            $this->page_slug,
            'additional_options_section'
        );

        add_settings_field(
            'default_template',
            __( 'Default Template', 'posts-by-tabs' ),
            array( $this, 'default_template_callback' ),
            $this->page_slug,
            'additional_options_section'
        );

        add_settings_field(
            'place_post_type',
            __( 'Place Post Type', 'posts-by-tabs' ),
            array( $this, 'place_post_type_callback' ),
            $this->page_slug,
            'additional_options_section'
        );
        add_settings_field(
            'place_foreign_key',
            __( 'Place Foreign Key', 'posts-by-tabs' ),
            array( $this, 'place_foreign_key_callback' ),
            $this->page_slug,
            'additional_options_section'
        );
        add_settings_field(
            'event_post_type',
            __( 'Event Post Type', 'posts-by-tabs' ),
            array( $this, 'event_post_type_callback' ),
            $this->page_slug,
            'additional_options_section'
        );
        add_settings_field(
            'event_foreign_key',
            __( 'Event Foreign Key', 'posts-by-tabs' ),
            array( $this, 'event_foreign_key_callback' ),
            $this->page_slug,
            'additional_options_section'
        );
        add_settings_field(
            'cache_duration',
            __( 'Cache Duration (seconds)', 'posts-by-tabs' ),
            array( $this, 'cache_duration_callback' ),
            $this->page_slug,
            'additional_options_section'
        );
    }

    /**
     * Validate options before saving
     */
    public function validate_options( $input ) {
        $output = $this->get_default_options();

        if ( isset( $input['date_format'] ) ) {
            if ( $input['date_format'] === 'custom' && isset( $input['custom_date_format'] ) ) {
                $output['date_format'] = sanitize_text_field( $input['custom_date_format'] );
            } else {
                $output['date_format'] = sanitize_text_field( $input['date_format'] );
            }
        }

        if ( isset( $input['google_maps_api_key'] ) ) {
            $output['google_maps_api_key'] = sanitize_text_field( $input['google_maps_api_key'] );
        }

        if ( isset( $input['google_maps_default_lat'] ) ) {
            $output['google_maps_default_lat'] = floatval( $input['google_maps_default_lat'] );
        }

        if ( isset( $input['google_maps_default_lng'] ) ) {
            $output['google_maps_default_lng'] = floatval( $input['google_maps_default_lng'] );
        }

        if ( isset( $input['posts_per_page'] ) ) {
            $output['posts_per_page'] = intval( $input['posts_per_page'] );
        }

        if ( isset( $input['default_template'] ) ) {
            $output['default_template'] = sanitize_text_field( $input['default_template'] );
        }

        if ( isset( $input['place_post_type'] ) ) {
            $output['place_post_type'] = sanitize_text_field( $input['place_post_type'] );
        }
        if ( isset( $input['place_foreign_key'] ) ) {
            $output['place_foreign_key'] = sanitize_text_field( $input['place_foreign_key'] );
        }
        if ( isset( $input['event_post_type'] ) ) {
            $output['event_post_type'] = sanitize_text_field( $input['event_post_type'] );
        }
        if ( isset( $input['event_foreign_key'] ) ) {
            $output['event_foreign_key'] = sanitize_text_field( $input['event_foreign_key'] );
        }

        if ( isset( $input['cache_duration'] ) ) {
            $output['cache_duration'] = intval( $input['cache_duration'] );
        }

        return $output;
    }

    /**
     * Get plugin options with defaults
     */
    public function get_options() {
        $options = get_option( $this->option_name );
        
        if ( !$options ) {
            $options = $this->get_default_options();
            update_option( $this->option_name, $options );
        }
        
        return $options;
    }

    /**
     * Get default options
     */
    public function get_default_options() {
        return array(
            'date_format'             => get_option( 'date_format' ),
            'google_maps_api_key'     => '',
            'google_maps_default_lat' => 48.8566, // Paris
            'google_maps_default_lng' => 2.3522,  // Paris
            'posts_per_page'          => get_option( 'posts_per_page', 10 ),
            'default_template'        => 'grid',
            'cache_duration'          => 3600, // 1 hour
            'place_post_type'         => 'post',
            'place_foreign_key'       => 'place_ids',
            'event_post_type'         => 'post',
            'event_foreign_key'       => 'event_ids',
        );
    }

    /**
     * Render the options page
     */
    public function render_options_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields( $this->option_name );
                do_settings_sections( $this->page_slug );
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Date Format Section callback
     */
    public function date_format_section_callback() {
        echo '<p>' . esc_html__( 'Choose the date format to be used throughout the plugin.', 'posts-by-tabs' ) . '</p>';
    }

    /**
     * Date Format callback
     */
    public function date_format_callback() {
        $options = $this->get_options();
        $wp_date_format = get_option( 'date_format' );
        $custom_format = false;
        
        if ( !in_array( $options['date_format'], array( 'F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y' ) ) ) {
            if ( $options['date_format'] !== $wp_date_format ) {
                $custom_format = true;
            }
        }
        
        ?>
        <fieldset>
            <legend class="screen-reader-text"><?php esc_html_e( 'Date Format', 'posts-by-tabs' ); ?></legend>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="<?php echo esc_attr( $wp_date_format ); ?>" <?php checked( $options['date_format'], $wp_date_format ); ?> />
                <?php echo esc_html( date_i18n( $wp_date_format ) ); ?> <span class="description"><?php esc_html_e( '(WordPress default)', 'posts-by-tabs' ); ?></span>
            </label><br>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="F j, Y" <?php checked( $options['date_format'], 'F j, Y' ); ?> />
                <?php echo esc_html( date_i18n( 'F j, Y' ) ); ?> <span class="description"><?php esc_html_e( '(e.g. April 24, 2025)', 'posts-by-tabs' ); ?></span>
            </label><br>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="Y-m-d" <?php checked( $options['date_format'], 'Y-m-d' ); ?> />
                <?php echo esc_html( date_i18n( 'Y-m-d' ) ); ?> <span class="description"><?php esc_html_e( '(e.g. 2025-04-24)', 'posts-by-tabs' ); ?></span>
            </label><br>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="m/d/Y" <?php checked( $options['date_format'], 'm/d/Y' ); ?> />
                <?php echo esc_html( date_i18n( 'm/d/Y' ) ); ?> <span class="description"><?php esc_html_e( '(e.g. 04/24/2025)', 'posts-by-tabs' ); ?></span>
            </label><br>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="d/m/Y" <?php checked( $options['date_format'], 'd/m/Y' ); ?> />
                <?php echo esc_html( date_i18n( 'd/m/Y' ) ); ?> <span class="description"><?php esc_html_e( '(e.g. 24/04/2025)', 'posts-by-tabs' ); ?></span>
            </label><br>
            
            <label>
                <input type="radio" name="<?php echo $this->option_name; ?>[date_format]" value="custom" <?php checked( $custom_format, true ); ?> />
                <input type="text" name="<?php echo $this->option_name; ?>[custom_date_format]" value="<?php echo esc_attr( $options['date_format'] ); ?>" class="regular-text" />
                <p class="description"><?php esc_html_e( 'Custom format (e.g. Y-m-d)', 'posts-by-tabs' ); ?></p>
            </label>
        </fieldset>
        <?php
    }

    /**
     * Google Maps Section callback
     */
    public function google_maps_section_callback() {
        echo '<p>' . esc_html__( 'Configure Google Maps integration for map view.', 'posts-by-tabs' ) . '</p>';
    }

    /**
     * Google Maps API Key callback
     */
    public function google_maps_api_key_callback() {
        $options = $this->get_options();
        ?>
        <input type="text" name="<?php echo $this->option_name; ?>[google_maps_api_key]" value="<?php echo esc_attr( $options['google_maps_api_key'] ); ?>" class="regular-text" />
        <p class="description">
            <?php 
            echo sprintf(
                __( 'Get your API key from the <a href="%s" target="_blank">Google Cloud Console</a>.', 'posts-by-tabs' ),
                'https://console.cloud.google.com/google/maps-apis/overview'
            ); 
            ?>
        </p>
        <?php
    }

    /**
     * Google Maps Default Latitude callback
     */
    public function google_maps_default_lat_callback() {
        $options = $this->get_options();
        ?>
        <input type="number" step="any" name="<?php echo $this->option_name; ?>[google_maps_default_lat]" value="<?php echo esc_attr( $options['google_maps_default_lat'] ); ?>" class="regular-text" />
        <p class="description"><?php esc_html_e( 'Default map center latitude (decimal format).', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Google Maps Default Longitude callback
     */
    public function google_maps_default_lng_callback() {
        $options = $this->get_options();
        ?>
        <input type="number" step="any" name="<?php echo $this->option_name; ?>[google_maps_default_lng]" value="<?php echo esc_attr( $options['google_maps_default_lng'] ); ?>" class="regular-text" />
        <p class="description"><?php esc_html_e( 'Default map center longitude (decimal format).', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Additional Options Section callback
     */
    public function additional_options_section_callback() {
        echo '<p>' . esc_html__( 'Additional configuration options for the Posts by Tabs plugin.', 'posts-by-tabs' ) . '</p>';
    }

    /**
     * Posts Per Page callback
     */
    public function posts_per_page_callback() {
        $options = $this->get_options();
        ?>
        <input type="number" min="1" max="100" name="<?php echo $this->option_name; ?>[posts_per_page]" value="<?php echo esc_attr( $options['posts_per_page'] ); ?>" class="small-text" />
        <p class="description"><?php esc_html_e( 'Default number of posts to display per page.', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Default Template callback
     */
    public function default_template_callback() {
        $options = $this->get_options();
        $templates = array(
            'grid' => __( 'Grid', 'posts-by-tabs' ),
            'calendar' => __( 'Calendar', 'posts-by-tabs' ),
            'map' => __( 'Map', 'posts-by-tabs' ),
        );
        ?>
        <select name="<?php echo $this->option_name; ?>[default_template]">
            <?php foreach ( $templates as $value => $label ) : ?>
                <option value="<?php echo esc_attr( $value ); ?>" <?php selected( $options['default_template'], $value ); ?>>
                    <?php echo esc_html( $label ); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <p class="description"><?php esc_html_e( 'Default template for displaying posts.', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Place Post Type callback
     */
    public function place_post_type_callback() {
        $options = $this->get_options();
        $post_types = $this->get_public_post_types();
        ?>
        <select name="<?php echo $this->option_name; ?>[place_post_type]">
            <?php foreach ($post_types as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($options['place_post_type'], $value); ?>>
                    <?php echo esc_html($label); ?> (<?php echo esc_html($value); ?>)
                </option>
            <?php endforeach; ?>
        </select>
        <p class="description"><?php esc_html_e('Post type for places.', 'posts-by-tabs'); ?></p>
        <?php
    }

    /**
     * Place Foreign Key callback
     */
    public function place_foreign_key_callback() {
        $options = $this->get_options();
        ?>
        <input type="text" name="<?php echo $this->option_name; ?>[place_foreign_key]" value="<?php echo esc_attr( $options['place_foreign_key'] ); ?>" class="regular-text" />
        <p class="description"><?php esc_html_e( 'Foreign key for places.', 'posts-by-tabs' ); ?></p>
        <?php
    }
    
    /**
     * Event Post Type callback
     */
    public function event_post_type_callback() {
        $options = $this->get_options();
        $post_types = $this->get_public_post_types();
        ?>
        <select name="<?php echo $this->option_name; ?>[event_post_type]">
            <?php foreach ($post_types as $value => $label) : ?>
                <option value="<?php echo esc_attr($value); ?>" <?php selected($options['event_post_type'], $value); ?>>
                    <?php echo esc_html($label); ?> (<?php echo esc_html($value); ?>)
                </option>
            <?php endforeach; ?>
        </select>
        <p class="description"><?php esc_html_e('Post type for events.', 'posts-by-tabs'); ?></p>
        <?php
    }
    
    /**
     * Event Foreign Key callback
     */
    public function event_foreign_key_callback() {
        $options = $this->get_options();
        ?>
        <input type="text" name="<?php echo $this->option_name; ?>[event_foreign_key]" value="<?php echo esc_attr( $options['event_foreign_key'] ); ?>" class="regular-text" />
        <p class="description"><?php esc_html_e( 'Foreign key for events.', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Cache Duration callback
     */
    public function cache_duration_callback() {
        $options = $this->get_options();
        ?>
        <input type="number" min="0" name="<?php echo $this->option_name; ?>[cache_duration]" value="<?php echo esc_attr( $options['cache_duration'] ); ?>" class="small-text" />
        <p class="description"><?php esc_html_e( 'Cache duration in seconds (0 to disable caching).', 'posts-by-tabs' ); ?></p>
        <?php
    }

    /**
     * Add settings link to plugin page
     */
    public function add_settings_link( $links ) {
        $settings_link = sprintf(
            '<a href="%s">%s</a>',
            admin_url( 'options-general.php?page=' . $this->page_slug ),
            __( 'Settings', 'posts-by-tabs' )
        );
        array_unshift( $links, $settings_link );
        return $links;
    }

    /**
     * Get a specific option
     */
    public function get_option( $key, $default = '' ) {
        $options = $this->get_options();
        return isset( $options[$key] ) ? $options[$key] : $default;
    }

    /**
     * Helper function to get all public post types
     */
    private function get_public_post_types() {
        $post_types = get_post_types(array(
            'public' => true,
        ), 'objects');
        
        $post_types_array = array();
        foreach ($post_types as $post_type) {
            $post_types_array[$post_type->name] = $post_type->labels->singular_name;
        }
        
        return $post_types_array;
    }
}