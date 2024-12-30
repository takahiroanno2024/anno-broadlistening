// Color palettes for different color vision types
// Based on ColorBrewer's colorblind-safe qualitative schemes and scientific research

// Type for palette names
export type PaletteType = 'default' | 'colorUniversal' | 'proto' | 'deutero' | 'trito';

// Export palette names in Japanese for UI
export const paletteNames: Record<PaletteType, string> = {
  default: 'デフォルト',
  colorUniversal: 'カラーユニバーサル',
  proto: '第一色覚',
  deutero: '第二色覚',
  trito: '第三色覚',
};

// Color palettes optimized for different types of color vision
export const colorPalettes: Record<PaletteType, string[]> = {
  // Default palette - existing colors from the application
  default: [
    '#8a2be2', '#ff69b4', '#1e90ff', '#32cd32', '#ffa500', '#ff6347',
    '#4169e1', '#9370db', '#3cb371', '#ff7f50', '#6a5acd', '#7b68ee',
    '#00fa9a', '#ff4500', '#da70d6', '#1e90ff', '#db7093', '#32cd32',
    '#ff8c00', '#ba55d3', '#87ceeb', '#20b2aa', '#ff69b4', '#cd5c5c',
    '#4682b4', '#9acd32', '#fa8072', '#7b68ee', '#66cdaa', '#dda0dd'
  ],

  // Color Universal Design - Based on ColorBrewer's colorblind-safe palette
  // Extended with additional scientifically validated colors
  colorUniversal: [
    '#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00',
    '#F0E442', '#999999', '#7570B3', '#E6AB02', '#66A61E', '#A6761D',
    '#1B9E77', '#D95F02', '#7570B3', '#E7298A', '#66A61E', '#E6AB02',
    '#A6761D', '#666666', '#E41A1C', '#377EB8', '#4DAF4A', '#984EA3',
    '#FF7F00', '#FFFF33', '#A65628', '#F781BF', '#B3B3B3', '#1A1A1A'
  ],

  // Protanopia (red-blind) optimized palette
  // Uses blues, yellows, and high contrast combinations
  proto: [
    '#0072B2', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#999999',
    '#CC79A7', '#7570B3', '#E6AB02', '#66A61E', '#A6761D', '#1B9E77',
    '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00', '#FFFF33', '#666666',
    '#B3B3B3', '#1A1A1A', '#0000FF', '#FFD700', '#00FFFF', '#FFB6C1',
    '#87CEEB', '#DEB887', '#B8860B', '#BDB76B', '#E6E6FA', '#778899'
  ],

  // Deuteranopia (green-blind) optimized palette
  // Emphasizes blue-yellow contrast
  deutero: [
    '#0072B2', '#E69F00', '#56B4E9', '#CC79A7', '#F0E442', '#999999',
    '#7570B3', '#E6AB02', '#A6761D', '#1B9E77', '#D95F02', '#377EB8',
    '#984EA3', '#FF7F00', '#FFFF33', '#666666', '#B3B3B3', '#1A1A1A',
    '#0000FF', '#FFD700', '#00FFFF', '#FFB6C1', '#87CEEB', '#DEB887',
    '#B8860B', '#BDB76B', '#E6E6FA', '#778899', '#4682B4', '#DDA0DD'
  ],

  // Tritanopia (blue-blind) optimized palette
  // Focuses on red-green contrast
  trito: [
    '#E41A1C', '#4DAF4A', '#984EA3', '#FF7F00', '#E69F00', '#56B4E9',
    '#009E73', '#CC79A7', '#F0E442', '#999999', '#7570B3', '#E6AB02',
    '#66A61E', '#A6761D', '#1B9E77', '#D95F02', '#377EB8', '#666666',
    '#B3B3B3', '#1A1A1A', '#DC143C', '#32CD32', '#FF4500', '#2E8B57',
    '#8B0000', '#006400', '#FF8C00', '#B22222', '#228B22', '#CD853F'
  ]
};
