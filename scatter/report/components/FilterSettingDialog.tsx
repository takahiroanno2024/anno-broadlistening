import {Box, Button} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
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

  useEffect(() => {
    if (level1 === '0') {
      setLevel2('0')
      setLevel3('0')
      setLevel4('0')
    }
    if (level2 === '0') {
      setLevel3('0')
      setLevel4('0')
    }
    if (level3 === '0') {
      setLevel4('0')
    }
  }, [level1, level2, level3, level4])

  function onApply() {
    onChangeFilter(level1, level2, level3, level4)
    onClose()
  }

  return (
    <DialogRoot lazyMount open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>表示クラスター設定</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box mb={2}>
            <NativeSelectRoot>
              <NativeSelectField
                value={level1}
                onChange={(e) => setLevel1(e.target.value)}
              >
                <option value={'0'}>全て</option>
                {result.clusters.filter(c => c.level === 1).map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
          {level1 !== '0' && (
            <Box mb={2}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={level2}
                  onChange={(e) => setLevel2(e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level1).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>
          )}
          {level2 !== '0' && (
            <Box mb={2}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={level3}
                  onChange={(e) => setLevel3(e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level2).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>
          )}
          {level3 !== '0' && (
            <Box mb={2}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={level4}
                  onChange={(e) => setLevel4(e.target.value)}
                >
                  <option value={'0'}>全て</option>
                  {result.clusters.filter(c => c.parent === level3).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>
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
