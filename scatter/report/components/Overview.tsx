import {Box, Heading, Icon, Text} from '@chakra-ui/react'
import {Result} from '@/type'
import {MessagesSquareIcon} from 'lucide-react'

type Props = {
  result: Result
}

export function Overview({result}: Props) {
  return (
    <Box mx={'auto'} maxW={'750px'} mb={5}>
      <Heading textAlign={'center'} fontSize={'xl'} mb={5}>Report</Heading>
      <Heading as={'h2'} size={'4xl'} mb={2} className={'headingColor'}>{result.config.question}</Heading>
      <Text fontWeight={'bold'} fontSize={'xl'} mb={2}><Icon mr={1}><MessagesSquareIcon size={20} /></Icon>{result.arguments.length.toLocaleString()}議論</Text>
      <p>{result.overview}</p>
    </Box>
  )
}
