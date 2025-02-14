import {useCallback, useMemo} from 'react'
import {colorPalettes} from './useColorPalettes'

const useClusterColor = (clusterIds: string[], palette: string[] = colorPalettes.default) => {
  const mapping = useMemo(() => {
    const map: { [key: string]: string } = {}
    clusterIds.forEach((id, i) => {
      map[id] = palette[i % palette.length]
    })
    return map
  }, [clusterIds])
  return useCallback(
    (id: string, onlyCluster?: string) =>
      onlyCluster && onlyCluster !== id ? 'lightgray' : mapping[id],
    [mapping]
  )
}

export type ColorFunc = ReturnType<typeof useClusterColor>

export default useClusterColor
