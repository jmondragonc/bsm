<?php
/**
 * Template Name: BSM Home
 * Description: Home page template for BSM
 */

get_header(); ?>

<main id="primary" class="site-main bsm-home">

    <!-- Hero Section -->
    <section class="bsm-hero" data-bg="purple">
        <div class="bsm-hero-sticky-wrapper">
            <div class="hero-background">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/hero-background.svg"
                    alt="Hero Background">
            </div>
            <div class="hero-content">
                <div class="container">
                    <div class="hero-image">
                        <div class="frames">
                            <div class="b">
                                <div class="b1_1"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/b1.svg"
                                        alt="Frame B1"></div>
                                <div class="b1_2"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/b2.svg"
                                        alt="Frame B2"></div>
                                <div class="b1_3"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/b3.svg"
                                        alt="Frame B3"></div>
                            </div>
                            <div class="s">
                                <div class="s1_1"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/s1.svg"
                                        alt="Frame S1"></div>
                            </div>
                            <div class="m">
                                <div class="m1_1"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/m1.svg"
                                        alt="Frame M1"></div>
                                <div class="m1_2"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/m2.svg"
                                        alt="Frame M2"></div>
                                <div class="m1_3"><img
                                        src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/m3.svg"
                                        alt="Frame M3"></div>
                                <!-- <div class="lines">
                                    <div class="line-1">
                                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/line1.svg"
                                            alt="Frame L1">
                                    </div>
                                    <div class="line-2">
                                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/line2.svg"
                                            alt="Frame L2">
                                    </div>
                                    <div class="line-3">
                                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/line3.svg"
                                            alt="Frame L3">
                                    </div>
                                    <div class="registered">
                                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/r.svg"
                                            alt="Registered Trademark">
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="hero-title">
                        <h1><?php echo wp_kses(get_field('hero_titulo') ?: 'CREAMOS MARCAS<br>PARA EL FUTURO', array('br' => array())); ?></h1>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- What We Do Section -->
    <section class="bsm-what-we-do" data-bg="light">
        <div class="container">
            <div>
                <h2 class="animate-fade-up"><?php echo esc_html(get_field('qh_titulo') ?: '¿QUÉ HACEMOS?'); ?></h2>
                <p class="subtitle animate-fade-up"><?php echo esc_html(get_field('qh_subtitulo') ?: 'Nos especializamos en transformar marcas con estrategia, diseño y comunicación.'); ?></p>
            </div>
            <div></div>
            <div>
                <div class="services-grid">
                    <?php
                    $servicios_default = array(
                        array('nombre' => 'Estrategia',  'descripcion' => 'Nuestro trabajo es hacer que tu marca sea única, por más que el mercado este saturado. Ser auténtico es lo más preciado por la gente.'),
                        array('nombre' => 'Creatividad', 'descripcion' => 'Desarrollamos ideas creativas que conectan con tu audiencia y hacen que tu marca destaque en el mercado.'),
                        array('nombre' => 'Diseño',      'descripcion' => 'Creamos experiencias visuales memorables que reflejan la esencia de tu marca y generan impacto.'),
                    );
                    $servicios = get_field('qh_servicios') ?: $servicios_default;
                    foreach ($servicios as $servicio) : ?>
                    <div class="service-item animate-slide-left">
                        <div class="service-header">
                            <h3><?php echo esc_html($servicio['nombre']); ?></h3>
                            <button class="expand-btn"><span class="plus-icon"></span></button>
                        </div>
                        <div class="service-content">
                            <p><?php echo esc_html($servicio['descripcion']); ?></p>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Full Experience Section -->
    <div class="bsm-experience-wrapper">
    <section class="bsm-full-experience" data-bg="dark">
        <div class="container">
            <h2 class="mobile-break"><?php echo wp_kses(get_field('exp_titulo') ?: 'AUTHENTIC<br>BY DESIGN<br>DRIVEN<br>BY BSM', array('br' => array())); ?></h2>

            <div class="services-tags">
                <?php
                $tags_default = array(
                    array('texto' => 'BRANDING'),
                    array('texto' => 'NAMING'),
                    array('texto' => 'PACKAGING'),
                    array('texto' => 'SOCIAL MEDIA'),
                    array('texto' => 'CAMPAÑAS CREATIVAS'),
                    array('texto' => 'POSICIONAMIENTO'),
                    array('texto' => 'MANUAL DE MARCA'),
                    array('texto' => 'Y MÁS'),
                );
                $exp_tags = get_field('exp_tags') ?: $tags_default;
                foreach ($exp_tags as $i => $tag) :
                    $n = $i + 1; ?>
                <span class="tag tag-<?php echo $n; ?>"><?php echo esc_html($tag['texto']); ?></span>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    </div>

    <!-- Work Section -->
    <section class="bsm-work" id="work" data-bg="light">
        <div class="container">
            <!-- Horizontal Scroll Container -->
            <div class="bsm-work-sticky-wrapper">
                <div class="bsm-work-container">
                    <h2><?php echo wp_kses(get_field('work_titulo') ?: 'TRABAJAMOS CON CLIENTES<br>CON VISIÓN', array('br' => array())); ?></h2>
                    <div class="bsm-work-track">
                        <?php
                        $proyectos = get_field('work_proyectos');
                        if ($proyectos) :
                            foreach ($proyectos as $proyecto) :
                                $img       = get_field('proyecto_imagen_card', $proyecto->ID);
                                $img_url   = $img ? $img['url'] : '';
                                $img_alt   = $img ? $img['alt'] : get_the_title($proyecto->ID);
                                $categoria = get_field('proyecto_categoria', $proyecto->ID) ?: '';
                                $tags_raw  = get_field('proyecto_tags', $proyecto->ID) ?: array();
                        ?>
                        <a class="work-item" href="<?php echo esc_url(get_permalink($proyecto->ID)); ?>">
                            <div class="work-image">
                                <?php if ($img_url) : ?>
                                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($img_alt); ?>">
                                <?php endif; ?>
                            </div>
                            <div class="work-info">
                                <h3><?php echo esc_html(get_the_title($proyecto->ID)); ?></h3>
                                <p><?php echo esc_html($categoria); ?></p>
                                <div class="work-tags">
                                    <?php foreach ($tags_raw as $tag) : ?>
                                    <span class="tag"><?php echo esc_html($tag['texto']); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </a>
                        <?php
                            endforeach;
                        else :
                            // Fallback hardcodeado mientras no se configuren proyectos en ACF
                            $fallback = array(
                                array('href' => home_url('/proyecto/smart-blends'), 'img' => get_stylesheet_directory_uri() . '/assets/images/smart-blends.svg', 'alt' => 'Smart Blends', 'nombre' => 'Smart Blends', 'cat' => 'Productos Saludables', 'tags' => array('branding','packaging')),
                                array('href' => home_url('/proyecto/organa'),       'img' => get_stylesheet_directory_uri() . '/assets/images/organa.svg',       'alt' => 'Organa',       'nombre' => 'Organa',       'cat' => 'Retail',              'tags' => array('naming','branding')),
                                array('href' => home_url('/proyecto/garbachos'),    'img' => get_stylesheet_directory_uri() . '/assets/images/garbachos.svg',    'alt' => 'Garbachos',    'nombre' => 'Garbachos',    'cat' => 'Comestibles',         'tags' => array('estrategia','branding','packaging')),
                                array('href' => home_url('/proyecto/smart-blends'), 'img' => get_stylesheet_directory_uri() . '/assets/images/smart-blends.svg', 'alt' => 'Smart Blends', 'nombre' => 'Smart Blends', 'cat' => 'Productos Saludables', 'tags' => array('branding','packaging')),
                            );
                            foreach ($fallback as $item) : ?>
                        <a class="work-item" href="<?php echo esc_url($item['href']); ?>">
                            <div class="work-image">
                                <img src="<?php echo esc_url($item['img']); ?>" alt="<?php echo esc_attr($item['alt']); ?>">
                            </div>
                            <div class="work-info">
                                <h3><?php echo esc_html($item['nombre']); ?></h3>
                                <p><?php echo esc_html($item['cat']); ?></p>
                                <div class="work-tags">
                                    <?php foreach ($item['tags'] as $tag) : ?>
                                    <span class="tag"><?php echo esc_html($tag); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </a>
                        <?php endforeach;
                        endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Reconocimientos Section -->
    <div class="bsm-reconocimientos-wrapper">
    <section class="bsm-reconocimientos" data-bg="light">
        <h2 class="reconocimientos-titulo"><?php echo esc_html(get_field('rec_titulo') ?: 'RECONOCIMIENTOS:'); ?></h2>

        <div class="reconocimientos-carousel-wrapper">
            <div class="reconocimientos-track" id="reconocimientosTrack">

                <?php
                $slides_acf = get_field('rec_slides');
                // Fallback hardcoded si aún no hay datos en ACF
                $slides_default = array(
                    array('logo' => array('url' => get_stylesheet_directory_uri() . '/assets/images/interna/1.organa.svg',       'alt' => 'Organa'),       'quote' => '"Nos crearon el nombre, el branding, el E-commerce, la estrategia y nuestra franquicia de vitaminas y suplementos"', 'autor' => 'Arturo H',         'cargo' => 'Fundador y Gerente'),
                    array('logo' => array('url' => get_stylesheet_directory_uri() . '/assets/images/interna/2.smart-blends.svg', 'alt' => 'Smart Blends'), 'quote' => '"Sorprendidos con la transformación de nuestro Branding; llevaron nuestros empaques a otro nivel."',             'autor' => 'Scarly T',         'cargo' => 'Gerente General'),
                    array('logo' => array('url' => get_stylesheet_directory_uri() . '/assets/images/interna/3.plaza-vea.svg',    'alt' => 'Plaza Vea'),    'quote' => '"Rediseñaron nuestro programa \'Bueno por dentro\', logrando transmitir nuestro propósito social"',            'autor' => 'Paulina y Micaela', 'cargo' => 'Equipo de sostenibilidad'),
                    array('logo' => array('url' => get_stylesheet_directory_uri() . '/assets/images/interna/4.crocantitos.svg',  'alt' => 'Crocantitos'),  'quote' => '"Rediseñaron nuestros empaques para competir en el mercado de USA"',                                           'autor' => 'Mr. D',            'cargo' => 'Gerente General'),
                    array('logo' => array('url' => get_stylesheet_directory_uri() . '/assets/images/interna/5.cosecha-andina.svg','alt'=> 'Cosecha Andina'),'quote' => '"Crearon nuestra nueva línea de snacks: desde el nombre hasta el empaque, quedó Increíble"',                'autor' => 'Susan F',          'cargo' => 'Gerente General'),
                );
                $slides = $slides_acf ?: $slides_default;
                foreach ($slides as $slide) :
                    $logo = $slide['logo'];
                ?>
                <div class="reconocimiento-slide">
                    <div class="reconocimiento-logo">
                        <img src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($logo['alt']); ?>">
                    </div>
                    <blockquote class="reconocimiento-quote"><?php echo esc_html($slide['quote']); ?></blockquote>
                    <div class="reconocimiento-autor">
                        <span class="reconocimiento-nombre"><?php echo esc_html($slide['autor']); ?></span>
                        <span class="reconocimiento-cargo"><?php echo esc_html($slide['cargo']); ?></span>
                    </div>
                </div>
                <?php endforeach; ?>

            </div>

            <!-- Dots -->
            <div class="reconocimientos-dots" id="reconocimientosDots"></div>
        </div>
    </section>
    </div><!-- /.bsm-reconocimientos-wrapper -->

    <!-- Footer -->
