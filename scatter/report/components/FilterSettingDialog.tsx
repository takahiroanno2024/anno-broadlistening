import {Box, Button} from '@chakra-ui/react'
import React from 'react'
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
  onChangeFilter: () => void
}

export function FilterSettingDialog({result, isOpen, onClose, onChangeFilter}: Props) {

  function onApply() {
    onChangeFilter()
    onClose()
  }

  return (
    <DialogRoot lazyMount open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>表示設定</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box mb={2}>
            <NativeSelectRoot>
              <NativeSelectField>
                <option value={'0'}>全て</option>
                {result.clusters.filter(c => c.level === 1).map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onApply}>設定を適用</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
