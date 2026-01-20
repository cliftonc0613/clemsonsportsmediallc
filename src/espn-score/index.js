/**
 * ESPN Game Score Block
 *
 * Registers the ESPN Game Score block for embedding Clemson game scoreboards
 * in WordPress posts and pages.
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

// Import editor styles
import './editor.css';

/**
 * Register the block
 */
registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save,
});
