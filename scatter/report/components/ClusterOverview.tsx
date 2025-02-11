import {Cluster} from '@/type'
import {Box, Heading, Icon, Text} from '@chakra-ui/react'
import {MessageSquareIcon} from 'lucide-react'

type Props = {
  cluster: Cluster
}

export function ClusterOverview({cluster}: Props) {
  return (
    <Box mx={'auto'} maxW={'750px'} mb={12}>
      <Box mb={2}>
        <Heading fontSize={'2xl'} className={'headingColor'} mb={1}>{cluster.label}</Heading>
        <Text fontWeight={'bold'}><Icon mr={1}><MessageSquareIcon size={20} /></Icon>{cluster.value}コメント</Text>
      </Box>
      <Text>{cluster.takeaway}</Text>
    </Box>
  )
}
