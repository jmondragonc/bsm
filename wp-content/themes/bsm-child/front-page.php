<?php
/**
 * Template Name: BSM Home
 * Description: Home page template for BSM
 */

get_header(); ?>

<main id="primary" class="site-main bsm-home">

    <!-- Hero Section -->
    <section class="bsm-hero" data-bg="purple">
        <div class="hero-background">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/hero-background.svg" alt="Hero Background">
        </div>
        <div class="hero-content">
            <div class="container">
                <div class="hero-title">
                    <h1>SOMOS LA AGENCIA PARA CUANDO<br>NECESITAS UN CAMBIO</h1>
                </div>

                <div class="hero-image">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/screenshot.png" alt="Screenshot">
                </div>
            </div>
        </div>
    </section>

    <!-- What We Do Section -->
    <section class="bsm-what-we-do" data-bg="light">
        <div class="container">
            <h2>¿QUÉ HACEMOS?</h2>
            <p class="subtitle">Nos especializamos en transformar marcas con estrategia, diseño<br>y comunicación.</p>

            <div class="services-grid">
                <div class="service-item">
                    <h3>Estrategia</h3>
                    <button class="expand-btn">+</button>
                </div>
                <div class="service-item">
                    <h3>Creatividad</h3>
                    <button class="expand-btn">+</button>
                </div>
                <div class="service-item">
                    <h3>Diseño</h3>
                    <button class="expand-btn">+</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Full Experience Section -->
    <section class="bsm-full-experience" data-bg="dark">
        <div class="container">
            <h2>CREAMOS UNA<br>EXPERIENCIA<br>DE MARCA<br>COMPLETA</h2>

            <div class="services-tags">
                <span class="tag">BRANDING</span>
                <span class="tag">NAMING</span>
                <span class="tag">PACKAGING</span>
                <span class="tag">SOCIAL MEDIA</span>
                <span class="tag">CAMPAÑAS CREATIVAS</span>
                <span class="tag">POSICIONAMIENTO</span>
                <span class="tag">MANUAL DE MARCA</span>
                <span class="tag">Y MÁS</span>
            </div>
        </div>
    </section>

    <!-- Work Section -->
    <section class="bsm-work" id="work" data-bg="light">
        <div class="container">
            <h2>TRABAJAMOS CON CLIENTES<br>CON VISIÓN</h2>

            <div class="work-grid">
                <!-- Garbachos -->
                <div class="work-item">
                    <div class="work-image">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos.svg" alt="Garbachos">
                    </div>
                    <div class="work-info">
                        <h3>Garbachos</h3>
                        <p>Comestibles</p>
                        <div class="work-tags">
                            <span class="tag">branding</span>
                            <span class="tag">packaging</span>
                            <span class="tag">estrategia</span>
                        </div>
                    </div>
                </div>

                <!-- Organa -->
                <div class="work-item">
                    <div class="work-image">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa.svg" alt="Organa">
                    </div>
                    <div class="work-info">
                        <h3>Organa</h3>
                        <p>Retail</p>
                        <div class="work-tags">
                            <span class="tag">branding</span>
                            <span class="tag">naming</span>
                        </div>
                    </div>
                </div>

                <!-- Smart Blends -->
                <div class="work-item">
                    <div class="work-image">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends.svg" alt="Smart Blends">
                    </div>
                    <div class="work-info">
                        <h3>Smart Blends</h3>
                        <p>Productos saludables</p>
                        <div class="work-tags">
                            <span class="tag">packaging</span>
                            <span class="tag">BRANDing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bsm-testimonials" data-bg="dark">
        <div class="testimonials-container">
            <!-- Garbachos Testimonial -->
            <div class="testimonial-item">
                <div class="testimonial-images">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos-bocas.svg" alt="Garbachos" class="img-1">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos-chela.svg" alt="Garbachos" class="img-2">
                </div>
                <div class="testimonial-content">
                    <div class="avatar"></div>
                    <h4>Garbachos_user</h4>
                    <p>"Hoy mi marca ya está lista para crecer con solidez."</p>
                </div>
            </div>

            <!-- Organa Testimonial -->
            <div class="testimonial-item">
                <div class="testimonial-images">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa-1.svg" alt="Organa" class="img-1">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa-2.svg" alt="Organa" class="img-2">
                </div>
                <div class="testimonial-content">
                    <div class="avatar green"></div>
                    <h4>Organa</h4>
                    <p>"El proceso fue super personalizado."</p>
                </div>
            </div>

            <!-- Smart Blends Testimonial -->
            <div class="testimonial-item">
                <div class="testimonial-images">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends-storie.png" alt="Smart Blends" class="img-1">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends-carrusel.png" alt="Smart Blends" class="img-2">
                </div>
                <div class="testimonial-content">
                    <div class="avatar blue"></div>
                    <h4>Smart Blends</h4>
                    <p>"Me encantó trabajar con ellos."</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bsm-footer" data-bg="purple">
        <div class="footer-background">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/hero-background.svg" alt="Footer Background">
        </div>
        <div class="footer-content">
            <div class="container">
                <div class="footer-logo">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.svg" alt="BSM Logo">
                </div>

                <div class="footer-info">
                    <div class="footer-location">Lima, PERÚ</div>
                    <div class="footer-social">
                        <p>síguenos</p>
                        <p>instagram</p>
                        <p>linkedin</p>
                    </div>
                    <div class="footer-copyright">©BSM 2025</div>
                </div>
            </div>
        </div>
    </footer>

</main>

<?php get_footer(); ?>
