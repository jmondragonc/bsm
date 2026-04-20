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
        <a href="#" id="openContactDrawer" data-open-drawer>¿LISTO PARA CAMBIAR?</a>
    </div>
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" aria-label="Abrir menú">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    </button>
</nav>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay">
    <div class="mobile-menu-header">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="mobile-menu-logo">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo-small.svg" alt="<?php bloginfo('name'); ?>">
        </a>
        <button class="mobile-menu-close">CERRAR</button>
    </div>
    <div class="mobile-menu-content">
        <ul class="mobile-menu-list">
            <li><a href="<?php echo esc_url(home_url('/')); ?>">HOME</a></li>
            <li><a href="#work">WORK</a></li>
            <li class="accent"><a href="#about">ABOUT</a></li>
        </ul>
        <div class="mobile-menu-cta">
            <p class="mobile-menu-cta-title">¿LISTO PARA<br>CAMBIAR?</p>
            <a href="#" class="mobile-menu-email" id="openContactDrawerMobile" data-open-drawer>HOLA@BSM.PE</a>
        </div>
    </div>
</div>
