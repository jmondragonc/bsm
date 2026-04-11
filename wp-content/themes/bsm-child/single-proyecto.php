<?php
/**
 * Template for single proyecto (project detail page)
 */
get_header('interna'); ?>

<main class="proyecto-interna">

    <!-- ─── TÍTULO DEL PROYECTO (encima del hero) ────────────────────── -->
    <section class="proyecto-title-section">
        <h1 class="proyecto-main-title"><?php
            $titulo_pagina = get_field('proyecto_titulo_pagina');
            if ($titulo_pagina) {
                echo wp_kses($titulo_pagina, array('br' => array()));
            } else {
                echo wp_kses(get_the_title(), array('br' => array()));
            }
        ?></h1>
    </section>

    <!-- ─── HERO BANNER ──────────────────────────────────────────────── -->
    <section class="proyecto-hero">
        <?php
        $hero = get_field('proyecto_hero_imagen');
        if ($hero) : ?>
        <img
            src="<?php echo esc_url($hero['url']); ?>"
            alt="<?php echo esc_attr($hero['alt'] ?: get_the_title() . ' – Banner'); ?>">
        <?php else : ?>
        <img
            src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/banner-interna.jpg"
            alt="<?php echo esc_attr(get_the_title()); ?> – Banner">
        <?php endif; ?>
    </section>

    <!-- ─── INFO DEL PROYECTO ────────────────────────────────────────── -->
    <section class="proyecto-info">
        <div class="proyecto-info-left">
            <p class="proyecto-client-name"><?php echo esc_html(get_field('proyecto_cliente') ?: get_the_title()); ?></p>
            <p class="proyecto-client-category"><?php echo esc_html(get_field('proyecto_cat_anio') ?: ''); ?></p>
            <div class="proyecto-tags">
                <?php
                $tags_interna = get_field('proyecto_tags_interna');
                if ($tags_interna) :
                    foreach ($tags_interna as $tag) : ?>
                <span class="tag-pill"><?php echo esc_html($tag['texto']); ?></span>
                    <?php endforeach;
                endif; ?>
            </div>
        </div>
        <div class="proyecto-info-right">
            <p class="proyecto-description"><?php echo esc_html(get_field('proyecto_descripcion') ?: ''); ?></p>
            <?php if (get_field('proyecto_acordeon')) : ?>
            <div class="proyecto-seguir">
                <span class="proyecto-seguir-text">Seguir leyendo</span>
                <button class="proyecto-seguir-btn" aria-label="Seguir leyendo" aria-expanded="false">+</button>
            </div>
            <div class="proyecto-acordeon" aria-hidden="true">
                <p><?php echo esc_html(get_field('proyecto_acordeon')); ?></p>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- ─── GALERÍA ──────────────────────────────────────────────────── -->
    <?php
    $galeria = get_field('proyecto_galeria');
    if ($galeria) : ?>
    <section class="proyecto-galeria">
        <div class="proyecto-galeria-grid">
            <?php
            // Mapa de clases: primera imagen wide, luego alternamos half/third
            $total = count($galeria);
            foreach ($galeria as $i => $img) :
                if ($i === 0 || $i === $total - 1) {
                    $clase = 'galeria-item--wide';
                } elseif ($i % 3 === 1) {
                    $clase = 'galeria-item--half';
                } elseif ($i % 3 === 2) {
                    $clase = 'galeria-item--half';
                } else {
                    $clase = 'galeria-item--third';
                }
            ?>
            <div class="galeria-item <?php echo $clase; ?>">
                <img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt']); ?>">
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php else : ?>
    <!-- Galería fallback (hardcodeada) mientras no haya imágenes en ACF -->
    <section class="proyecto-galeria">
        <div class="proyecto-galeria-grid">
            <div class="galeria-item galeria-item--wide">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img1.png" alt="">
            </div>
            <div class="galeria-item galeria-item--half">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img2.png" alt="">
            </div>
            <div class="galeria-item galeria-item--half">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img3.png" alt="">
            </div>
            <div class="galeria-item galeria-item--third">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img4.png" alt="">
            </div>
            <div class="galeria-item galeria-item--third">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img5.png" alt="">
            </div>
            <div class="galeria-item galeria-item--third">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img6.png" alt="">
            </div>
            <div class="galeria-item galeria-item--wide">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img7.png" alt="">
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- ─── DESCUBRE MÁS PROYECTOS ───────────────────────────────────── -->
    <section class="proyecto-mas">
        <div class="proyecto-mas-inner">
            <h2 class="proyecto-mas-title">DESCUBRE MÁS<br>PROYECTOS</h2>
            <div class="proyecto-mas-grid">
                <?php
                // Mostrar otros 2 proyectos publicados (excluyendo el actual)
                $otros = get_posts(array(
                    'post_type'      => 'proyecto',
                    'posts_per_page' => 2,
                    'post__not_in'   => array(get_the_ID()),
                    'orderby'        => 'menu_order',
                    'order'          => 'ASC',
                ));
                foreach ($otros as $otro) :
                    $card_img  = get_field('proyecto_imagen_card', $otro->ID);
                    $categoria = get_field('proyecto_categoria', $otro->ID) ?: '';
                    $tags_card = get_field('proyecto_tags', $otro->ID) ?: array();
                ?>
                <a href="<?php echo esc_url(get_permalink($otro->ID)); ?>" class="proyecto-mas-card">
                    <div class="proyecto-mas-img">
                        <?php if ($card_img) : ?>
                        <img src="<?php echo esc_url($card_img['url']); ?>" alt="<?php echo esc_attr($card_img['alt'] ?: get_the_title($otro->ID)); ?>">
                        <?php endif; ?>
                    </div>
                    <div class="proyecto-mas-info">
                        <h3 class="proyecto-mas-nombre"><?php echo esc_html(get_the_title($otro->ID)); ?></h3>
                        <p class="proyecto-mas-categoria"><?php echo esc_html($categoria); ?></p>
                        <div class="proyecto-mas-tags">
                            <?php foreach ($tags_card as $tag) : ?>
                            <span class="tag-pill"><?php echo esc_html($tag['texto']); ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- ─── FOOTER ───────────────────────────────────────────────────── -->
    <footer class="bsm-footer">
        <div class="footer-top">
            <div class="footer-info-left">
                <div>LIMA, PERÚ</div>
                <div>2024</div>
            </div>
            <div class="footer-info-right">
                <div class="footer-socials">
                    <a href="#">INSTAGRAM</a>
                    <a href="#">LINKEDIN</a>
                    <a href="#">BEHANCE</a>
                </div>
                <div class="footer-socials">
                    <a href="#">TRABAJO</a>
                    <a href="#">NOSOTROS</a>
                    <a href="#" data-open-drawer>CONTÁCTANOS</a>
                </div>
            </div>
        </div>
        <div class="footer-logo">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.svg" alt="BSM Logo">
        </div>
    </footer>

</main>

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
        <h2 class="contact-drawer-title">SEA CUAL SEA<br>TU OBJETIVO,<br>TE AYUDAMOS<br>A LOGRARLO</h2>
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
