<?php

/**
 * Plugin Name: KMWP Coverlays
 * Description: Provides a container block that allows you to use a background image with multiple color and gradient overlay layers, similar to CSS multiple background-image rules, while supporting InnerBlocks.
 * Author: Krane & Mora for Wordpress
 * Version: 0.1.0
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Requires at least: 6.0 //Mínima versión de wordpress requerida
 * Requires PHP: 7.4
 * Text Domain: kmwp-coverlays
 * Domain Path: /languages
 */

function kmwp_coverlays_register_block()
{
    register_block_type(__DIR__.'/build');
}

add_action('init', 'kmwp_coverlays_register_block');

function kmwp_coverlays_load_textdomain() {
    load_plugin_textdomain(
        'kmwp-coverlays',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages/'
    );
}
add_action('plugins_loaded', 'kmwp_coverlays_load_textdomain');

function kmwp_coverlays_set_script_translations() {
    wp_set_script_translations(
        'kmwp-coverlays-editor-script', // ← handle del script
        'kmwp-coverlays',
        plugin_dir_path( __FILE__ ) . 'languages'
    );
}
add_action( 'init', 'kmwp_coverlays_set_script_translations' );