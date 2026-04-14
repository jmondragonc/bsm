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
    $filas = get_field('proyecto_filas');
    if ($filas) : ?>
    <section class="proyecto-galeria">
        <?php foreach ($filas as $fila) :
            $layout  = $fila['fila_layout'] ?: 'full';
            $bloques = $fila['fila_bloques'] ?: array();
        ?>
        <div class="galeria-fila galeria-fila--<?php echo esc_attr($layout); ?>">
            <?php foreach ($bloques as $bloque) :
                $tipo = $bloque['bloque_tipo'] ?: 'imagen';
            ?>
            <div class="galeria-bloque">
                <?php if ($tipo === 'imagen') :
                    $img = $bloque['bloque_imagen'];
                    if ($img) : ?>
                    <img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt']); ?>">
                    <?php endif;

                elseif ($tipo === 'video_mp4') :
                    $file = $bloque['bloque_video_mp4'];
                    if ($file) : ?>
                    <video autoplay muted loop playsinline disablePictureInPicture>
                        <source src="<?php echo esc_url($file['url']); ?>" type="<?php echo esc_attr($file['mime_type']); ?>">
                    </video>
                    <?php endif;

                elseif ($tipo === 'video_vimeo') :
                    $url = $bloque['bloque_video_url'];
                    if ($url) :
                        preg_match('/vimeo\.com\/(\d+)/', $url, $m);
                        $vid = $m[1] ?? '';
                        if ($vid) : ?>
                    <div class="galeria-video-wrapper">
                        <iframe src="https://player.vimeo.com/video/<?php echo esc_attr($vid); ?>?autoplay=1&muted=1&loop=1&background=1&controls=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    </div>
                        <?php endif;
                    endif;

                elseif ($tipo === 'video_youtube') :
                    $url = $bloque['bloque_video_url'];
                    if ($url) :
                        preg_match('/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/', $url, $m);
                        $vid = $m[1] ?? '';
                        if ($vid) : ?>
                    <div class="galeria-video-wrapper">
                        <iframe src="https://www.youtube.com/embed/<?php echo esc_attr($vid); ?>?autoplay=1&mute=1&loop=1&playlist=<?php echo esc_attr($vid); ?>&controls=0&disablekb=1&modestbranding=1&rel=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    </div>
                        <?php endif;
                    endif;
                endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endforeach; ?>
    </section>
    <?php else : ?>
    <!-- Galería fallback (hardcodeada) mientras no haya filas en ACF -->
    <section class="proyecto-galeria">
        <div class="galeria-fila galeria-fila--full">
            <div class="galeria-bloque">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img1.png" alt="">
            </div>
        </div>
        <div class="galeria-fila galeria-fila--half">
            <div class="galeria-bloque">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img2.png" alt="">
            </div>
            <div class="galeria-bloque">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/interna/img3.png" alt="">
            </div>
        </div>
        <div class="galeria-fila galeria-fila--full">
            <div class="galeria-bloque">
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
