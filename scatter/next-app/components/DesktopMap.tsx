import {useGesture} from '@use-gesture/react'
import React, {useEffect, useRef, useState} from 'react'
import CustomTitle from '@/components/CustomTitle'
import {DesktopFullscreenFavorites} from '@/components/DesktopFullscreenFavorites'
import {DesktopFullscreenFilter} from '@/components/DesktopFullscreenFilter'
import {DesktopFullscreenTools} from '@/components/DesktopFullscreenTools'
import Tooltip from '@/components/DesktopTooltip'
import useAutoResize from '@/hooks/useAutoResize'
import {ColorFunc} from '@/hooks/useClusterColor'
import {PaletteType} from '@/hooks/useColorPalettes'
import useFilter from '@/hooks/useFilter'
import useInferredFeatures from '@/hooks/useInferredFeatures'
import useRelativePositions from '@/hooks/useRelativePositions'
import {Translator} from '@/hooks/useTranslatorAndReplacements'
import useVoronoiFinder from '@/hooks/useVoronoiFinder'
import useZoom from '@/hooks/useZoom'
import {Argument, Cluster, FavoritePoint, Point, PropertyMap, Result} from '@/types'
import {mean} from '@/utils'

type TooltipPosition = {
  x: number
  y: number
}

type MapProps = Result & {
  width?: number
  height?: number
  padding?: number
  className?: string
  fullScreen?: boolean
  back?: () => void
  onlyCluster?: string
  translator: Translator
  color: ColorFunc
  config: {
    name: string
    description?: string
    question?: string
  }
  propertyMap: PropertyMap
  paletteType: PaletteType
  setPaletteType: (type: PaletteType) => void
}

function DotCircles(
  clusters: Cluster[],
  expanded: boolean,
  tooltip: Point | null,
  zoom: any,
  scaleX: any,
  scaleY: any,
  color: any,
  onlyCluster: string | undefined,
  voteFilter: any,
  filterFn: (arg: Argument) => boolean
) {

  return clusters.map((cluster) =>
    cluster.arguments.filter(voteFilter.filter).map((arg) => {
      const {arg_id, x, y} = arg
      const isCurrentTooltip = tooltip?.arg_id === arg_id

      let dotClass = 'default'
      if (expanded) {
        if (!isCurrentTooltip) {
          dotClass = 'obscure'
        }
      } else if (!filterFn(arg)) {
        dotClass = 'obscure'
      }

      let calculatedRadius
      if (expanded && isCurrentTooltip) {
        calculatedRadius = 8
      } else {
        calculatedRadius = 4
      }

      return (
        <circle
          className={`pointer-events-none ${dotClass}`}
          key={arg_id}
          id={arg_id}
          cx={zoom.zoomX(scaleX(x))}
          cy={zoom.zoomY(scaleY(y))}
          fill={color(cluster.cluster_id, onlyCluster)}
          r={calculatedRadius}
        />
      )
    })
  )
}

