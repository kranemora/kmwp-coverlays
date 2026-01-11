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
 */

function kmwp_coverlays_register_block()
{
    register_block_type(__DIR__.'/build');
}

add_action('init', 'kmwp_coverlays_register_block');
