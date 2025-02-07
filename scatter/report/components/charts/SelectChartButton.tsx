import {RadioCardItem, RadioCardRoot} from '@/components/ui/radio-card'
import {Button, HStack, Icon, useBreakpointValue} from '@chakra-ui/react'
import {
  ChartScatterIcon, CogIcon,
  LifeBuoyIcon,
  SquareSquareIcon
} from 'lucide-react'
import React from 'react'

type Props = {
  selected: string
  onChange: (value: string) => void
  onClickSetting: () => void
}

export function SelectChartButton({selected, onChange, onClickSetting}: Props) {
  return (
    <HStack w={'100%'} justify={'center'} align={'center'}>
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
      <Button onClick={onClickSetting} variant={'outline'} h={'50px'} display={'none'}>
        <Icon><CogIcon /></Icon>
      </Button>
    </HStack>
  )
}
