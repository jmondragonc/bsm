<?php
/**
 * ACF Field Groups — BSM Child Theme
 * Se registran localmente y ACF los sincroniza a la BD.
 * Cada grupo usa tabs para organizar las secciones.
 */

if ( ! function_exists('acf_add_local_field_group') ) return;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD GROUP: HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
acf_add_local_field_group(array(
    'key'      => 'group_bsm_home',
    'title'    => 'Home — Contenido',
    'location' => array(array(array(
        'param'    => 'page_template',
        'operator' => '==',
        'value'    => 'front-page.php',
    ))),
    'menu_order'            => 0,
    'position'              => 'normal',
    'style'                 => 'seamless',
    'hide_on_screen'        => array('the_content', 'excerpt', 'discussion', 'comments', 'revisions', 'slug', 'author', 'format', 'page_attributes', 'featured_image', 'categories', 'tags', 'send-trackbacks'),
    'fields' => array(

        // ── TAB: HERO ───────────────────────────────────────────────────────
        array(
            'key'   => 'field_tab_hero',
            'label' => 'Hero',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_hero_titulo',
            'label'         => 'Título',
            'name'          => 'hero_titulo',
            'type'          => 'text',
            'instructions'  => 'Usa <br> para saltos de línea. Ej: CREAMOS MARCAS<br>PARA EL FUTURO',
            'default_value' => 'CREAMOS MARCAS<br>PARA EL FUTURO',
        ),

        // ── TAB: QUÉ HACEMOS ────────────────────────────────────────────────
        array(
            'key'   => 'field_tab_que_hacemos',
            'label' => '¿Qué hacemos?',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_qh_titulo',
            'label'         => 'Título',
            'name'          => 'qh_titulo',
            'type'          => 'text',
            'default_value' => '¿QUÉ HACEMOS?',
        ),
        array(
            'key'           => 'field_qh_subtitulo',
            'label'         => 'Subtítulo',
            'name'          => 'qh_subtitulo',
            'type'          => 'textarea',
            'rows'          => 2,
            'default_value' => 'Nos especializamos en transformar marcas con estrategia, diseño y comunicación.',
        ),
        array(
            'key'           => 'field_qh_servicios',
            'label'         => 'Servicios',
            'name'          => 'qh_servicios',
            'type'          => 'repeater',
            'min'           => 1,
            'max'           => 6,
            'layout'        => 'block',
            'button_label'  => 'Añadir servicio',
            'sub_fields'    => array(
                array(
                    'key'           => 'field_qh_servicio_nombre',
                    'label'         => 'Nombre',
                    'name'          => 'nombre',
                    'type'          => 'text',
                    'column_width'  => 30,
                ),
                array(
                    'key'           => 'field_qh_servicio_desc',
                    'label'         => 'Descripción',
                    'name'          => 'descripcion',
                    'type'          => 'textarea',
                    'rows'          => 3,
                    'column_width'  => 70,
                ),
            ),
        ),

        // ── TAB: EXPERIENCIA COMPLETA ────────────────────────────────────────
        array(
            'key'   => 'field_tab_experiencia',
            'label' => 'Experiencia de marca',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_exp_titulo',
            'label'         => 'Título',
            'name'          => 'exp_titulo',
            'type'          => 'text',
            'instructions'  => 'Usa <br> para saltos de línea.',
            'default_value' => 'CREAMOS UNA<br>EXPERIENCIA<br>DE MARCA<br>COMPLETA',
        ),
        array(
            'key'           => 'field_exp_tags',
            'label'         => 'Tags de servicios',
            'name'          => 'exp_tags',
            'type'          => 'repeater',
            'min'           => 1,
            'layout'        => 'table',
            'button_label'  => 'Añadir tag',
            'sub_fields'    => array(
                array(
                    'key'   => 'field_exp_tag_texto',
                    'label' => 'Tag',
                    'name'  => 'texto',
                    'type'  => 'text',
                ),
            ),
        ),

        // ── TAB: WORK / PROYECTOS ────────────────────────────────────────────
        array(
            'key'   => 'field_tab_work',
            'label' => 'Work',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_work_titulo',
            'label'         => 'Título sección',
            'name'          => 'work_titulo',
            'type'          => 'text',
            'instructions'  => 'Usa <br> para saltos de línea.',
            'default_value' => 'TRABAJAMOS CON CLIENTES<br>CON VISIÓN',
        ),
        array(
            'key'           => 'field_work_proyectos',
            'label'         => 'Proyectos a mostrar',
            'name'          => 'work_proyectos',
            'type'          => 'relationship',
            'instructions'  => 'Selecciona los proyectos en el orden que deben aparecer.',
            'post_type'     => array('proyecto'),
            'filters'       => array('search'),
            'min'           => 1,
            'max'           => 8,
            'return_format' => 'object',
        ),

        // ── TAB: RECONOCIMIENTOS ─────────────────────────────────────────────
        array(
            'key'   => 'field_tab_reconocimientos',
            'label' => 'Reconocimientos',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_rec_titulo',
            'label'         => 'Título sección',
            'name'          => 'rec_titulo',
            'type'          => 'text',
            'default_value' => 'RECONOCIMIENTOS:',
        ),
        array(
            'key'           => 'field_rec_slides',
            'label'         => 'Testimonios',
            'name'          => 'rec_slides',
            'type'          => 'repeater',
            'min'           => 1,
            'layout'        => 'block',
            'button_label'  => 'Añadir testimonio',
            'sub_fields'    => array(
                array(
                    'key'           => 'field_rec_logo',
                    'label'         => 'Logo cliente',
                    'name'          => 'logo',
                    'type'          => 'image',
                    'return_format' => 'array',
                    'preview_size'  => 'medium',
                    'instructions'  => 'SVG, PNG o WebP recomendado.',
                ),
                array(
                    'key'   => 'field_rec_quote',
                    'label' => 'Cita',
                    'name'  => 'quote',
                    'type'  => 'textarea',
                    'rows'  => 3,
                ),
                array(
                    'key'   => 'field_rec_autor',
                    'label' => 'Nombre',
                    'name'  => 'autor',
                    'type'  => 'text',
                ),
                array(
                    'key'   => 'field_rec_cargo',
                    'label' => 'Cargo',
                    'name'  => 'cargo',
                    'type'  => 'text',
                ),
            ),
        ),

        // ── TAB: ABOUT (futuro) ─────────────────────────────────────────────
        // Reservado para Fase 2

        // ── TAB: FOOTER ──────────────────────────────────────────────────────
        array(
            'key'   => 'field_tab_footer',
            'label' => 'Footer',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_footer_ciudad',
            'label'         => 'Ciudad',
            'name'          => 'footer_ciudad',
            'type'          => 'text',
            'default_value' => 'LIMA, PERÚ',
        ),
        array(
            'key'           => 'field_footer_anio',
            'label'         => 'Año',
            'name'          => 'footer_anio',
            'type'          => 'text',
            'default_value' => '©BSM 2025',
        ),
        array(
            'key'           => 'field_footer_redes',
            'label'         => 'Redes sociales',
            'name'          => 'footer_redes',
            'type'          => 'repeater',
            'layout'        => 'table',
            'button_label'  => 'Añadir red',
            'sub_fields'    => array(
                array(
                    'key'   => 'field_footer_red_nombre',
                    'label' => 'Nombre',
                    'name'  => 'nombre',
                    'type'  => 'text',
                ),
                array(
                    'key'   => 'field_footer_red_url',
                    'label' => 'URL',
                    'name'  => 'url',
                    'type'  => 'url',
                ),
            ),
        ),

    ), // end fields
));

