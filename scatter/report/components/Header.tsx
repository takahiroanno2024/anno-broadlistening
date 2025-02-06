import {Heading, HStack, Image} from '@chakra-ui/react'
import {XIcon} from 'lucide-react'
import {BroadlisteningGuide} from '@/components/BroadlisteningGuide'
import {Meta} from '@/type'

type Props = {
  meta: Meta | null
}

export function Header({meta}: Props) {
  return (
    <HStack justify="space-between" mb={8}>
      <HStack>
        {meta && (
          <>
            <Image
              src={'/reporter.png'}
              mx={'auto'}
              objectFit={'cover'}
              maxH={{base: '40px', md: '50px'}}
              maxW={{base: '120px', md: '200px'}}
              alt={meta.reporterName}
            />
            <XIcon color={'gray'}/>
          </>
        )}
        <Heading
          as={'h1'}
          size={{base: 'sm', md: 'lg'}}
          fontWeight={'bold'}
          className={'gradientColor'}
          lineHeight={'1.4'}
        >デジタル民主主義2030<br/>ブロードリスニング</Heading>
      </HStack>
      <BroadlisteningGuide/>
    </HStack>
  )
}
