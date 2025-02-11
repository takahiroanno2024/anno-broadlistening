import {Box, Button, Text, VStack} from '@chakra-ui/react'
import React, {useState} from 'react'
import {NativeSelectField, NativeSelectRoot} from '@/components/ui/native-select'
import {Result} from '@/type'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from '@/components/ui/dialog'
import {ChevronDownIcon} from 'lucide-react'

type Props = {
  result: Result
  isOpen: boolean
  onClose: () => void
  onChangeFilter: (level1: string, level2: string, level3: string, level4: string) => void
}

export function FilterSettingDialog({result, isOpen, onClose, onChangeFilter}: Props) {
  const [level1, setLevel1] = useState<string>('0')
  const [level2, setLevel2] = useState<string>('0')
  const [level3, setLevel3] = useState<string>('0')
  const [level4, setLevel4] = useState<string>('0')

  function onChangeLevel(level: number, id: string) {
    switch (level) {
      case 1:
        setLevel1(id)
        setLevel2('0')
        setLevel3('0')
        setLevel4('0')
        break
      case 2:
        setLevel2(id)
        setLevel3('0')
        setLevel4('0')
        break
      case 3:
        setLevel3(id)
        setLevel4('0')
        break
      case 4:
        setLevel4(id)
        break
    }
  }

  function onApply() {
    onChangeFilter(level1, level2, level3, level4)
    onClose()
  }

  return (
    <DialogRoot lazyMount open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>表示クラスター設定</DialogTitle>
          <Text>表示クラスターを設定すると、分析範囲を絞って詳細を確認できます</Text>
        </DialogHeader>
        <DialogBody>
          <Box>
            <NativeSelectRoot>
              <NativeSelectField
                value={level1}
                onChange={(e) => onChangeLevel(1, e.target.value)}
              >
                <option value={'0'}>全て</option>
                {result.clusters.filter(c => c.level === 1).map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
          {level1 !== '0' && (
            <VStack mt={2}>
              <ChevronDownIcon />
              <NativeSelectRoot>
                <NativeSelectField
                  value={level2}
                  onChange={(e) => onChangeLevel(2, e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level1).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </VStack>
          )}
          {level2 !== '0' && (
            <VStack mt={2}>
              <ChevronDownIcon />
              <NativeSelectRoot>
                <NativeSelectField
                  value={level3}
                  onChange={(e) => onChangeLevel(3, e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level2).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </VStack>
          )}
          {level3 !== '0' && (
            <VStack mt={2}>
              <ChevronDownIcon />
              <NativeSelectRoot>
                <NativeSelectField
                  value={level4}
                  onChange={(e) => onChangeLevel(4, e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level3).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </VStack>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={onApply}>設定を適用</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
