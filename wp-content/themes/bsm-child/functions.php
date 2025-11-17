<?php
/**
 * BSM Child Theme Functions
 */

// Enqueue parent and child theme styles
function bsm_child_enqueue_styles()
{
    // Solo cargar el child theme style
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.min.css', array(), filemtime(get_stylesheet_directory() . '/style.min.css'));

    // Enqueue custom JavaScript
    wp_enqueue_script('bsm-custom-js', get_stylesheet_directory_uri() . '/assets/js/custom.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/custom.js'), true);
}
add_action('wp_enqueue_scripts', 'bsm_child_enqueue_styles');
