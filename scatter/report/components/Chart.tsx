import {Result} from '@/type'
import {ScatterChart} from '@/components/charts/ScatterChart'
import {SunburstChart} from '@/components/charts/SunburstChart'
import {TreemapChart} from '@/components/charts/TreemapChart'
import {Box} from '@chakra-ui/react'

type ReportProps = {
  result: Result
  rootLevel: number
  selectedChart: string
}

export function Chart({result, rootLevel, selectedChart}: ReportProps) {
  return (
    <Box mx={'auto'} w={'100%'} maxW={'1200px'}>
      <Box h={'500px'} mb={5}>
        {selectedChart === 'scatter' && (
          <ScatterChart clusterList={result.clusters} argumentList={result.arguments} rootLevel={rootLevel} />
        )}
        {selectedChart === 'sunburst' && (
          <SunburstChart clusterList={result.clusters} rootLevel={rootLevel}  />
        )}
        {selectedChart === 'treemap' && (
          <TreemapChart clusterList={result.clusters} rootLevel={rootLevel}  />
        )}
      </Box>
    </Box>
  )
}
