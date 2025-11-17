<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<nav class="bsm-nav">
    <div class="nav-left">
        <div class="logo">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo-small.svg" alt="<?php bloginfo('name'); ?>">
            </a>
        </div>
        <ul class="nav-menu-left">
            <li><a href="#work">WORK</a></li>
            <li><a href="#about">ABOUT US</a></li>
        </ul>
    </div>
    <div class="nav-right">
        <a href="#contact">¿LISTO PARA CAMBIAR?</a>
    </div>
</nav>
