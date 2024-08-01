<?php
/**
 * Plugin Name: Billboard Map Platform
 * Plugin URI: https://your-website.com/billboard-map-platform
 * Description: Interactive billboard inventory map platform with Google Maps integration
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://your-website.com
 * License: GPL v2 or later
 * Text Domain: billboard-map
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('BILLBOARD_MAP_VERSION', '1.0.0');
define('BILLBOARD_MAP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('BILLBOARD_MAP_PLUGIN_PATH', plugin_dir_path(__FILE__));

class BillboardMapPlatform {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('billboard_map', array($this, 'billboard_map_shortcode'));
        add_action('wp_ajax_get_billboards', array($this, 'ajax_get_billboards'));
        add_action('wp_ajax_nopriv_get_billboards', array($this, 'ajax_get_billboards'));
        
        // Admin hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
    }
    
    public function init() {
        // Load text domain for translations
        load_plugin_textdomain('billboard-map', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_scripts() {
        // Only load on pages with the shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'billboard_map')) {
            
            // Google Maps API
            $google_maps_api_key = get_option('billboard_map_google_api_key', '');
            if (!empty($google_maps_api_key)) {
                wp_enqueue_script(
                    'google-maps-api',
                    "https://maps.googleapis.com/maps/api/js?key={$google_maps_api_key}&libraries=places,geometry",
                    array(),
                    null,
                    true
                );
            }
            
            // Plugin CSS
            wp_enqueue_style(
                'billboard-map-style',
                BILLBOARD_MAP_PLUGIN_URL . 'assets/css/billboard-map.css',
                array(),
                BILLBOARD_MAP_VERSION
            );
            
            // Plugin JavaScript
            wp_enqueue_script(
                'billboard-map-script',
                BILLBOARD_MAP_PLUGIN_URL . 'assets/js/billboard-map.js',
                array('jquery', 'google-maps-api'),
                BILLBOARD_MAP_VERSION,
                true
            );
            
            // Localize script with AJAX URL and nonce
            wp_localize_script('billboard-map-script', 'billboardMapAjax', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('billboard_map_nonce'),
                'apiKey' => $google_maps_api_key
            ));
        }
    }
    
    public function billboard_map_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600px',
            'zoom' => '4',
            'center_lat' => '39.8283',
            'center_lng' => '-98.5795',
            'show_filters' => 'true',
            'show_search' => 'true'
        ), $atts, 'billboard_map');
        
        ob_start();
        ?>
        <div id="billboard-map-container" 
             data-height="<?php echo esc_attr($atts['height']); ?>"
             data-zoom="<?php echo esc_attr($atts['zoom']); ?>"
             data-center-lat="<?php echo esc_attr($atts['center_lat']); ?>"
             data-center-lng="<?php echo esc_attr($atts['center_lng']); ?>"
             data-show-filters="<?php echo esc_attr($atts['show_filters']); ?>"
             data-show-search="<?php echo esc_attr($atts['show_search']); ?>">
            
            <?php if ($atts['show_filters'] === 'true'): ?>
            <div id="billboard-filters" class="billboard-filters">
                <div class="filter-group">
                    <label for="type-filter"><?php _e('Type:', 'billboard-map'); ?></label>
                    <select id="type-filter" name="type">
                        <option value=""><?php _e('All Types', 'billboard-map'); ?></option>
                        <option value="static"><?php _e('Static', 'billboard-map'); ?></option>
                        <option value="digital"><?php _e('Digital', 'billboard-map'); ?></option>
                        <option value="poster"><?php _e('Poster', 'billboard-map'); ?></option>
                        <option value="wallscape"><?php _e('Wallscape', 'billboard-map'); ?></option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="availability-filter"><?php _e('Availability:', 'billboard-map'); ?></label>
                    <select id="availability-filter" name="availability">
                        <option value=""><?php _e('All', 'billboard-map'); ?></option>
                        <option value="available"><?php _e('Available', 'billboard-map'); ?></option>
                        <option value="coming_soon"><?php _e('Coming Soon', 'billboard-map'); ?></option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="city-filter"><?php _e('City:', 'billboard-map'); ?></label>
                    <input type="text" id="city-filter" name="city" placeholder="<?php _e('Enter city name', 'billboard-map'); ?>">
                </div>
                
                <div class="filter-group">
                    <button id="apply-filters" class="btn btn-primary"><?php _e('Apply Filters', 'billboard-map'); ?></button>
                    <button id="clear-filters" class="btn btn-secondary"><?php _e('Clear', 'billboard-map'); ?></button>
                </div>
            </div>
            <?php endif; ?>
            
            <div id="billboard-map" style="height: <?php echo esc_attr($atts['height']); ?>; width: 100%;"></div>
            
            <div id="billboard-loading" class="billboard-loading" style="display: none;">
                <div class="spinner"></div>
                <p><?php _e('Loading billboards...', 'billboard-map'); ?></p>
            </div>
        </div>
        
        <!-- Billboard Details Modal -->
        <div id="billboard-modal" class="billboard-modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title"></h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="modal-content"></div>
                </div>
                <div class="modal-footer">
                    <button id="contact-billboard" class="btn btn-primary"><?php _e('Contact About This Billboard', 'billboard-map'); ?></button>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    public function ajax_get_billboards() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'billboard_map_nonce')) {
            wp_die(__('Security check failed', 'billboard-map'));
        }
        
        // Get filter parameters
        $type = sanitize_text_field($_POST['type'] ?? '');
        $availability = sanitize_text_field($_POST['availability'] ?? '');
        $city = sanitize_text_field($_POST['city'] ?? '');
        
        // Mock data - replace with actual database queries
        $billboards = $this->get_mock_billboards();
        
        // Apply filters
        if (!empty($type)) {
            $billboards = array_filter($billboards, function($billboard) use ($type) {
                return $billboard['type'] === $type;
            });
        }
        
        if (!empty($availability)) {
            $billboards = array_filter($billboards, function($billboard) use ($availability) {
                return $billboard['availability'] === $availability;
            });
        }
        
        if (!empty($city)) {
            $billboards = array_filter($billboards, function($billboard) use ($city) {
                return stripos($billboard['city'], $city) !== false;
            });
        }
        
        wp_send_json_success(array_values($billboards));
    }
    
    private function get_mock_billboards() {
        return array(
            array(
                'id' => 1,
                'name' => 'Downtown Digital Display',
                'latitude' => 40.7589,
                'longitude' => -73.9851,
                'address' => '123 Broadway',
                'city' => 'New York',
                'state' => 'NY',
                'type' => 'digital',
                'size' => '14x48',
                'facing' => 'North',
                'illuminated' => true,
                'dailyTraffic' => 85000,
                'monthlyRate' => 8500,
                'availability' => 'available',
                'description' => 'Prime location in Times Square area with high visibility and foot traffic.',
                'image' => 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Digital+Billboard'
            ),
            array(
                'id' => 2,
                'name' => 'Highway 101 Static',
                'latitude' => 37.7749,
                'longitude' => -122.4194,
                'address' => '456 Highway 101',
                'city' => 'San Francisco',
                'state' => 'CA',
                'type' => 'static',
                'size' => '14x48',
                'facing' => 'South',
                'illuminated' => true,
                'dailyTraffic' => 120000,
                'monthlyRate' => 6500,
                'availability' => 'available',
                'description' => 'High-traffic highway location with excellent commuter visibility.',
                'image' => 'https://via.placeholder.com/400x300/cc6600/ffffff?text=Static+Billboard'
            )
        );
    }
    
    public function add_admin_menu() {
        add_options_page(
            __('Billboard Map Settings', 'billboard-map'),
            __('Billboard Map', 'billboard-map'),
            'manage_options',
            'billboard-map-settings',
            array($this, 'admin_page')
        );
    }
    
    public function admin_init() {
        register_setting('billboard_map_settings', 'billboard_map_google_api_key');
        
        add_settings_section(
            'billboard_map_api_section',
            __('API Configuration', 'billboard-map'),
            array($this, 'api_section_callback'),
            'billboard-map-settings'
        );
        
        add_settings_field(
            'billboard_map_google_api_key',
            __('Google Maps API Key', 'billboard-map'),
            array($this, 'google_api_key_callback'),
            'billboard-map-settings',
            'billboard_map_api_section'
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Billboard Map Settings', 'billboard-map'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('billboard_map_settings');
                do_settings_sections('billboard-map-settings');
                submit_button();
                ?>
            </form>
            
            <div class="billboard-map-usage">
                <h2><?php _e('Usage', 'billboard-map'); ?></h2>
                <p><?php _e('Use the following shortcode to display the billboard map:', 'billboard-map'); ?></p>
                <code>[billboard_map]</code>
                
                <h3><?php _e('Shortcode Parameters', 'billboard-map'); ?></h3>
                <ul>
                    <li><strong>height</strong>: Map height (default: 600px)</li>
                    <li><strong>zoom</strong>: Initial zoom level (default: 4)</li>
                    <li><strong>center_lat</strong>: Center latitude (default: 39.8283)</li>
                    <li><strong>center_lng</strong>: Center longitude (default: -98.5795)</li>
                    <li><strong>show_filters</strong>: Show filter panel (default: true)</li>
                    <li><strong>show_search</strong>: Show search functionality (default: true)</li>
                </ul>
                
                <h3><?php _e('Example', 'billboard-map'); ?></h3>
                <code>[billboard_map height="500px" zoom="6" center_lat="40.7128" center_lng="-74.0060"]</code>
            </div>
        </div>
        <?php
    }
    
    public function api_section_callback() {
        echo '<p>' . __('Configure your API keys and settings below.', 'billboard-map') . '</p>';
    }
    
    public function google_api_key_callback() {
        $api_key = get_option('billboard_map_google_api_key', '');
        echo '<input type="text" id="billboard_map_google_api_key" name="billboard_map_google_api_key" value="' . esc_attr($api_key) . '" class="regular-text" />';
        echo '<p class="description">' . __('Enter your Google Maps API key. Get one at: https://developers.google.com/maps/documentation/javascript/get-api-key', 'billboard-map') . '</p>';
    }
}

// Initialize the plugin
new BillboardMapPlatform();

// Activation hook
register_activation_hook(__FILE__, 'billboard_map_activate');
function billboard_map_activate() {
    // Create database tables if needed
    // Set default options
    add_option('billboard_map_google_api_key', '');
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'billboard_map_deactivate');
function billboard_map_deactivate() {
    // Clean up if needed
}
?>
