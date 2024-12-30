import {useCallback, useMemo, useState} from 'react'

// Color palettes optimized for different types of color vision
export const colorPalettes = {
  // Original palette
  default: [
    '#8a2be2', // Purple
    '#ff69b4', // Pink
    '#1e90ff', // Blue
    '#008080', // Teal
    '#0000cd', // Medium-Blue
    '#cdcd00', // Yellow
    '#ffa500', // Orange
    '#ff0000', // Red
    '#008000', // Green
    '#ff4500', // Orange-Red
    '#32cd32', // Lime Green
    '#ff1493', // Deep Pink
    '#9932cc', // Dark Orchid
    '#20b2aa', // Light Sea Green
    '#ff6347', // Tomato
    '#4169e1', // Royal Blue
    '#2e8b57', // Sea Green
    '#8b4513', // Saddle Brown
    '#7c2e69', // Prune
    '#ffd700', // Gold
    '#4b0082', // Indigo
    '#ff8c00', // Dark Orange
    '#dc143c', // Crimson
    '#556b2f', // Dark Olive Green
  ],
  // Okabe-Ito color scheme - optimized for color vision deficiencies
  colorBlindSafe: [
    '#E69F00', // Orange
    '#56B4E9', // Sky Blue
    '#009E73', // Bluish Green
    '#F0E442', // Yellow
    '#0072B2', // Blue
    '#D55E00', // Vermillion
    '#CC79A7', // Reddish Purple
    '#000000', // Black
    '#999999', // Gray
    '#44AA99', // Teal
    '#117733', // Dark Green
    '#882255', // Wine
    '#88CCEE', // Light Blue
    '#DDCC77', // Sand
    '#AA4499', // Purple
    '#44AA99', // Turquoise
    '#999933', // Olive
    '#CC6677', // Rose
    '#AA4466', // Burgundy
    '#4477AA', // Steel Blue
    '#228833', // Forest Green
    '#CCBB44', // Mustard
    '#66CCEE', // Light Cyan
    '#AA3377', // Magenta
  ],
  // Deuteranopia-friendly palette (red-green color blindness)
  deuteranopia: [
    '#004488', // Dark Blue
    '#DDAA33', // Gold
    '#BB5566', // Red
    '#000000', // Black
    '#99DDFF', // Light Blue
    '#EE7733', // Orange
    '#FFEE33', // Yellow
    '#77CCDD', // Cyan
    '#AA3377', // Magenta
    '#0077BB', // Blue
    '#EE3377', // Pink
    '#33BBEE', // Sky Blue
    '#CC3311', // Dark Red
    '#EE7733', // Coral
    '#00BBFF', // Azure
    '#BBBBBB', // Gray
    '#555555', // Dark Gray
    '#44BB99', // Turquoise
    '#99DDFF', // Pale Blue
    '#FFCC00', // Amber
    '#CC6677', // Rose
    '#882255', // Wine
    '#44AA88', // Sea Green
    '#117733', // Forest Green
  ],
  // Protanopia-friendly palette (red-green color blindness)
  protanopia: [
    '#015C92', // Navy Blue
    '#FFB300', // Amber
    '#353535', // Dark Gray
    '#71C7EC', // Light Blue
    '#FFD700', // Gold
    '#2D82B5', // Steel Blue
    '#88CCEE', // Sky Blue
    '#999933', // Olive
    '#EE7733', // Orange
    '#0077BB', // Blue
    '#EE3377', // Pink
    '#33BBEE', // Cyan
    '#CC3311', // Red
    '#BBBBBB', // Gray
    '#555555', // Charcoal
    '#44BB99', // Turquoise
    '#99DDFF', // Pale Blue
    '#FFCC00', // Yellow
    '#CC6677', // Rose
    '#882255', // Burgundy
    '#44AA88', // Teal
    '#117733', // Green
    '#DDCC77', // Tan
    '#AA4499', // Purple
  ],
  // Tritanopia-friendly palette (blue-yellow color blindness)
  tritanopia: [
    '#EE7733', // Orange
    '#0077BB', // Blue
    '#EE3377', // Pink
    '#33BBEE', // Sky Blue
    '#CC3311', // Red
    '#009988', // Teal
    '#882255', // Wine
    '#BBBBBB', // Gray
    '#555555', // Dark Gray
    '#44BB99', // Turquoise
    '#99DDFF', // Pale Blue
    '#FFCC00', // Yellow
    '#CC6677', // Rose
    '#AA4466', // Burgundy
    '#4477AA', // Steel Blue
    '#228833', // Forest Green
    '#CCBB44', // Mustard
    '#66CCEE', // Light Cyan
    '#AA3377', // Magenta
    '#117733', // Dark Green
    '#332288', // Indigo
    '#DDCC77', // Sand
    '#999933', // Olive
    '#882255', // Plum
  ]
};

// Default colors array for backward compatibility
const colors: string[] = [...colorPalettes.default];

const useClusterColor = (clusterIds: string[], initialPalette: keyof typeof colorPalettes = 'default') => {
  const [currentPalette, setCurrentPalette] = useState<keyof typeof colorPalettes>(initialPalette);
  const selectedPalette = colorPalettes[currentPalette];
  
  const mapping = useMemo(() => {
    const map: { [key: string]: string } = {}
    clusterIds.forEach((id, i) => {
      map[id] = selectedPalette[i % selectedPalette.length]
    })
    return map
  }, [clusterIds, selectedPalette])

  const colorFunc = useCallback(
    (id: string, onlyCluster?: string, palette?: keyof typeof colorPalettes) => {
      if (palette && palette !== currentPalette) {
        setCurrentPalette(palette);
      }
      return onlyCluster && onlyCluster !== id ? 'lightgray' : mapping[id];
    },
    [mapping, currentPalette]
  )

  return colorFunc;
}

export type ColorFunc = ReturnType<typeof useClusterColor>

export default useClusterColor
