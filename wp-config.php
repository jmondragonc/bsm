<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bsm' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

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
define( 'AUTH_KEY',          'oDY^ZrZDfuvy975jL=@)4kZPxS{!8*^!B5JS88BS9cL]Y!Xvy5hPKxLY);2:YQ1Q' );
define( 'SECURE_AUTH_KEY',   'z/^EOj&}7C2jBC2O(bjV][PgZG|K[pKPUqk.K}YROv4T?S}qaP-hj<Gq kvy|Ox#' );
define( 'LOGGED_IN_KEY',     'XCvVq1!|0E@K?_ Zks%e.TN~cM}fF.]EB8OH3DRLq/Dbyf<-~:InZI$Z$:c_pD51' );
define( 'NONCE_KEY',         'XD@]Xl,$txxtJzw-k/Ied34K,v*;Gwvj][aA8?FkB&kZndkxPxJ9d*$Lw.S}->][' );
define( 'AUTH_SALT',         '/!h1@Z6Je,{8~6evF6Wjen&jCAz2N`vqDZ<*Lc5+TU*J(K0YR+w^K1H.n1ed&k@ ' );
define( 'SECURE_AUTH_SALT',  'L:H|LoDeUcF[.go.s ?AS8;|s4]=B%(WL n1@b~d&0NJD^T|m3yjziB:~>tS_1@D' );
define( 'LOGGED_IN_SALT',    ',&6p}p-u$)fkAx:GT^CbGw>Ig9nsN>jc`Fop5oE%9)Lxt0f;)sbp*2AHA4Xtr*,G' );
define( 'NONCE_SALT',        '$0+Blv3Gtb@.OG&K=~*hk<xw!`zO$e7ZChW`Vje&B~=FC%x{Y!u-N~6:dZ9e%<`i' );
define( 'WP_CACHE_KEY_SALT', '*-diV;R.CfeZ]48|-sm2D1/-;{cXD1IX>$NK{{~BBZ)8)*JA(M0$.wMy9tw0yX&b' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



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
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
