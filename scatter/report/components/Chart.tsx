'use client'

import {Result} from '@/type'
import {ScatterChart} from '@/components/charts/ScatterChart'
import {SunburstChart} from '@/components/charts/SunburstChart'
import {TreemapChart} from '@/components/charts/TreemapChart'
import {useState} from 'react'
import {Box} from '@chakra-ui/react'
import {SelectChartButton} from '@/components/charts/SelectChartButton'

type ReportProps = {
  result: Result
  rootLevel: number
  onClickSettingAction: () => void
}

export function Chart({result, rootLevel, onClickSettingAction}: ReportProps) {
  const [selectedChart, setSelectedChart] = useState('scatter')
  return (
    <Box mx={'auto'} w={'100%'} maxW={'1200px'} mb={10}>
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
      <Box display={'flex'} justifyContent={'center'}>
        <SelectChartButton
          selected={selectedChart}
          onChange={setSelectedChart}
          onClickSetting={onClickSettingAction}
        />
      </Box>
    </Box>
  )
}
