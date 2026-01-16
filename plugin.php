<?php

/**
 * Plugin Name: KMWP Coverlays
 * Description: Provides a container block that allows you to use a background image with multiple color and gradient overlay layers, similar to CSS multiple background-image rules, while supporting InnerBlocks.
 * Author: Krane & Mora for Wordpress
 * Version: 1.3.0
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: kmwp-coverlays
 * Domain Path: /languages
 */

function kmwp_coverlays_register_block()
{
    register_block_type(
        __DIR__ . '/build',
        [
            'render_callback' => 'kmwp_coverlays_render_block',
        ]
    );
}

add_action('init', 'kmwp_coverlays_register_block');

function kmwp_coverlays_register_style()
{
    wp_register_style(
        'kmwp-coverlays-style',
        false,
        [],
        '1.0.0'
    );
}
add_action('init', 'kmwp_coverlays_register_style');

function kmwp_coverlays_enqueue_style_if_needed()
{

    if (! is_singular()) {
        return;
    }

    global $post;

    if (! $post || ! has_block('kmwp/coverlays', $post)) {
        return;
    }

    wp_enqueue_style('kmwp-coverlays-style');
}
add_action('wp_enqueue_scripts', 'kmwp_coverlays_enqueue_style_if_needed');


function kmwp_coverlays_render_block($attributes, $content)
{

    if (
        empty($attributes['blockId']) ||
        empty($attributes['backgroundImage']['id'])
    ) {
        return $content;
    }

    $block_id = esc_attr($attributes['blockId']);
    $image_id = (int) $attributes['backgroundImage']['id'];

    $selector = ".coverlays-block-{$block_id}";

    $layers = $attributes['layers'] ?? [];
    $overlay_layers = kmwp_coverlays_build_overlay_layers($layers);

    $sources = kmwp_coverlays_resolve_image_sources($image_id);
    $sources = apply_filters('kmwp_coverlays_image_sizes', $sources, $attributes);

    if (empty($sources)) {
        return $content;
    }

    $background_image = $attributes['backgroundImage'];
    $background_properties = kmwp_coverlays_build_background_properties($background_image);

    $css = kmwp_coverlays_generate_background_css(
        $selector,
        $sources,
        $overlay_layers,
        $background_properties
    );

    $css = apply_filters('kmwp_coverlays_css', $css, $attributes);

    wp_add_inline_style('kmwp-coverlays-style', $css);

    return $content;
}

function kmwp_coverlays_resolve_image_sources(int $attachment_id): array
{

    $sources = [];
    $attachment_metadata = wp_get_attachment_metadata($attachment_id);
    $uploads = wp_upload_dir();
    $base_url = trailingslashit($uploads['baseurl']);
    $base_dir  = dirname($attachment_metadata['file']) . '/';

    if (! empty($attachment_metadata['sizes'])) {
        foreach ($attachment_metadata['sizes'] as $metadata) {
            $sources[$metadata['width']] = $base_url . $base_dir . $metadata['file'];
        }
    }
    $sources[$attachment_metadata['width']] = $base_url . $attachment_metadata['file'];
    return $sources;
}

function kmwp_coverlays_build_overlay_layers(array $layers): array
{

    $background_layers = [];

    foreach ($layers as $layer) {

        if (! empty($layer['gradient'])) {
            $background_layers[] = $layer['gradient'];
            continue;
        }

        if (! empty($layer['color'])) {
            $color = $layer['color'];
            $background_layers[] = "linear-gradient({$color}, {$color})";
        }
    }

    return $background_layers;
}

function kmwp_coverlays_build_background_properties(array $background_image): string
{

    $size = $background_image['size'] ?? 'cover';
    $repeat = $background_image['repeat'] ?? 'no-repeat';
    $attachment = $background_image['attachment'] ?? 'scroll';

    if (! empty($background_image['focalPoint'])) {
        $x = $background_image['focalPoint']['x'] * 100;
        $y = $background_image['focalPoint']['y'] * 100;
        $position = "{$x}% {$y}%";
    } else {
        $position = '50% 50%';
    }

    return implode(' ', [
        "background-size: {$size};",
        "background-repeat: {$repeat};",
        "background-position: {$position};",
        "background-attachment: {$attachment};",
    ]);
}

function kmwp_coverlays_generate_background_css(
    string $selector,
    array $sources,
    array $overlay_layers,
    string $background_properties
): string {

    ksort($sources);

    $css = '';

    /**
     * Regla base: propiedades invariantes
     */
    $css .= "{$selector} {\n";
    $css .= "    {$background_properties}\n";
    $css .= "}\n";

    $is_first = true;
    $min_width = 0;

    foreach ($sources as $max_width => $url) {

        $layers = array_merge(
            $overlay_layers,
            ["url('{$url}')"]
        );

        $background_image = implode(', ', $layers);

        $rule = "{$selector} {\n";
        $rule .= "    background-image: {$background_image};\n";
        $rule .= "}";

        if ($is_first) {
            $css .= $rule . "\n";
            $is_first = false;
        } else {
            $css .= "@media (min-width: {$min_width}px) {\n";
            $css .= "  {$rule}\n";
            $css .= "}\n";
        }

        foreach ([2, 3] as $density) {

            $target_width = $max_width * $density;
            $hires_url = null;
            $last_url  = null;

            foreach ($sources as $w => $u) {
                $last_url = $u;
                if ($w >= $target_width) {
                    $hires_url = $u;
                    break;
                }
            }

            // fallback: usar la más grande disponible
            if (! $hires_url) {
                $hires_url = $last_url;
            }

            $layers_hd = array_merge(
                $overlay_layers,
                ["url('{$hires_url}')"]
            );

            $background_hd = implode(', ', $layers_hd);

            $rule_hd = "{$selector} {\n";
            $rule_hd .= "    background-image: {$background_hd};\n";
            $rule_hd .= "}";

            $dpi = $density * 96;

            if ($min_width === 0) {
                $css .= "@media (min-resolution: {$dpi}dpi), (-webkit-min-device-pixel-ratio: {$density}) {\n";
            } else {
                $css .= "@media (min-width: {$min_width}px) and (min-resolution: {$dpi}dpi),\n";
                $css .= "       (min-width: {$min_width}px) and (-webkit-min-device-pixel-ratio: {$density}) {\n";
            }

            $css .= "  {$rule_hd}\n";
            $css .= "}\n";
        }

        $min_width = $max_width + 1;
    }

    return $css;
}

function kmwp_coverlays_load_textdomain()
{
    load_plugin_textdomain(
        'kmwp-coverlays',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages/'
    );
}
add_action('plugins_loaded', 'kmwp_coverlays_load_textdomain');

function kmwp_coverlays_set_script_translations()
{
    wp_set_script_translations(
        'kmwp-coverlays-editor-script',
        'kmwp-coverlays',
        plugin_dir_path(__FILE__) . 'languages'
    );
}
add_action('init', 'kmwp_coverlays_set_script_translations');
