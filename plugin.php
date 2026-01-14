<?php

/**
 * Plugin Name: KMWP Coverlays
 * Description: Provides a container block that allows you to use a background image with multiple color and gradient overlay layers, similar to CSS multiple background-image rules, while supporting InnerBlocks.
 * Author: Krane & Mora for Wordpress
 * Version: 1.2.0
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: kmwp-coverlays
 * Domain Path: /languages
 */

function kmwp_coverlays_render_block( $attributes, $content ) {

    if (
        empty( $attributes['blockId'] ) ||
        empty( $attributes['backgroundImage']['id'] )
    ) {
        return $content;
    }

    $image_id = (int) $attributes['backgroundImage']['id'];

    $block_id = esc_attr( $attributes['blockId'] );
    $image_id = (int) $attributes['backgroundImage']['id'];

    $selector = ".coverlays-block-{$block_id}";

    $layers = $attributes['layers'] ?? [];
    $overlay_layers = kmwp_coverlays_build_overlay_layers( $layers );
    
    $breakpoints = kmwp_coverlays_get_default_breakpoints();
    $breakpoints = apply_filters( 'kmwp_coverlays_breakpoints', $breakpoints, $attributes );

    $sources = kmwp_coverlays_resolve_image_sources( $image_id, $breakpoints );
    $sources = apply_filters( 'kmwp_coverlays_image_sizes', $sources, $attributes ); 

    if ( empty( $sources ) ) {
        return $content;
    }

    $background_image = $attributes['backgroundImage'];
    $background_properties = kmwp_coverlays_build_background_properties( $background_image );

    $css = kmwp_coverlays_generate_background_css(
        $selector,
        $sources,
        $overlay_layers,
        $background_properties
    );

    $css = apply_filters( 'kmwp_coverlays_css', $css, $attributes );

    wp_add_inline_style( 'kmwp-coverlays-style', $css );

    return $content;
}

function kmwp_coverlays_register_block()
{
    register_block_type(
        __DIR__.'/build',
        [
            'render_callback' => 'kmwp_coverlays_render_block',
        ]
    );
}

add_action('init', 'kmwp_coverlays_register_block');

function kmwp_coverlays_register_style() {
    wp_register_style(
        'kmwp-coverlays-style',
        false,
        [],
        '1.0.0'
    );

}
add_action( 'init', 'kmwp_coverlays_register_style' );

function kmwp_coverlays_enqueue_style_if_needed() {

    if ( ! is_singular() ) {
        return;
    }

    global $post;

    if ( ! $post || ! has_block( 'kmwp/coverlays', $post ) ) {
        return;
    }

    wp_enqueue_style( 'kmwp-coverlays-style' );
}
add_action( 'wp_enqueue_scripts', 'kmwp_coverlays_enqueue_style_if_needed' );


function kmwp_coverlays_get_default_breakpoints() {
    return [
        0    => 'medium',
        600  => 'medium_large',
        1024 => 'large',
        1536 => '1536x1536',
        2048 => 'full',
    ];
}

function kmwp_coverlays_resolve_image_sources( int $attachment_id, array $breakpoints = [] ): array {


    if ( empty( $breakpoints ) ) {
        $breakpoints = kmwp_coverlays_get_default_breakpoints();
    }

    $sources = [];

    foreach ( $breakpoints as $max_width => $size ) {

        $image = wp_get_attachment_image_src( $attachment_id, $size );

        if ( ! $image ) {
            continue;
        }

        $sources[ $max_width ] = $image[0];
    }

    return $sources;
}

function kmwp_coverlays_build_overlay_layers( array $layers ): array {

    $background_layers = [];

    foreach ( $layers as $layer ) {

        if ( ! empty( $layer['gradient'] ) ) {
            $background_layers[] = $layer['gradient'];
            continue;
        }

        if ( ! empty( $layer['color'] ) ) {
            $color = $layer['color'];
            $background_layers[] = "linear-gradient({$color}, {$color})";
        }
    }

    return $background_layers;
}

function kmwp_coverlays_build_background_properties( array $background_image ): string {

    $size = $background_image['size'] ?? 'cover';
    $repeat = $background_image['repeat'] ?? 'no-repeat';
    $attachment = $background_image['attachment'] ?? 'scroll';

    if ( ! empty( $background_image['focalPoint'] ) ) {
        $x = $background_image['focalPoint']['x'] * 100;
        $y = $background_image['focalPoint']['y'] * 100;
        $position = "{$x}% {$y}%";
    } else {
        $position = '50% 50%';
    }

    return implode( ' ', [
        "background-size: {$size};",
        "background-repeat: {$repeat};",
        "background-position: {$position};",
        "background-attachment: {$attachment};",
    ] );
}

function kmwp_coverlays_generate_background_css(
    string $selector,
    array $sources,
    array $overlay_layers,
    string $background_properties
): string {

    ksort( $sources );

    $css = '';
    $is_first = true;

    foreach ( $sources as $min_width => $url ) {

        $layers = array_merge(
            $overlay_layers,
            [ "url('{$url}')" ]
        );

        $background_image = implode( ', ', $layers );

        $rule = "{$selector} {
            background-image: {$background_image};
            {$background_properties}
        }";

        if ( $is_first ) {
            $css .= $rule . "\n";
            $is_first = false;
            continue;
        }

        $css .= "@media (min-width: {$min_width}px) {\n";
        $css .= "  {$rule}\n";
        $css .= "}\n";
    }

    return $css;
}

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
        'kmwp-coverlays-editor-script',
        'kmwp-coverlays',
        plugin_dir_path( __FILE__ ) . 'languages'
    );
}
add_action( 'init', 'kmwp_coverlays_set_script_translations' );