'use client'

import {Result} from '@/type'
import {Box, Button, Heading, HStack, Separator, Text} from '@chakra-ui/react'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle
} from '@/components/ui/timeline'
import {CircleArrowDownIcon} from 'lucide-react'
import {
  DrawerBackdrop, DrawerBody,
  DrawerContent, DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle
} from '@/components/ui/drawer'
import {useState} from 'react'

type ReportProps = {
  result: Result
}

export function Analysis({result}: ReportProps) {

  const [selectedData, setSelectedData] = useState<{ title: string, body: string}|null>(null)

  return (
    <Box mx={'auto'} maxW={'750px'} mb={12}>
      <Separator my={12} />
      <Heading textAlign={'center'} fontSize={'xl'} mb={5}>Analysis</Heading>
      <Text fontSize={'sm'} mb={5}>{result.config.intro}</Text>
      <Box>
        <Heading fontSize={'md'} mb={5}>分析手順</Heading>
        <TimelineRoot size={'lg'}>
          {result.config.plan.map(p => (
            <TimelineItem key={p.step}>
              <TimelineConnector>
                <CircleArrowDownIcon />
              </TimelineConnector>
              {p.step === 'extraction' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>抽出 ({result.config.extraction.model})</TimelineTitle>
                  <TimelineDescription>
                    コメントデータから議論を抽出するステップです。<br />
                    指定されたプロパティカラムを検証し、コメントIDを制限してバッチ処理を行います。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `抽出 - ${p.step}`,
                      body: result.config.extraction.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `抽出 - ${p.step}`,
                      body: result.config.extraction.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'embedding' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>埋め込み ({result.config.embedding.model})</TimelineTitle>
                  <TimelineDescription>
                    抽出された議論に対して埋め込み（ベクトル表現）を生成するステップです。<br/>
                    これにより、議論の内容を数値ベクトルとして表現します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `埋め込み - ${p.step}`,
                      body: result.config.embedding.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_clustering' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>クラスタリング</TimelineTitle>
                  <TimelineDescription>
                    UMAPとHDBSCANを使用して、議論のクラスタリングを行うステップです。<br />
                    これにより、議論が階層的にグループ化されます。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `クラスタリング - ${p.step}`,
                      body: result.config.hierarchical_clustering.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_initial_labelling' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>初期ラベリング ({result.config.hierarchical_initial_labelling.model})</TimelineTitle>
                  <TimelineDescription>
                    初期クラスタにラベルを付けるステップです。<br />
                    各クラスタに対して適切なラベルを生成します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `初期ラベリング - ${p.step}`,
                      body: result.config.hierarchical_initial_labelling.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `初期ラベリング - ${p.step}`,
                      body: result.config.hierarchical_initial_labelling.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_merge_labelling' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>統合ラベリング ({result.config.hierarchical_merge_labelling.model})</TimelineTitle>
                  <TimelineDescription>
                    階層的クラスタリングの結果に対して、クラスタをマージしながらラベリングを行うステップです。<br />
                    これにより、分割されすぎたクラスタを統合し、統合後のクラスタに適切なラベルを付けます。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `統合ラベリング - ${p.step}`,
                      body: result.config.hierarchical_merge_labelling.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `統合ラベリング - ${p.step}`,
                      body: result.config.hierarchical_merge_labelling.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_overview' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>要約 ({result.config.hierarchical_overview.model})</TimelineTitle>
                  <TimelineDescription>
                    クラスタの概要を作成するステップです。<br />
                    各クラスタの要約を生成し、全体の概要をまとめます。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `要約 - ${p.step}`,
                      body: result.config.hierarchical_overview.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `要約 - ${p.step}`,
                      body: result.config.hierarchical_overview.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_aggregation' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>出力</TimelineTitle>
                  <TimelineDescription>
                    最終的な結果をJSON形式で出力するステップです。<br />
                    議論、クラスタ、コメント、プロパティマップなどを含む便利なJSONファイルを生成します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `出力 - ${p.step}`,
                      body: result.config.hierarchical_aggregation.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_visualization' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>表示</TimelineTitle>
                  <TimelineDescription>
                    出力されたJSONファイルをグラフィカルに表示するステップです。<br />
                    クラスタの概要、議論の内容などを可視化します。あなたが見ているこの画面です。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `表示 - ${p.step}`,
                      body: result.config.hierarchical_visualization.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
            </TimelineItem>
          ))}
        </TimelineRoot>
      </Box>

      <DrawerRoot open={!!selectedData} size={'xl'} onOpenChange={() => setSelectedData(null)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedData?.title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody fontSize={'xs'}>
            <Box
              p={5}
              borderRadius={5}
              bgColor={'#111'}
              color={'#fff'}
              whiteSpace={'pre-wrap'}
              className={'code'}
            >{selectedData?.body}</Box>
          </DrawerBody>
          <DrawerFooter>
            <Button w={'150px'} onClick={() => setSelectedData(null)}>閉じる</Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
