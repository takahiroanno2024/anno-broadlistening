import {Box, Heading} from '@chakra-ui/react'
import {Result} from '@/type'

type Props = {
  result: Result
}

export function Overview({result}: Props) {
  return (
    <Box mx={'auto'} maxW={'750px'} mb={5}>
      <Heading textAlign={'center'} fontSize={'xl'} mb={5}>Report</Heading>
      <Heading as={'h2'} size={'4xl'} mb={5} className={'headingColor'}>{result.config.question}</Heading>
      <p>{result.overview}</p>
    </Box>
  )
}
