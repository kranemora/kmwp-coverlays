# Krane & Mora for Wordpress - Coverlays

Coverlays is a WordPress block plugin for Full Site Editing (FSE) themes that provides a **container block** allowing you to use a **background image with multiple color and gradient overlay layers**, similar to CSS multiple `background-image` rules, while supporting **InnerBlocks**.

---

## Features

- Add multiple **color or gradient overlays** on top of a background image.
- Supports **InnerBlocks** to nest other blocks inside the container.
- Easy-to-use inspector controls for managing overlays and background images.
- Full **internationalization (i18n)** support using WordPress translation system (`.pot`, `.po`, `.mo`).
- Fully **responsive background images**, optimized for different screen sizes.
- Automatic **high-density (2x / 3x) image support** for Retina and Hi-DPI displays.
- Breakpoints generated automatically from available image sizes and applied via CSS media queries.
- **Extensible via WordPress filters**, allowing modification of resolved image sources and final generated CSS.
- Optionally **use the Featured Image** of the post as the background image.

---

## Filters / Extensibility

KMWP Coverlays provides WordPress filters to allow themes and plugins to modify block behavior:

- **`kmwp_coverlays_image_sizes`**  
  - **Description:** Modify the resolved background image sources (width => URL) before CSS generation.  
  - **Parameters:**  
    1. `$sources` — associative array of image URLs (`max-width => URL`).  
    2. `$attributes` — block attributes array.  
  - **Return:** Modified sources array.  
  - **Example:** Remove useless sizes
    ```php
    add_filter( 'kmwp_coverlays_image_sizes', function ( $sources ) {

        $min_width = 360;

        return array_filter(
            $sources,
            fn( $url, $width ) => $width >= $min_width,
            ARRAY_FILTER_USE_BOTH
        );
    });
    ```
  - **Example:** Fallback when all sizes are filtered out
    ```php
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
    ```

- **`kmwp_coverlays_css`**  
  - **Description:** Modify the final CSS string generated for the block before output.  
  - **Parameters:**  
    1. `$css` — string of CSS rules for the block.  
    2. `$attributes` — block attributes array.  
  - **Return:** Modified CSS string.  
  - **Example:** Custom CSS
    ```php
    add_filter( 'kmwp_coverlays_css', function( $css, $attributes ) {
        $css .= "\n/* Custom CSS added via filter */";
        return $css;
    }, 10, 2 );
    ```

---

## Installation

1. Upload the `kmwp-coverlays` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Use the **Coverlays block** in your FSE-compatible theme editor.

---

## License

This plugin is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

## Author

Krane & Mora for WordPress