// ─────────────────────────────────────────────────────────────────────────────
// FIELD GROUP: PROYECTO (CPT)
// ─────────────────────────────────────────────────────────────────────────────
acf_add_local_field_group(array(
    'key'      => 'group_bsm_proyecto',
    'title'    => 'Proyecto — Contenido',
    'location' => array(array(array(
        'param'    => 'post_type',
        'operator' => '==',
        'value'    => 'proyecto',
    ))),
    'menu_order'     => 0,
    'position'       => 'normal',
    'style'          => 'seamless',
    'hide_on_screen' => array('the_content', 'excerpt', 'discussion', 'comments', 'revisions', 'author', 'format', 'send-trackbacks'),
    'fields' => array(

        // ── TAB: GENERAL ────────────────────────────────────────────────────
        array(
            'key'   => 'field_proy_tab_general',
            'label' => 'General',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'          => 'field_proy_titulo_pagina',
            'label'        => 'Título de la página',
            'name'         => 'proyecto_titulo_pagina',
            'type'         => 'text',
            'instructions' => 'Título grande que aparece sobre el hero. Usa <br> para saltos de línea. Ej: ORGANA: LA MARCA<br>QUE ESPERABAS',
        ),
        array(
            'key'           => 'field_proy_imagen_card',
            'label'         => 'Imagen para el card (home)',
            'name'          => 'proyecto_imagen_card',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'medium',
            'instructions'  => 'Imagen cuadrada que aparece en el carrusel del home. SVG, WebP o PNG.',
        ),
        array(
            'key'          => 'field_proy_categoria',
            'label'        => 'Categoría',
            'name'         => 'proyecto_categoria',
            'type'         => 'text',
            'instructions' => 'Ej: Productos Saludables / Retail',
        ),
        array(
            'key'          => 'field_proy_tags',
            'label'        => 'Tags (card home)',
            'name'         => 'proyecto_tags',
            'type'         => 'repeater',
            'layout'       => 'table',
            'button_label' => 'Añadir tag',
            'sub_fields'   => array(
                array(
                    'key'   => 'field_proy_tag_texto',
                    'label' => 'Tag',
                    'name'  => 'texto',
                    'type'  => 'text',
                ),
            ),
        ),

        // ── TAB: HERO ───────────────────────────────────────────────────────
        array(
            'key'   => 'field_proy_tab_hero',
            'label' => 'Hero',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'           => 'field_proy_hero_imagen',
            'label'         => 'Imagen hero',
            'name'          => 'proyecto_hero_imagen',
            'type'          => 'image',
            'return_format' => 'array',
            'preview_size'  => 'large',
            'instructions'  => 'Imagen de ancho completo. JPG, WebP o AVIF recomendado.',
        ),

        // ── TAB: INFO ───────────────────────────────────────────────────────
        array(
            'key'   => 'field_proy_tab_info',
            'label' => 'Info del proyecto',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'          => 'field_proy_cliente',
            'label'        => 'Nombre del cliente',
            'name'         => 'proyecto_cliente',
            'type'         => 'text',
            'instructions' => 'Ej: Organa',
        ),
        array(
            'key'          => 'field_proy_cat_anio',
            'label'        => 'Categoría y año',
            'name'         => 'proyecto_cat_anio',
            'type'         => 'text',
            'instructions' => 'Ej: RETAIL. 2020',
        ),
        array(
            'key'          => 'field_proy_tags_interna',
            'label'        => 'Tags (página interna)',
            'name'         => 'proyecto_tags_interna',
            'type'         => 'repeater',
            'layout'       => 'table',
            'button_label' => 'Añadir tag',
            'sub_fields'   => array(
                array(
                    'key'   => 'field_proy_tag_interna_texto',
                    'label' => 'Tag',
                    'name'  => 'texto',
                    'type'  => 'text',
                ),
            ),
        ),
        array(
            'key'          => 'field_proy_descripcion',
            'label'        => 'Descripción corta',
            'name'         => 'proyecto_descripcion',
            'type'         => 'textarea',
            'rows'         => 4,
            'instructions' => 'Texto visible antes del acordeón "Seguir leyendo".',
        ),
        array(
            'key'          => 'field_proy_acordeon',
            'label'        => 'Texto acordeón (Seguir leyendo)',
            'name'         => 'proyecto_acordeon',
            'type'         => 'textarea',
            'rows'         => 5,
            'instructions' => 'Texto que se despliega al hacer clic en "Seguir leyendo".',
        ),

        // ── TAB: GALERÍA ────────────────────────────────────────────────────
        array(
            'key'   => 'field_proy_tab_galeria',
            'label' => 'Galería',
            'name'  => '',
            'type'  => 'tab',
        ),
        array(
            'key'          => 'field_proy_filas',
            'label'        => 'Filas de galería',
            'name'         => 'proyecto_filas',
            'type'         => 'repeater',
            'instructions' => 'Cada fila puede ser de 1 bloque (ancho completo) o 2 bloques en columnas.',
            'layout'       => 'block',
            'button_label' => 'Añadir fila',
            'sub_fields'   => array(

                array(
                    'key'           => 'field_proy_fila_layout',
                    'label'         => 'Layout de la fila',
                    'name'          => 'fila_layout',
                    'type'          => 'radio',
                    'choices'       => array(
                        'full' => '1 columna (ancho completo)',
                        'half' => '2 columnas (50 / 50)',
                    ),
                    'default_value' => 'full',
                    'layout'        => 'horizontal',
                ),

                array(
                    'key'          => 'field_proy_fila_bloques',
                    'label'        => 'Bloques',
                    'name'         => 'fila_bloques',
                    'type'         => 'repeater',
                    'instructions' => 'Si el layout es "1 columna" usa solo 1 bloque. Si es "2 columnas" usa exactamente 2.',
                    'min'          => 1,
                    'max'          => 2,
                    'layout'       => 'block',
                    'button_label' => 'Añadir bloque',
                    'sub_fields'   => array(

                        array(
                            'key'           => 'field_proy_bloque_tipo',
                            'label'         => 'Tipo de contenido',
                            'name'          => 'bloque_tipo',
                            'type'          => 'select',
                            'choices'       => array(
                                'imagen'         => 'Imagen / GIF',
                                'video_mp4'      => 'Video MP4',
                                'video_vimeo'    => 'Video Vimeo',
                                'video_youtube'  => 'Video YouTube',
                            ),
                            'default_value' => 'imagen',
                        ),

                        array(
                            'key'           => 'field_proy_bloque_imagen',
                            'label'         => 'Imagen / GIF',
                            'name'          => 'bloque_imagen',
                            'type'          => 'image',
                            'return_format' => 'array',
                            'preview_size'  => 'medium',
                            'instructions'  => 'JPG, PNG, WebP, AVIF o GIF animado.',
                            'conditional_logic' => array(array(array(
                                'field'    => 'field_proy_bloque_tipo',
                                'operator' => '==',
                                'value'    => 'imagen',
                            ))),
                        ),

                        array(
                            'key'           => 'field_proy_bloque_video_mp4',
                            'label'         => 'Archivo MP4',
                            'name'          => 'bloque_video_mp4',
                            'type'          => 'file',
                            'return_format' => 'array',
                            'mime_types'    => 'mp4,webm',
                            'instructions'  => 'Archivo de video MP4 o WebM.',
                            'conditional_logic' => array(array(array(
                                'field'    => 'field_proy_bloque_tipo',
                                'operator' => '==',
                                'value'    => 'video_mp4',
                            ))),
                        ),

                        array(
                            'key'          => 'field_proy_bloque_video_url',
                            'label'        => 'URL del video (Vimeo o YouTube)',
                            'name'         => 'bloque_video_url',
                            'type'         => 'url',
                            'instructions' => 'Pega la URL del video. Ej: https://vimeo.com/123456 o https://youtu.be/ABC123',
                            'conditional_logic' => array(array(array(
                                'field'    => 'field_proy_bloque_tipo',
                                'operator' => '==',
                                'value'    => 'video_vimeo',
                            )), array(array(
                                'field'    => 'field_proy_bloque_tipo',
                                'operator' => '==',
                                'value'    => 'video_youtube',
                            ))),
                        ),

                    ),
                ),

            ),
        ),

    ), // end fields
));
