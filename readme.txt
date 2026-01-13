=== KMWP Coverlays ===
Contributors: Krane & Mora for WordPress
Tags: block, gutenberg, background, overlays, FSE
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.1.0
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
* **Extensible via WordPress filters** to modify breakpoints, image URLs, and final CSS

== Filters / Extensibility ==

KMWP Coverlays provides filters to allow developers to modify block behavior:

* **kmwp_coverlays_breakpoints**  
  - Modify or add CSS breakpoints used for responsive background images.  
  - Parameters: `$breakpoints` (associative array), `$attributes` (block attributes).  
  - Return: modified breakpoints array.  
  - Example:
    ```
    add_filter( 'kmwp_coverlays_breakpoints', function( $breakpoints, $attributes ) {
        $breakpoints[500] = 'medium_large';
        return $breakpoints;
    }, 10, 2 );
    ```

* **kmwp_coverlays_image_sizes**  
  - Modify the URLs of background images per breakpoint before generating CSS.  
  - Parameters: `$sources` (associative array), `$attributes` (block attributes).  
  - Return: modified sources array.  
  - Example:
    ```
    add_filter( 'kmwp_coverlays_image_sizes', function( $sources, $attributes ) {
        foreach ( $sources as $width => &$url ) {
            $url .= '?v=test';
        }
        return $sources;
    }, 10, 2 );
    ```

* **kmwp_coverlays_css**  
  - Modify the final CSS string generated for the block before output.  
  - Parameters: `$css` (string), `$attributes` (block attributes).  
  - Return: modified CSS string.  
  - Example:
    ```
    add_filter( 'kmwp_coverlays_css', function( $css, $attributes ) {
        $css .= "\n/* Custom CSS added via filter */";
        return $css;
    }, 10, 2 );
    ```

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

= 1.1.0 =
* Added filters for extensibility: `kmwp_coverlays_breakpoints`, `kmwp_coverlays_image_sizes`, `kmwp_coverlays_css`.

= 1.0.1 =
* Improved background image handling with responsive CSS breakpoints.

= 1.0.0 =
* Initial public release