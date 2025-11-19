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

    // Solo cargar el child theme style minificado
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.min.css', array(), filemtime(get_stylesheet_directory() . '/style.min.css'));

    // Enqueue anime.js from local file (defer para que no bloquee)
    wp_enqueue_script('anime-js', get_stylesheet_directory_uri() . '/assets/js/anime.min.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/anime.min.js'), true);

    // Enqueue custom JavaScript
    wp_enqueue_script('bsm-custom-js', get_stylesheet_directory_uri() . '/assets/js/custom.js', array('anime-js'), filemtime(get_stylesheet_directory() . '/assets/js/custom.js'), true);
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

// Remove unnecessary WordPress CSS
function remove_wp_block_library_css() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-block-style'); // WooCommerce if exists
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'remove_wp_block_library_css', 100);
