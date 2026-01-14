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
                    <h1>CREAMOS MARCAS<br>PARA EL FUTURO</h1>
                </div>


            </div>
        </div>
    </section>

    <!-- What We Do Section -->
    <section class="bsm-what-we-do" data-bg="light">
        <div class="container">
            <div>
                <h2 class="animate-fade-up">¿QUÉ HACEMOS?</h2>
                <p class="subtitle animate-fade-up">Nos especializamos en transformar marcas con estrategia, diseño y comunicación.</p>
            </div>
            <div></div>
            <div>
                <div class="services-grid">
                    <div class="service-item animate-slide-left">
                        <div class="service-header">
                            <h3>Estrategia</h3>
                            <button class="expand-btn">+</button>
                        </div>
                        <div class="service-content">
                            <p>Nuestro trabajo es hacer que tu marca sea única, por más que el mercado este saturado. Ser auténtico es lo más preciado por la gente.</p>
                        </div>
                    </div>
                    <div class="service-item animate-slide-left">
                        <div class="service-header">
                            <h3>Creatividad</h3>
                            <button class="expand-btn">+</button>
                        </div>
                        <div class="service-content">
                            <p>Desarrollamos ideas creativas que conectan con tu audiencia y hacen que tu marca destaque en el mercado.</p>
                        </div>
                    </div>
                    <div class="service-item animate-slide-left">
                        <div class="service-header">
                            <h3>Diseño</h3>
                            <button class="expand-btn">+</button>
                        </div>
                        <div class="service-content">
                            <p>Creamos experiencias visuales memorables que reflejan la esencia de tu marca y generan impacto.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Full Experience Section -->
    <div class="bsm-experience-wrapper">
    <section class="bsm-full-experience" data-bg="dark">
        <div class="container">
            <h2>CREAMOS UNA<br>EXPERIENCIA<br>DE MARCA<br>COMPLETA</h2>

            <div class="services-tags">
                <span class="tag tag-1">BRANDING</span>
                <span class="tag tag-2">NAMING</span>
                <span class="tag tag-3">PACKAGING</span>
                <span class="tag tag-4">SOCIAL MEDIA</span>
                <span class="tag tag-5">CAMPAÑAS CREATIVAS</span>
                <span class="tag tag-6">POSICIONAMIENTO</span>
                <span class="tag tag-7">MANUAL DE MARCA</span>
                <span class="tag tag-8">Y MÁS</span>
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
                    <h2>TRABAJAMOS CON CLIENTES<br>CON VISIÓN</h2>
                    <div class="bsm-work-track">
                        <!-- Item 1: Smart Blends -->
                        <div class="work-item">
                            <div class="work-image">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends.svg"
                                    alt="Smart Blends">
                            </div>
                            <div class="work-info">
                                <h3>Smart Blends</h3>
                                <p>Productos Saludables</p>
                                <div class="work-tags">
                                    <span class="tag">branding</span>
                                    <span class="tag">packaging</span>
                                </div>
                            </div>
                        </div>

                        <!-- Item 2: Organa -->
                        <div class="work-item">
                            <div class="work-image">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa.svg" 
                                    alt="Organa">
                            </div>
                            <div class="work-info">
                                <h3>Organa</h3>
                                <p>Retail</p>
                                <div class="work-tags">
                                    <span class="tag">naming</span>
                                    <span class="tag">branding</span>
                                </div>
                            </div>
                        </div>

                        <!-- Item 3: Garbachos -->
                        <div class="work-item">
                            <div class="work-image">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos.svg"
                                    alt="Garbachos">
                            </div>
                            <div class="work-info">
                                <h3>Garbachos</h3>
                                <p>Comestibles</p>
                                <div class="work-tags">
                                    <span class="tag">estrategia</span>
                                    <span class="tag">branding</span>
                                    <span class="tag">packaging</span>
                                </div>
                            </div>
                        </div>

                        <!-- Item 4: Smart Blends (Duplicate) -->
                        <div class="work-item">
                            <div class="work-image">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends.svg"
                                    alt="Smart Blends">
                            </div>
                            <div class="work-info">
                                <h3>Smart Blends</h3>
                                <p>Productos Saludables</p>
                                <div class="work-tags">
                                    <span class="tag">branding</span>
                                    <span class="tag">packaging</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bsm-testimonials" data-bg="dark">
        <div class="testimonials-sticky-wrapper">
            <div class="testimonials-collage">
                <!-- 1. Garbachos Bocas (Top Left Cropped) -->
                <div class="collage-item item-garbachos-bocas">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos-bocas.svg" alt="Garbachos Bocas">
                </div>

                <!-- 2. Tweet Garbachos (Top Left/Mid) -->
                <div class="collage-item item-tweet-garbachos">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/tweet1.png" alt="Tweet Garbachos">
                </div>
                
                <!-- 3. Garbachos Chela Poster (Mid Left) -->
                <div class="collage-item item-garbachos-chela">
                     <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/garbachos-chela.svg" alt="Garbachos Chela">
                </div>

                <!-- 4. Tweet CD (Top Center - Big) -->
                <div class="collage-item item-tweet-cd816">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/tweet2.png" alt="Tweet CD 816">
                </div>

                <!-- 5. Tweet Smart (Top Right) -->
                <div class="collage-item item-tweet-smart">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/tweet4.png" alt="Tweet Smart">
                </div>

                <!-- 6. Tweet Organa (Center/Mid) -->
                <div class="collage-item item-tweet-organa">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/tweet3.png" alt="Tweet Organa">
                </div>

                <!-- 7. Organa Leaf (Center Focus) -->
                <div class="collage-item item-organa-leaf">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa.svg" alt="Organa Leaf">
                </div>
                
                <!-- 8. Smart Yellow (Right Mid) -->
                <div class="collage-item item-smart-yellow">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends-carrusel.png" alt="Smart Blends Yellow">
                </div>

                <!-- 9. Organa Postres (Bottom Center/Left) -->
                <div class="collage-item item-organa-postres">
                     <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/organa-1.svg" alt="Organa Postres">
                </div>

                <!-- 10. Smart Storie (Bottom Right) -->
                <div class="collage-item item-smart-storie">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/smart-blends-storie.png" alt="Smart Blends Storie">
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
</main>

    <!-- Footer Section -->
    <footer class="bsm-footer">
        <div class="footer-top">
            <div class="footer-info-left">
                <div>LIMA, PERÚ</div>
            </div>
            
            <div class="footer-info-right">
                <div class="footer-socials">
                    <div>SÍGUENOS</div>
                    <a href="#" target="_blank">INSTAGRAM</a>
                    <a href="#" target="_blank">LINKEDIN</a>
                </div>
                <div class="footer-copyright">
                    ©BSM 2025
                </div>
            </div>
        </div>

        <div class="footer-logo">
             <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.svg" alt="BSM Logo">
        </div>
    </footer>
    
    <?php wp_footer(); ?>
</body>
</html>