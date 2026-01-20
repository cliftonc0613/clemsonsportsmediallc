<?php
/**
 * Register Custom Gutenberg Blocks
 *
 * @package starter-wp-theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register custom Gutenberg blocks
 */
function starter_theme_register_blocks() {
	// Check if blocks directory exists
	$blocks_dir = get_template_directory() . '/blocks';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	// Register ESPN Score block with render callback
	$espn_score_block = $blocks_dir . '/espn-score';

	if ( is_dir( $espn_score_block ) && file_exists( $espn_score_block . '/block.json' ) ) {
		register_block_type(
			$espn_score_block,
			array(
				'render_callback' => 'starter_theme_espn_score_render',
			)
		);
	}
}
add_action( 'init', 'starter_theme_register_blocks' );

/**
 * Render callback for ESPN Score block
 *
 * Outputs data attributes for Next.js frontend to parse and render
 *
 * @param array $attributes Block attributes.
 * @return string HTML output with data attributes.
 */
function starter_theme_espn_score_render( $attributes ) {
	$sport     = esc_attr( $attributes['sport'] ?? 'football' );
	$season    = esc_attr( $attributes['season'] ?? '' );
	$game_id   = esc_attr( $attributes['gameId'] ?? 'latest' );
	$title     = esc_attr( $attributes['title'] ?? '' );
	$name_style = esc_attr( $attributes['nameStyle'] ?? 'short' );

	return sprintf(
		'<div class="wp-block-espn-score" data-espn-score="true" data-sport="%s" data-season="%s" data-game-id="%s" data-title="%s" data-name-style="%s"></div>',
		$sport,
		$season,
		$game_id,
		$title,
		$name_style
	);
}

/**
 * Enqueue block editor assets
 *
 * Load additional scripts and styles for the block editor
 */
function starter_theme_block_editor_assets() {
	// Enqueue Google Fonts for Oswald in editor
	wp_enqueue_style(
		'starter-theme-block-editor-fonts',
		'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
		array(),
		null
	);
}
add_action( 'enqueue_block_editor_assets', 'starter_theme_block_editor_assets' );

/**
 * Add custom block category for theme blocks
 *
 * @param array $categories Existing block categories.
 * @return array Modified block categories.
 */
function starter_theme_block_categories( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'starter-theme',
				'title' => __( 'Clemson Sports Media', 'starter-wp-theme' ),
				'icon'  => 'awards',
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'starter_theme_block_categories', 10, 1 );