</main>

    <!-- Footer Section -->
    <div class="bsm-footer-sticky-wrapper">
    <footer class="bsm-footer">
        <div class="footer-top">
            <div class="footer-info-left">
                <div><?php echo esc_html(get_field('footer_ciudad') ?: 'LIMA, PERÚ'); ?></div>
            </div>

            <div class="footer-info-right">
                <div class="footer-socials">
                    <div><?php echo esc_html(get_field('footer_siguenos') ?: 'SÍGUENOS'); ?></div>
                    <?php
                    $redes_default = array(
                        array('nombre' => 'INSTAGRAM', 'url' => '#'),
                        array('nombre' => 'LINKEDIN',  'url' => '#'),
                    );
                    $redes = get_field('footer_redes') ?: $redes_default;
                    foreach ($redes as $red) : ?>
                    <a href="<?php echo esc_url($red['url']); ?>" target="_blank"><?php echo esc_html($red['nombre']); ?></a>
                    <?php endforeach; ?>
                </div>
                <div class="footer-copyright">
                    <?php echo esc_html(get_field('footer_anio') ?: '©BSM 2026'); ?>
                </div>
            </div>
        </div>

    </footer>
        <div class="footer-logo">
            <?php
            $footer_logo = get_field('footer_logo');
            if ($footer_logo) : ?>
                <img src="<?php echo esc_url($footer_logo['url']); ?>" alt="<?php echo esc_attr($footer_logo['alt'] ?: 'BSM Logo'); ?>">
            <?php else : ?>
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.svg" alt="BSM Logo">
            <?php endif; ?>
        </div>
    </div><!-- /.bsm-footer-sticky-wrapper -->

    <!-- Contact Drawer Overlay -->
    <div class="contact-drawer-overlay" id="contactDrawerOverlay"></div>

    <!-- Contact Drawer -->
    <aside class="contact-drawer" id="contactDrawer" aria-hidden="true">
        <button class="contact-drawer-close" id="contactDrawerClose" aria-label="Cerrar formulario">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>

        <div class="contact-drawer-content">
            <h2 class="contact-drawer-title"><?php
                $contact_titulo = get_field('contact_titulo') ?: "SEA CUAL SEA\nTU OBJETIVO,\nTE AYUDAMOS\nA LOGRARLO";
                echo nl2br(esc_html($contact_titulo));
            ?></h2>

            <form class="contact-drawer-form" id="contactDrawerForm">
                <div class="contact-field">
                    <input type="text" name="nombre" placeholder="Nombre" required>
                </div>
                <div class="contact-field">
                    <input type="email" name="email" placeholder="Email" required>
                </div>
                <div class="contact-field">
                    <input type="text" name="asunto" placeholder="Asunto" required>
                </div>
                <div class="contact-field contact-field--textarea">
                    <textarea name="mensaje" rows="3" placeholder="Hola equipo de BSM,"></textarea>
                </div>
                <div class="contact-field contact-field--submit">
                    <button type="submit" class="contact-drawer-submit">EMPECEMOS</button>
                </div>
            </form>
        </div>
    </aside>

    <?php wp_footer(); ?>
</body>
</html>