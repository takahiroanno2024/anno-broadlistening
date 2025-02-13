'use client'

import {Box, Button, Heading, HStack, Image, Separator, Text, VStack} from '@chakra-ui/react'
import {Meta} from '@/type'
import {ExternalLinkIcon} from 'lucide-react'
import Link from 'next/link'

type AboutProps = {
  meta: Meta
}

export function About({meta}: AboutProps) {
  return (
    <Box mx={'auto'} maxW={'750px'} mb={12}>
      <Separator my={12} />
      <Heading textAlign={'center'} fontSize={'xl'} mb={5}>About</Heading>
      <Image
        src={'/reporter.png'}
        mx={'auto'}
        mb={5}
        objectFit={'cover'}
        maxW={'250px'}
        alt={meta.reporterName}
      />
      <Text mb={5} whiteSpace={'pre-line'}>
        {meta.projectMessage}
      </Text>
      <VStack>
        {meta.projectLink && (
          <Link href={meta.projectLink} target={'_blank'} rel={'noopener noreferrer'}>
            <Button size={'2xl'} w={'300px'} className={'gradientButton'}>ウェブサイトを見る<ExternalLinkIcon /></Button>
          </Link>
        )}
        <HStack gap={4}>
          {meta.privacyLink && (
            <Link href={meta.privacyLink} target={'_blank'} rel={'noopener noreferrer'}>
              <Text fontSize={'xs'} borderBottom={'1px dashed #aaa'}>プライバシーポリシー</Text>
            </Link>
          )}
          {meta.termsLink && (
            <Link href={meta.termsLink} target={'_blank'} rel={'noopener noreferrer'}>
              <Text fontSize={'xs'} borderBottom={'1px dashed #aaa'}>利用規約</Text>
            </Link>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}
