/**
 * Search Configuration
 *
 * Configurable search settings for the starter theme.
 * Developers can customize which content types are searchable.
 */

export interface SearchableType {
  type: 'post' | 'page' | 'service';
  label: string;
  icon: string; // Lucide icon name
  enabled: boolean;
}

/**
 * Default searchable content types.
 * Modify this array to customize what content is searchable.
 */
export const SEARCHABLE_TYPES: SearchableType[] = [
  { type: 'post', label: 'Blog Posts', icon: 'FileText', enabled: true },
  { type: 'page', label: 'Pages', icon: 'File', enabled: true },
  { type: 'service', label: 'Services', icon: 'Briefcase', enabled: true },
];

/**
 * Get enabled search types
 */
export function getEnabledSearchTypes(): SearchableType[] {
  return SEARCHABLE_TYPES.filter(t => t.enabled);
}

/**
 * Get search type by key
 */
export function getSearchType(type: string): SearchableType | undefined {
  return SEARCHABLE_TYPES.find(t => t.type === type);
}
