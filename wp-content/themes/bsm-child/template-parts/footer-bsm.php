<?php
// Siempre leer los campos del Home (post ID de front page)
$home_id = get_option('page_on_front') ?: 8;

$ciudad   = get_field('footer_ciudad',   $home_id) ?: 'LIMA, PERÚ';
$anio     = get_field('footer_anio',     $home_id) ?: '©BSM 2026';
$siguenos = get_field('footer_siguenos', $home_id) ?: 'SÍGUENOS';
$redes    = get_field('footer_redes',    $home_id) ?: array(
    array('nombre' => 'INSTAGRAM', 'url' => '#'),
    array('nombre' => 'LINKEDIN',  'url' => '#'),
);
$logo     = get_field('footer_logo', $home_id);
?>
<div class="bsm-footer-sticky-wrapper">
<footer class="bsm-footer">
    <div class="footer-top">
        <div class="footer-info-left">
            <div><?php echo esc_html($ciudad); ?></div>
        </div>
        <div class="footer-info-right">
            <div class="footer-socials">
                <div><?php echo esc_html($siguenos); ?></div>
                <?php foreach ($redes as $red) : ?>
                <a href="<?php echo esc_url($red['url']); ?>" target="_blank"><?php echo esc_html($red['nombre']); ?></a>
                <?php endforeach; ?>
            </div>
            <div class="footer-copyright">
                <?php echo esc_html($anio); ?>
            </div>
        </div>
    </div>
    <div class="footer-logo">
        <?php if ($logo) : ?>
            <img src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($logo['alt'] ?: 'BSM Logo'); ?>">
        <?php else : ?>
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.svg" alt="BSM Logo">
        <?php endif; ?>
    </div>
</footer>
</div><!-- /.bsm-footer-sticky-wrapper -->
