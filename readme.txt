=== KMWP Coverlays ===
Contributors: kranemora
Tags: block, gutenberg, background, overlays, FSE
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.3.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Provides a container block that allows you to use a background image with multiple color and gradient overlay layers, similar to CSS multiple background-image rules, while supporting InnerBlocks.

== Description ==

KMWP Coverlays is a WordPress block plugin designed for Full Site Editing (FSE) themes.

It provides a **container block** that lets you combine a background image with multiple color or gradient overlay layers, similar to CSS multiple `background-image` rules, while still allowing you to nest other blocks using InnerBlocks.

== Features ==

* Multiple color or gradient overlay layers
* Background image support
* Full InnerBlocks support
* Compatible with Full Site Editing (FSE)
* Internationalization (i18n) ready
* Fully **responsive background images**, optimized for different screen sizes
* Automatic **high-density (2x / 3x) image support** for Retina and Hi-DPI displays.
* Breakpoints generated automatically from available image sizes and applied via CSS media queries.
* **Extensible via WordPress filters** to modify resolved image sources and final generated CSS.
* Optionally **use the Featured Image** of the post as the background image.

== Filters / Extensibility ==

KMWP Coverlays provides filters to allow developers to modify block behavior:

* **kmwp_coverlays_image_sizes**  
  - Modify the URLs of background images per breakpoint before generating CSS.  
  - Parameters: `$sources` (associative array), `$attributes` (block attributes).  
  - Return: modified sources array.  
  - **Example:** Remove useless sizes

        add_filter( 'kmwp_coverlays_image_sizes', function ( $sources ) {

            $min_width = 360;

            return array_filter(
                $sources,
                fn( $url, $width ) => $width >= $min_width,
                ARRAY_FILTER_USE_BOTH
            );
        } );
  - **Example:** Fallback when all sizes are filtered out

        add_filter( 'kmwp_coverlays_image_sizes', function ( $sources ) {

            $min_width = 360;
            $filtered = array_filter(
                $sources,
                fn( $url, $width ) => $width >= $min_width,
                ARRAY_FILTER_USE_BOTH
            );

            // fallback: if everything was filtered out, keep the largest size
            if (empty($filtered)) {
                $filtered = [max(array_keys($sources)) => end($sources)];
            }

            return $filtered;
        } );

* **kmwp_coverlays_css**  
  - Modify the final CSS string generated for the block before output.  
  - Parameters: `$css` (string), `$attributes` (block attributes).  
  - Return: modified CSS string.  
  - **Example:** Custom CSS
        add_filter( 'kmwp_coverlays_css', function( $css, $attributes ) {
            $css .= "\n/* Custom CSS added via filter */";
            return $css;
        }, 10, 2 );

== Installation ==

1. Upload the `kmwp-coverlays` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Add the **Coverlays** block from the block inserter.

== Frequently Asked Questions ==

= Does this plugin support Full Site Editing? =

Yes. The plugin is designed for modern block themes and Full Site Editing.

= Is the plugin translation ready? =

Yes. KMWP Coverlays is fully internationalized and ready for translations.

== Changelog ==

= 1.3.0 =
* Added high-density (2x / 3x) image support.
* Fixed featured image sync when replaced or removed.

= 1.2.0 =
* Added option to **use the post's Featured Image** as the background image.

= 1.1.0 =
* Added filters for extensibility: `kmwp_coverlays_breakpoints`, `kmwp_coverlays_image_sizes`, `kmwp_coverlays_css`.

= 1.0.1 =
* Improved background image handling with responsive CSS breakpoints.

= 1.0.0 =
* Initial public release