import {RadioCardItem, RadioCardRoot} from '@/components/ui/radio-card'
import {Button, HStack, Icon, useBreakpointValue} from '@chakra-ui/react'
import {
  ChartScatterIcon, CogIcon,
  LifeBuoyIcon,
  SquareSquareIcon
} from 'lucide-react'
import React from 'react'
import {Tooltip} from '@/components/ui/tooltip'

type Props = {
  selected: string
  onChange: (value: string) => void
  onClickSetting: () => void
  isApplyFilter: boolean
}

export function SelectChartButton({selected, onChange, onClickSetting, isApplyFilter}: Props) {
  return (
    <HStack w={'100%'} justify={'center'} align={'center'} mb={10}>
      <RadioCardRoot
        orientation="horizontal"
        align="center"
        justify="center"
        w={'100%'}
        maxW={'xl'}
        size={'sm'}
        display={'block'}
        value={selected}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        colorPalette={'cyan'}
      >
        <HStack align={'stretch'}>
          <RadioCardItem
            value={'scatter'}
            label={useBreakpointValue({ base: '', md: '散布図' })}
            indicator={false}
            icon={<Icon><ChartScatterIcon /></Icon>}
            cursor={'pointer'}
          />
          <RadioCardItem
            value={'sunburst'}
            label={useBreakpointValue({ base: '', md: 'サンバースト' })}
            indicator={false}
            icon={<Icon><LifeBuoyIcon /></Icon>}
            cursor={'pointer'}
          />
          <RadioCardItem
            value={'treemap'}
            label={useBreakpointValue({ base: '', md: 'ツリーマップ' })}
            indicator={false}
            icon={<Icon><SquareSquareIcon /></Icon>}
            cursor={'pointer'}
          />
        </HStack>
      </RadioCardRoot>
      <Tooltip content={isApplyFilter ? '表示クラスター設定が有効です' : '表示クラスター設定'} openDelay={0} closeDelay={0}>
        <Button
          onClick={onClickSetting}
          variant={isApplyFilter ? 'solid' : 'outline'}
          h={'50px'}
        >
          <Icon><CogIcon /></Icon>
        </Button>
      </Tooltip>
    </HStack>
  )
}
