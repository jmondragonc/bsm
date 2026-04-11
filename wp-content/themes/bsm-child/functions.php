<?php
/**
 * BSM Child Theme Functions
 */

// Enqueue parent and child theme styles
function bsm_child_enqueue_styles()
{
    // Remove default style.css if WordPress loads it
    wp_dequeue_style('bsm-theme-style');
    wp_dequeue_style('bsm-child-style');

    // Cargar fuentes personalizadas
    wp_enqueue_style('bsm-fonts', get_stylesheet_directory_uri() . '/assets/fonts/stylesheet.css', array(), filemtime(get_stylesheet_directory() . '/assets/fonts/stylesheet.css'));
    wp_enqueue_style('clash-grotesk', get_stylesheet_directory_uri() . '/assets/css/clash-grotesk.css', array(), filemtime(get_stylesheet_directory() . '/assets/css/clash-grotesk.css'));

    // Solo cargar el child theme style minificado
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.min.css', array('bsm-fonts'), filemtime(get_stylesheet_directory() . '/style.min.css'));

    // Enqueue anime.js from local file (defer para que no bloquee)
    wp_enqueue_script('anime-js', get_stylesheet_directory_uri() . '/assets/js/anime.min.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/anime.min.js'), true);

    // Enqueue Swiper (CDN)
    wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), '11.0.0');
    wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), '11.0.0', true);

    // Enqueue custom JavaScript
    wp_enqueue_script('bsm-custom-js', get_stylesheet_directory_uri() . '/assets/js/custom.js', array('anime-js', 'swiper-js'), filemtime(get_stylesheet_directory() . '/assets/js/custom.js'), true);
}
add_action('wp_enqueue_scripts', 'bsm_child_enqueue_styles', 20);

// Disable WordPress emoji scripts
function disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'disable_emojis');

// Register custom post type: Proyecto
function bsm_register_proyecto_cpt() {
    register_post_type('proyecto', array(
        'labels' => array(
            'name'          => 'Proyectos',
            'singular_name' => 'Proyecto',
            'add_new_item'  => 'Añadir Proyecto',
            'edit_item'     => 'Editar Proyecto',
        ),
        'public'        => true,
        'has_archive'   => false,
        'rewrite'       => array('slug' => 'proyecto'),
        'supports'      => array('title', 'thumbnail'),
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-portfolio',
    ));
}
add_action('init', 'bsm_register_proyecto_cpt');

// ─── ACF Field Groups ─────────────────────────────────────────────────────────
add_action('acf/init', function() {
    require_once get_stylesheet_directory() . '/acf-fields.php';
});

// ─── Deshabilitar editor clásico y de bloques en todos los CPTs ──────────────
add_filter('use_block_editor_for_post', '__return_false');
add_filter('use_block_editor_for_post_type', '__return_false');

// Ocultar el metabox del editor clásico (si Classic Editor plugin está activo)
add_filter('classic_editor_enabled_editors_for_post_type', function($editors) {
    return array('classic_editor' => false, 'block_editor' => false);
});

// ─── Soporte para SVG, WebP y AVIF ───────────────────────────────────────────
function bsm_allow_mime_types($mimes) {
    $mimes['svg']  = 'image/svg+xml';
    $mimes['webp'] = 'image/webp';
    $mimes['avif'] = 'image/avif';
    return $mimes;
}
add_filter('upload_mimes', 'bsm_allow_mime_types');

// Validación correcta de SVG (evita el check de tipo por extensión)
function bsm_fix_svg_mime_type($data, $file, $filename, $mimes) {
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    if ($ext === 'svg') {
        $data['type'] = 'image/svg+xml';
        $data['ext']  = 'svg';
    }
    if ($ext === 'avif') {
        $data['type'] = 'image/avif';
        $data['ext']  = 'avif';
    }
    return $data;
}
add_filter('wp_check_filetype_and_ext', 'bsm_fix_svg_mime_type', 10, 4);

// ─── Remove unnecessary WordPress CSS ────────────────────────────────────────
function remove_wp_block_library_css() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-block-style'); // WooCommerce if exists
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'remove_wp_block_library_css', 100);
