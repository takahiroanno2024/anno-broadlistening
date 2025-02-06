import {Text} from '@chakra-ui/react'
import {Meta} from '@/type'

type Props = {
  meta: Meta | null
}

export function Footer({meta}: Props) {
  return (
    <footer>
      {meta && (<Text fontWeight={'bold'}>{meta.reporterName}</Text>)}
      <Text>デジタル民主主義2030 ブロードリスニング</Text>
    </footer>
  )
}