function ClusterLabels(
  clusters: Cluster[],
  fullscreen: boolean,
  expanded: boolean,
  highlightText: string,
  tooltip: Point | null,
  zoom: any,
  scaleX: any,
  scaleY: any,
  color: any,
  t: any,
  onlyCluster: string | undefined,
  showLabels: boolean,
  showRatio: boolean,
  totalArgs: number,
) {
  if (!fullscreen || !showLabels || zoom.dragging) {
    return null
  }

  return (
    <div>
      {clusters.map((cluster) => {
        const isHighlightMode = highlightText !== ''

        let calculatedOpacity
        const DEFAULT_OPACITY = 0.85
        const LIGHT_OPACITY = 0.3
        const HIDDEN = 0

        if (isHighlightMode) {
          calculatedOpacity = LIGHT_OPACITY
          // nishio: ハイライトモードではラベルが濃いと点が見づらいため、透明度を下げる
          // 将来的にはハイライトされた点を含むクラスタのみラベルを表示するように変更するといいかも
        } else if (expanded) {
          calculatedOpacity = LIGHT_OPACITY
        } else if (tooltip?.cluster_id === cluster.cluster_id) {
          // tooltipが表示されているクラスタのラベルは非表示
          // tooltipが表示されているときは、その点がどのクラスタか表示されているため
          calculatedOpacity = HIDDEN
        } else {
          calculatedOpacity = DEFAULT_OPACITY
        }

        return (
          <div
            className={'absolute opacity-90 bg-white p-2 max-w-lg rounded-lg pointer-events-none select-none transition-opacity duration-300 font-bold text-md'}
            key={cluster.cluster_id}
            style={{
              transform: 'translate(-50%, -50%)',
              left: zoom.zoomX(scaleX(mean(cluster.arguments.map(({x}) => x)))),
              top: zoom.zoomY(scaleY(mean(cluster.arguments.map(({y}) => y)))),
              color: color(cluster.cluster_id, onlyCluster),
              opacity: calculatedOpacity,
            }}
          >
            {t(cluster.cluster)}
            {showRatio && (
              <span>({Math.round((100 * cluster.arguments.length) / totalArgs)}%)</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DesktopMap(props: MapProps) {
  const {
    fullScreen = false,
    back,
    onlyCluster,
    comments,
    translator,
    color: initialColor,  // renamed to avoid confusion
    config,
    propertyMap,
    paletteType,
    setPaletteType
  } = props
  const {dataHasVotes} = useInferredFeatures(props)
  const dimensions = useAutoResize(props.width, props.height)
  const clusters = useRelativePositions(props.clusters)
  const zoom = useZoom(dimensions, fullScreen)
  
  // Use the color function passed from props
  const color = initialColor

  // for vote filter
  const [minVotes, setMinVotes] = useState(0)
  const [minConsensus, setMinConsensus] = useState(50)
  const voteFilter = useFilter(clusters, comments, minVotes, minConsensus, dataHasVotes)

  // text and property filter
  const [highlightText, setHighlightText] = useState<string>('')
  const [propertyFilter, setPropertyFilter] = useState({} as { [key: string]: string })

  const isPropertyHighlightMode = Object.values(propertyFilter).some((val) => val !== '')
  const isTextHighlightMode = highlightText !== ''

  const filterFn = (arg: Argument) => {
    // return true if the point should be displayed
    if (!voteFilter.filter(arg)) return false

    if (isTextHighlightMode && !arg.argument.includes(highlightText)) {
      return false
    }

    if (isPropertyHighlightMode) {
      for (const [propKey, val] of Object.entries(propertyFilter)) {
        if (val === '') continue
        const argVal = propertyMap[propKey]?.[arg.arg_id]
        if (argVal !== val) {
          return false
        }
      }
    }
    return true
  }

  const findPoint = useVoronoiFinder(
    clusters,
    props.comments,
    color,
    zoom,
    dimensions,
    onlyCluster,
    undefined,
    filterFn
  )
  const [tooltip, setTooltip] = useState<Point | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
  })
  const [expanded, setExpanded] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showRatio, setShowRatio] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showFilterSettings, setShowFilterSettings] = useState(false)

  const totalArgs = clusters
    .map((c) => c.arguments.length)
    .reduce((a, b) => a + b, 0)

  const {scaleX, scaleY, width, height} = dimensions || {}
  const {t} = translator

  const favoritesKey = `favorites_${window.location.href}`

  const [favorites, setFavorites] = useState<FavoritePoint[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(favoritesKey)
      console.log('読み込んだお気に入り:', storedFavorites)
      return storedFavorites ? JSON.parse(storedFavorites) : []
    } catch (error) {
      console.error('お気に入りの読み込みに失敗しました:', error)
      return []
    }
  })
  const [zoomState, setZoomState] = useState({scale: 1, x: 0, y: 0})
  const [isZoomEnabled] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(favorites))
      console.log('保存したお気に入り:', favorites)
    } catch (error) {
      console.error('お気に入りの保存に失敗しました:', error)
    }
  }, [favorites])

  const containerRef = useRef<HTMLDivElement>(null)

  const bind = useGesture(
    {
      onDrag: ({movement: [mx, my], cancel, direction: [dx, dy], memo}) => {
        if (!isZoomEnabled) return memo
        if (Math.abs(dy) > Math.abs(dx)) {
          cancel() // ドラッグをキャンセルしてスクロールを許可
          return memo
        }
        // 水平方向のドラッグの場合、地図のパンを処理
        setZoomState((prev) => ({...prev, x: prev.x + mx, y: prev.y + my}))
        return memo
      },
      onPinch: ({offset: [d], memo}) => {
        const newScale = Math.min(Math.max(d, 0.5), 4)
        setZoomState((prev) => ({...prev, scale: newScale}))
        return memo
      },
      onClick: ({event}) => {
        handleTap(event)
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: 5,
      },
      pinch: {
        scaleBounds: {min: 0.5, max: 4},
      },
    }
  )

  useEffect(() => {
    if (clusters.length === 0) return

    // 全てのデータ点のXとYの最小値と最大値を計算
    const allX = clusters.flatMap(cluster => cluster.arguments.map(arg => arg.x))
    const allY = clusters.flatMap(cluster => cluster.arguments.map(arg => arg.y))
    const minX = Math.min(...allX)
    const maxX = Math.max(...allX)
    const minY = Math.min(...allY)
    const maxY = Math.max(...allY)

    const dataWidth = maxX - minX
    const dataHeight = maxY - minY

    if (!dimensions) return

    const {width: dimensionsWidth, height: containerHeight} = dimensions
    const containerWidth = fullScreen ? dimensionsWidth * 0.75 : dimensionsWidth

    const margin = fullScreen ? 0.6 : 0.8
    const scaleX = (containerWidth * margin) / dataWidth
    const scaleY = (containerHeight * margin) / dataHeight
    let scale = Math.min(scaleX, scaleY)

    // フルスクリーン時のスケールを調整
    if (fullScreen) {
      scale *= 0.8
    }
    const x = (containerWidth - (dataWidth * scale)) / 2 - (minX * scale)
    const y = (containerHeight - (dataHeight * scale)) / 2 - (minY * scale)

    // zoomState が変更される場合のみ setZoomState を呼び出す
    if (zoomState.scale !== scale || zoomState.x !== x || zoomState.y !== y) {
      setZoomState({scale, x, y})
    }

  }, [clusters, dimensions, fullScreen])

  const TOOLTIP_WIDTH = 300
  const TOOLTIP_HEIGHT = 100
  const TOOLTIP_MARGIN = 15

  const calculateTooltipPosition = (clientX: number, clientY: number) => {

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      let x = clientX - containerRect.left
      let y = clientY - containerRect.top

      // コンテナのサイズを取得
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      // right
      if (x + TOOLTIP_WIDTH > containerWidth) {
        x = containerWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN
      }
      // left
      if (x < TOOLTIP_MARGIN) {
        x = TOOLTIP_MARGIN
      }
      // bottom
      if (y + TOOLTIP_HEIGHT > containerHeight) {
        y = containerHeight - TOOLTIP_HEIGHT - TOOLTIP_MARGIN
      }
      return {x, y}
    }

    console.warn('containerRef.current is undefined')
    return {x: 0, y: 0}
  }

  if (!dimensions) {
    console.log('NO DIMENSIONS???')
    return (
      <div
        className="m-auto bg-blue-50"
        style={{width: props.width, height: props.height}}
      />
    )
  }

  const handleClick = (e: any) => {
    if (tooltip && !expanded) {
      setExpanded(true)
    } else if (expanded) {
      setExpanded(false)
      setTooltip(null)
    } else {
      const clickedPoint = findPoint(e)
      if (clickedPoint) {
        const newPosition = calculateTooltipPosition(e.clientX, e.clientY)
        setTooltip(clickedPoint.data)
        setTooltipPosition(newPosition)
      } else {
        setTooltip(null)
      }
    }
  }

  let animationFrameId: number | null = null

  const handleMove = (e: any) => {
    if (expanded) return
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(() => {
      const movedPoint = findPoint(e)
      if (movedPoint) {
        // 既に表示されている tooltip と選択された tooltip が同じ場合はスキップ
        if (tooltip?.arg_id !== movedPoint.data.arg_id) {
          setTooltip(movedPoint.data)
          setTooltipPosition(calculateTooltipPosition(e.clientX, e.clientY))
        }
      } else {
        setTooltip(null)
      }
      animationFrameId = null
    })
  }

  const toggleFavorite = (fav: FavoritePoint) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(
        (item) => item.arg_id === fav.arg_id
      )
      if (isAlreadyFavorite) {
        return prevFavorites.filter((item) => item.arg_id !== fav.arg_id)
      } else {
        return [...prevFavorites, fav]
      }
    })
  }

  const handleTap = (event: any) => {
    console.log('handleTap called')
    const clientX = event.clientX
    const clientY = event.clientY

    console.log(`Tap event at (${clientX}, ${clientY})`)

    const clickedPoint = findPoint({clientX, clientY})
    if (clickedPoint) {
      const newPosition = calculateTooltipPosition(clientX, clientY)
      console.log('Tapped point found:', clickedPoint.data)
      setTooltip(clickedPoint.data)
      setTooltipPosition(newPosition)
    } else {
      // ツールチップが開いている場合は閉じる
      if (tooltip) {
        setTooltip(null)
        console.log('Tooltip closed due to tap with no point')
      }
    }
  }

  function extractFirstBracketContent(name: string): string | null {
    const match = name.match(/＜([^＞]+)＞(?:.*?＜([^＞]+)＞)?/)
    if (match) {
      const firstMatch = match[1]
      let secondMatch = ''

      if (match[2]) {
        const innerMatch = match[2].match(/（([^）]+)）/)
        secondMatch = innerMatch ? `（${innerMatch[1]}）` : `（${match[2]}）`
      }

      return `＜${firstMatch}に関する分析結果${secondMatch}＞`
    }
    return null
  }

  const map_title = extractFirstBracketContent(config.name)

  return (
    <>
      <CustomTitle config={config}/>
      <div className="flex flex-1 relative">
        {/* 地図コンテナ */}
        <div
          ref={containerRef}
          className="relative flex-grow"
          style={{
            height: fullScreen ? '100vh' : `${height}px`,
            overflow: fullScreen ? 'hidden' : 'visible',
            backgroundColor: '#dcdcdc',
          }}
          onMouseLeave={() => {
            if (!expanded) setTooltip(null)
          }}
        >
          {/* 地図タイトル */}
          {showTitle && fullScreen && (
            <div
              className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow-md"
              style={{
                opacity: expanded ? 0.3 : 0.85,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <h2 className="text-3xl font-bold">{map_title}</h2>
            </div>
          )}

          <svg
            width={width!}
            height={height!}
            {...bind()}
            {...zoom.events({
              onClick: handleClick,
              onMove: handleMove,
              onDrag: () => {
                setTooltip(null)
              },
            })}
          >
            {/* DOT CIRCLES */}
            {DotCircles(
              clusters,
              expanded,
              tooltip,
              zoom,
              scaleX,
              scaleY,
              color,
              onlyCluster,
              voteFilter,
              filterFn
            )}
            {/* お気に入りの表示 */}
            {showFavorites && (
              favorites.map((fav) => (
                <circle
                  key={fav.arg_id}
                  cx={zoom.zoomX(scaleX(fav.x))}
                  cy={zoom.zoomY(scaleY(fav.y))}
                  fill="gold"
                  r={6}
                />
              ))
            )}
          </svg>
          {/* CLUSTER LABELS */}
          {ClusterLabels(
            clusters,
            fullScreen,
            expanded,
            highlightText,
            tooltip,
            zoom,
            scaleX,
            scaleY,
            color,
            t,
            onlyCluster,
            showLabels,
            showRatio,
            totalArgs
          )}

          {/* TOOLTIP */}
          {tooltip && (
            <Tooltip
              point={tooltip}
              dimensions={dimensions}
              zoom={zoom}
              expanded={expanded}
              fullScreen={fullScreen}
              translator={translator}
              isFavorite={favorites.some(
                (fav) => fav.arg_id === tooltip.arg_id
              )}
              onToggleFavorite={() =>
                toggleFavorite({
                  arg_id: tooltip.arg_id,
                  argument: tooltip.argument,
                  comment_id: tooltip.comment_id,
                  x: tooltip.x,
                  y: tooltip.y,
                  p: tooltip.p,
                  cluster_id: tooltip.cluster_id,
                })
              }
              colorFunc={color}
              position={tooltipPosition}
              onClose={() => {
                setTooltip(null)
                setExpanded(false)
              }}
            />
          )}
        </div>
        {/* 全画面メニュー */}
        {fullScreen && (
          <DesktopFullscreenTools
            canFilter={!!propertyMap}
            zoomReset={zoom.reset}
            translator={translator}
            exitFullScreen={back!}
            showSettings={showFilterSettings}
            setShowSettings={setShowFilterSettings}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            showTitle={showTitle}
            setShowTitle={setShowTitle}
            showRatio={showRatio}
            setShowRatio={setShowRatio}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            paletteType={paletteType}
            setPaletteType={setPaletteType}
          />
        )}
        {/* フィルター一覧 */}
        {(fullScreen && propertyMap && showFilterSettings) && (
          <DesktopFullscreenFilter
            translator={translator}
            onClose={() => setShowFilterSettings(false)}
            highlightText={highlightText}
            setHighlightText={setHighlightText}
            propertyMap={propertyMap}
            propertyFilter={propertyFilter}
            setPropertyFilter={setPropertyFilter}
            dataHasVotes={dataHasVotes}
            minVotes={minVotes}
            setMinVotes={setMinVotes}
            minConsensus={minConsensus}
            setMinConsensus={setMinConsensus}
            voteFilter={voteFilter}
          />
        )}
        {/* お気に入り一覧 */}
        {(fullScreen && showFavorites) && (
          <DesktopFullscreenFavorites
            favorites={favorites}
            clusters={clusters}
            translator={translator}
            color={color}
            onlyCluster={onlyCluster}
            removeFavorite={(fav) => {
              setFavorites((prev) => prev.filter((item) => item.arg_id !== fav.arg_id))
            }}
            onClose={() => setShowFavorites(false)}
          />
        )}
      </div>
    </>
  )
}

export default DesktopMap
