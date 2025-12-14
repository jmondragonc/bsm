<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'bsm');

/** Database username */
define('DB_USER', 'root');

/** Database password */
define('DB_PASSWORD', 'root');

/** Database hostname */
define('DB_HOST', 'localhost');

/** Database charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The database collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'V&+PD{pf?(oH[/xbh+X#I_klA.mRRI5B{p2muLOYxL7@4/N|FEP n1p75nmsje@P');
define('SECURE_AUTH_KEY', 'F4iwt.O1_v*CWJ-^Sb#am#VXF[+F;Mjq-oaKGTc,|aQ7 xH`pR%&jhfdj)?X>@;`');
define('LOGGED_IN_KEY', 's-a:Nj1VXhLTa!7-FTuy{KghO1!Ulg+-T5(&zR9|=0w2-KK81e<uygMYq#Jr)/7@');
define('NONCE_KEY', '-]g: ny%pJ-t%R62ES+2V*|i;Ru;E.D-:mS6XfWRRX O1Gp}Kt&.bx&9>+Fio|gA');
define('AUTH_SALT', 'JaQ&r-As>|#/D!{Ckg]R:Q_QD>*HC@]zaklU+P<M/Y]6*2[H[6BY^)9U&FGZp-k{');
define('SECURE_AUTH_SALT', 'Ls/!8`>%P.];4,HVwnfaptGJ,?{,ij~zc^{}la#SkI/JfN]y,%2[0,0D#a)te/WT');
define('LOGGED_IN_SALT', 'H}<xIr&%(FCQDk?athh?u*Vj/bX=#SGgPlqWc#dz.b_Ye-fT,&h3eHP6+OJ.O!(h');
define('NONCE_SALT', '6Y;]PYe_-*RGTcH @Dqn+[3i%<*A/W;VqDP6DJ=jC]J58%~O)eV*UF,mpc3f;I8%');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define('WP_DEBUG', false);

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH')) {
	define('ABSPATH', __DIR__ . '/');
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';