import React, {useEffect, useRef, useState} from 'react'
import useClusterColor from '../hooks/useClusterColor'
import {PaletteType, colorPalettes} from '../hooks/useColorPalettes'
import useTranslatorAndReplacements from '../hooks/useTranslatorAndReplacements'
import {Result} from '../types'
import AfterAppendix from './AfterAppendix'
import Appendix from './Appendix'
import CustomHeader from './CustomHeader'
import CustomIntroduction from './CustomIntroduction'
import DesktopMap from './DesktopMap'
import Header from './Header'
import MobileMap from './MobileMap'
import Outline from './Outline'

type ReportProps = Result

const isMobileDevice = () => {
  const mobilePattern = /Android|webOS|iPhone|iPad|Opera Mini/i
  return mobilePattern.test(navigator.userAgent)
}

const ResponsiveMap = (props: any) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  return isMobile ? <MobileMap {...props} /> : <DesktopMap {...props} />
}

function Report(props: ReportProps) {
  const [openMap, setOpenMap] = useState<string | null>(null)
  const {config, clusters, translations, overview} = props
  const [paletteType, setPaletteType] = useState<PaletteType>(() => {
    // Try to restore from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedPalette')
      if (saved && Object.keys(colorPalettes).includes(saved)) {
        return saved as PaletteType
      }
    }
    return 'default'
  })

  // Save palette selection to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPalette', paletteType)
    }
  }, [paletteType])

  const color = useClusterColor(
    clusters.map((c) => c.cluster_id),
    colorPalettes[paletteType]
  )
  const scroll = useRef(0)
  const translator = useTranslatorAndReplacements(
    config,
    translations,
    clusters
  )
  const [reportWidth, setReportWidth] = useState(450)
  useEffect(() => {
    setReportWidth(Math.min(window.innerWidth, 728))
  }, [])
  // wait for one tick to avoid SSR issues
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [])
  if (!ready) return false

  const {t} = translator
  const totalArgs = clusters
    .map((c) => c.arguments.length)
    .reduce((a, b) => a + b, 0)

  if (openMap) {
    return (
      <ResponsiveMap
        {...props}
        color={color}
        translator={translator}
        paletteType={paletteType}
        setPaletteType={setPaletteType}
        back={() => {
          setOpenMap(null)
          setTimeout(() => window.scrollTo({top: scroll.current}), 0)
        }}
        fullScreen
        onlyCluster={openMap !== 'main' ? openMap : undefined}
      />
    )
  }
  return (
    <>
      <CustomHeader config={config}/>
      <div className="mt-9">
        <Outline clusters={clusters} translator={translator}/>
        <Header {...props} translator={translator}/>
        <div
          className="text-center max-w-3xl m-auto py-8 px-5"
          style={{display: openMap ? 'none' : 'block',}}
        >
          <h2 className="text-xl my-3 font-bold">{t(config.name)}</h2>
          <h1 className="text-3xl my-3 mb-10">{t(config.question)}</h1>
          <CustomIntroduction config={config} translator={translator}/>

          <div id="introduction" className="my-4">
            <div id="big-map">
              <ResponsiveMap
                {...props}
                translator={translator}
                color={color}
                width={reportWidth}
                height={450}
                paletteType={paletteType}
                setPaletteType={setPaletteType}
              />
              <button
                className="my-2 underline"
                onClick={() => {
                  scroll.current = window.scrollY
                  setOpenMap('main')
                }}
              >
                {t('Open full-screen map')}
              </button>
            </div>
            <div id="overview" className="text-left font-bold my-3">
              {t('Overview')}:
            </div>
            <div className="text-left">{t(overview)}</div>
          </div>
          <div id="clusters">
            {clusters
              .sort((c1, c2) => c2.arguments.length - c1.arguments.length)
              .map((cluster) => (
                <div
                  key={cluster.cluster_id}
                  id={`cluster-${cluster.cluster_id}`}
                >
                  <h2
                    className="text-2xl font-semibold my-2 mt-12"
                    style={{color: color(cluster.cluster_id)}}
                  >
                    {t(cluster.cluster)}
                  </h2>
                  <div className="text-lg opacity-50 mb-3">
                    ({cluster.arguments.length} {t('arguments')},
                    {Math.round((100 * cluster.arguments.length) / totalArgs)}%{' '}
                    {t('of total')})
                  </div>
                  <div className="text-left font-bold my-3">
                    {t('Cluster analysis')}:
                  </div>
                  <div className="text-left">{t(cluster.takeaways)}</div>
                  <div className="my-4">
                    <ResponsiveMap
                      {...props}
                      translator={translator}
                      color={color}
                      width={reportWidth}
                      height={350}
                      onlyCluster={t(cluster.cluster_id)}
                      paletteType={paletteType}
                      setPaletteType={setPaletteType}
                    />
                    <button
                      className="my-2 underline"
                      onClick={() => {
                        scroll.current = window.scrollY
                        setOpenMap(cluster.cluster_id)
                      }}
                    >
                      {t('Open full-screen map')}
                    </button>
                  </div>
                  <div className="text-left font-bold my-3">
                    {t('Representative comments')}:
                  </div>
                  <ul className="text-left list-outside list-disc ml-6 ">
                    {cluster.arguments
                      .sort((a, b) => b.p - a.p)
                      .slice(0, 5)
                      .map((arg, i) => (
                        <li key={i} className="italic">
                          {t(arg.argument)}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
          <Appendix config={config} translator={translator}/>
          <AfterAppendix/>
        </div>
      </div>
    </>
  )
}

export default Report
