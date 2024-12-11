import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Result, Point, FavoritePoint } from '@/types';
import Tooltip from '@/components/DesktopTooltip';
import useAutoResize from '@/hooks/useAutoResize';
import useRelativePositions from '@/hooks/useRelativePositions';
import useVoronoiFinder from '@/hooks/useVoronoiFinder';
import useInferredFeatures from '@/hooks/useInferredFeatures';
import useZoom from '@/hooks/useZoom';
import useFilter from '@/hooks/useFilter';
import { mean } from '@/utils';
import { Translator } from '@/hooks/useTranslatorAndReplacements';
import { ColorFunc } from '@/hooks/useClusterColor';
import { useGesture } from '@use-gesture/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import CustomTitle from '@/components/CustomTitle';

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

type TooltipPosition = {
  x: number;
  y: number;
};

type MapProps = Result & {
  width?: number;
  height?: number;
  padding?: number;
  className?: string;
  fullScreen?: boolean;
  back?: () => void;
  onlyCluster?: string;
  translator: Translator;
  color: ColorFunc;
  config: {
    name: string;
    description?: string;
    question?: string;
  };
  enableFavorites?: boolean; // お気に入り機能を有効/無効にするフラグ
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

function DesktopMap(props: MapProps) {
  const {
    fullScreen = false,
    back,
    onlyCluster,
    comments,
    translator,
    color,
    config,
    enableFavorites = false,
  } = props;
  const { dataHasVotes } = useInferredFeatures(props);
  const dimensions = useAutoResize(props.width, props.height);
  const clusters = useRelativePositions(props.clusters);
  const zoom = useZoom(dimensions, fullScreen);
  const findPoint = useVoronoiFinder(
    clusters,
    props.comments,
    color,
    zoom,
    dimensions,
    onlyCluster
  );
  const [tooltip, setTooltip] = useState<Point | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
  });
  const [expanded, setExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showRatio, setShowRatio] = useState(false);
  const [showFavorites, setShowFavorites] = useState(enableFavorites ? false : false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [minVotes, setMinVotes] = useState(0);
  const [minConsensus, setMinConsensus] = useState(50);
  const voteFilter = useFilter(
    clusters,
    comments,
    minVotes,
    minConsensus,
    dataHasVotes
  );

  const totalArgs = useMemo(() => 
    clusters.reduce((acc, c) => acc + c.arguments.length, 0), 
    [clusters]
  );

  const { scaleX, scaleY, width, height } = dimensions || {};
  const { t } = translator;

  const favoritesKey = enableFavorites ? `favorites_${window.location.href}` : '';
  
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    if (!enableFavorites) return new Set();
    try {
      const storedFavorites = localStorage.getItem(favoritesKey);
      const favArray: FavoritePoint[] = storedFavorites ? JSON.parse(storedFavorites) : [];
      return new Set(favArray.map((f) => f.arg_id));
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return new Set();
    }
  });

  const saveFavoritesDebounced = useMemo(() => 
    enableFavorites ? debounce((favArray: FavoritePoint[]) => {
      try {
        localStorage.setItem(favoritesKey, JSON.stringify(favArray));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }, 500) : () => {},
  [favoritesKey, enableFavorites]);

  const favorites = useMemo<FavoritePoint[]>(() => {
    if (!enableFavorites) return [];
    const favPoints: FavoritePoint[] = [];
    for (const cluster of clusters) {
      for (const arg of cluster.arguments) {
        if (favoriteIds.has(arg.arg_id)) {
          favPoints.push({
            arg_id: arg.arg_id,
            argument: arg.argument,
            comment_id: arg.comment_id,
            x: arg.x,
            y: arg.y,
            p: arg.p,
            cluster_id: cluster.cluster_id
          });
        }
      }
    }
    return favPoints;
  }, [favoriteIds, clusters, enableFavorites]);

  useEffect(() => {
    if (enableFavorites) {
      saveFavoritesDebounced(favorites);
    }
  }, [favorites, saveFavoritesDebounced, enableFavorites]);

  const containerRef = useRef<HTMLDivElement>(null);

  const TOOLTIP_WIDTH = 200;

  const calculateTooltipPosition = useCallback((clientX: number, clientY: number) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      let x = clientX - containerRect.left;
      let y = clientY - containerRect.top;

      const containerWidth = containerRect.width;

      if (x + TOOLTIP_WIDTH > containerWidth) {
        x = containerWidth - TOOLTIP_WIDTH - 10;
      }

      if (x < 10) {
        x = 10;
      }

      return { x, y };
    }

    return { x: 0, y: 0 };
  }, []);

  if (!dimensions) {
    return (
      <div
        className="m-auto bg-blue-50"
        style={{ width: props.width, height: props.height }}
      />
    );
  }

  const [zoomState, setZoomState] = useState({ scale: 1, x: 0, y: 0 });
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);

  const handleClick = useCallback((e: any) => {
    if (tooltip && !expanded) {
      setExpanded(true);
    } else if (expanded) {
      setExpanded(false);
      setTooltip(null);
    } else {
      const clickedPoint = findPoint(e);
      if (clickedPoint) {
        const newPosition = calculateTooltipPosition(e.clientX, e.clientY);
        setTooltip(clickedPoint.data);
        setTooltipPosition(newPosition);
      } else {
        setTooltip(null);
      }
    }
  }, [tooltip, expanded, findPoint, calculateTooltipPosition]);

  const handleMove = useCallback((e: any) => {
    if (!expanded) {
      const movedPoint = findPoint(e);
      if (movedPoint) {
        const newPosition = calculateTooltipPosition(e.clientX, e.clientY);
        setTooltip(movedPoint.data);
        setTooltipPosition(newPosition);
      } else {
        setTooltip(null);
      }
    }
  }, [expanded, findPoint, calculateTooltipPosition]);

  const toggleFavorite = useCallback((fav: FavoritePoint) => {
    if (!enableFavorites) return;
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fav.arg_id)) {
        newSet.delete(fav.arg_id);
      } else {
        newSet.add(fav.arg_id);
      }
      return newSet;
    });
  }, [enableFavorites]);

  const handleTap = useCallback((event: any) => {
    const clientX = event.clientX;
    const clientY = event.clientY;

    const clickedPoint = findPoint({ clientX, clientY });
    if (clickedPoint) {
      const newPosition = calculateTooltipPosition(clientX, clientY);
      setTooltip(clickedPoint.data);
      setTooltipPosition(newPosition);
    } else {
      if (tooltip) {
        setTooltip(null);
      }
    }
  }, [findPoint, calculateTooltipPosition, tooltip]);

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx, my], cancel, direction: [dx, dy], distance, memo }) => {
        if (!isZoomEnabled) return memo;
        if (Math.abs(dy) > Math.abs(dx)) {
          cancel();
          return memo;
        }
        setZoomState((prev) => ({ ...prev, x: prev.x + mx, y: prev.y + my }));
        return memo;
      },
      onPinch: ({ offset: [d], memo }) => {
        const newScale = Math.min(Math.max(d, 0.5), 4);
        setZoomState((prev) => ({ ...prev, scale: newScale }));
        return memo;
      },
      onClick: ({ event }) => {
        handleTap(event);
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: 5,
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 4 },
      },
    }
  );

  function extractFirstBracketContent(name: string): string | null {
    const match = name.match(/＜([^＞]+)＞(?:.*?＜([^＞]+)＞)?/);
    if (match) {
      const firstMatch = match[1];
      let secondMatch = '';
  
      if (match[2]) {
        const innerMatch = match[2].match(/（([^）]+)）/);
        secondMatch = innerMatch ? `（${innerMatch[1]}）` : `（${match[2]}）`;
      }
  
      return `＜${firstMatch}に関する分析結果${secondMatch}＞`;
    }
    return null;
  }

  useEffect(() => {
    if (clusters.length === 0) return;
  
    const allX = clusters.flatMap(cluster => cluster.arguments.map(arg => arg.x));
    const allY = clusters.flatMap(cluster => cluster.arguments.map(arg => arg.y));
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
  
    if (!dimensions) return;
  
    const { width: dimensionsWidth, height: containerHeight } = dimensions;
    const containerWidth = fullScreen ? dimensionsWidth * 0.75 : dimensionsWidth;
  
    const margin = fullScreen ? 0.6 : 0.8;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;
    const scaleX = (containerWidth * margin) / dataWidth;
    const scaleY = (containerHeight * margin) / dataHeight;
    let scale = Math.min(scaleX, scaleY);
  
    if (fullScreen) {
      scale *= 0.8;
    }
    const x = (containerWidth - (dataWidth * scale)) / 2 - (minX * scale);
    const y = (containerHeight - (dataHeight * scale)) / 2 - (minY * scale);
  
    setZoomState({ scale, x, y });
  }, [clusters, dimensions, fullScreen]);

  const map_title = useMemo(() => extractFirstBracketContent(config.name), [config.name]);

  const isFavorite = useCallback((arg_id: string) => {
    if (!enableFavorites) return false;
    return favoriteIds.has(arg_id);
  }, [favoriteIds, enableFavorites]);

  const FavoriteCircles = React.memo(({ showFavorites, favorites, zoom, scaleX, scaleY }: 
    { showFavorites: boolean; favorites: FavoritePoint[]; zoom: any; scaleX: (v:number)=>number; scaleY:(v:number)=>number }) => {
    if (!showFavorites) return null;
    return (
      <>
        {favorites.map((fav) => (
          <circle
            key={fav.arg_id}
            cx={zoom.zoomX(scaleX(fav.x) + 20)}
            cy={zoom.zoomY(scaleY(fav.y))}
            fill="gold"
            r={6}
          />
        ))}
      </>
    );
  });

  const FavoriteList = React.memo(({ favorites, clusters, color, onlyCluster, translator, toggleFavorite, fullScreen, height }: 
    { favorites: FavoritePoint[], clusters:any[], color:ColorFunc, onlyCluster?:string, translator: Translator, toggleFavorite:(fav:FavoritePoint)=>void, fullScreen:boolean, height:number }) => {
    return (
      <div
        className="w-1/4 p-4 bg-gray-100 overflow-y-auto"
        style={{
          height: fullScreen ? '100vh' : `${height}px`,
        }}
      >
        <h2 className="text-md font-bold mb-4">
          {translator.t('お気に入り一覧')}
        </h2>
        {favorites.length === 0 ? (
          <p>{translator.t('お気に入りがありません')}</p>
        ) : (
          <ul>
            {favorites.map((fav) => {
              const cluster = clusters.find((c) => c.cluster_id === fav.cluster_id);
              return (
                <li
                  key={fav.arg_id}
                  className="mb-2 p-2 bg-white rounded shadow flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-semibold text-md"
                      style={{
                        color: cluster ? color(cluster.cluster_id, onlyCluster) : '#000',
                      }}
                    >
                      {translator.t(cluster?.cluster || 'クラスタ')}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(fav)}
                      className="text-amber-500 text-lg focus:outline-none ml-2"
                    >
                      <FontAwesomeIcon icon={solidBookmark} />
                    </button>
                  </div>
                  <p className="text-md text-gray-700 mt-1">
                    {truncateText(fav.argument, 100)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    )
  });

  return (
    <>
      <CustomTitle config={config} />
      <div className="flex flex-1">
        <div
          ref={containerRef}
          className="relative flex-grow"
          style={{
            height: fullScreen ? '100vh' : `${height}px`,
            overflow: fullScreen ? 'hidden' : 'visible',
            backgroundColor: '#dcdcdc',
          }}
          onMouseLeave={() => {
            if (!expanded) setTooltip(null);
          }}
        >
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
                setTooltip(null);
              },
            })}
          >
            {clusters.map((cluster) =>
              cluster.arguments
                .filter(voteFilter.filter)
                .map(({ arg_id, x, y }) => (
                  <circle
                    className="pointer-events-none"
                    key={arg_id}
                    id={arg_id}
                    cx={zoom.zoomX(scaleX(x) + 20)}
                    cy={zoom.zoomY(scaleY(y))}
                    fill={color(cluster.cluster_id, onlyCluster)}
                    opacity={
                      expanded && tooltip?.arg_id !== arg_id ? 0.3 : 1
                    }
                    r={tooltip?.arg_id === arg_id ? 8 : 4}
                  />
                ))
            )}
            {enableFavorites && (
              <FavoriteCircles 
                showFavorites={showFavorites} 
                favorites={favorites} 
                zoom={zoom} 
                scaleX={scaleX} 
                scaleY={scaleY} 
              />
            )}
          </svg>

          {fullScreen && showLabels && !zoom.dragging && (
            <div>
              {clusters.map((cluster) => (
                <div
                  className="absolute opacity-90 bg-white p-2 max-w-lg rounded-lg pointer-events-none select-none transition-opacity duration-300 font-bold text-md"
                  key={cluster.cluster_id}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    left: zoom.zoomX(
                      scaleX(
                        mean(cluster.arguments.map(({ x }) => x))
                      )
                    ),
                    top: zoom.zoomY(
                      scaleY(
                        mean(cluster.arguments.map(({ y }) => y))
                      )
                    ),
                    color: color(cluster.cluster_id, onlyCluster),
                    opacity:
                      expanded
                        ? 0.3
                        : tooltip?.cluster_id === cluster.cluster_id
                        ? 0
                        : 0.85,
                  }}
                >
                  {t(cluster.cluster)}
                  {showRatio && (
                    <span>
                      ({Math.round((100 * cluster.arguments.length) / totalArgs)}%)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {tooltip && (
            <Tooltip
              point={tooltip}
              dimensions={dimensions}
              zoom={zoom}
              expanded={expanded}
              fullScreen={fullScreen}
              translator={translator}
              isFavorite={enableFavorites ? isFavorite(tooltip.arg_id) : false}
              enableFavorites={enableFavorites}
              onToggleFavorite={() => {
                if (enableFavorites) {
                  toggleFavorite({
                    arg_id: tooltip.arg_id,
                    argument: tooltip.argument,
                    comment_id: tooltip.comment_id,
                    x: tooltip.x,
                    y: tooltip.y,
                    p: tooltip.p,
                    cluster_id: tooltip.cluster_id,
                  });
                }
              }}
              colorFunc={color}
              position={tooltipPosition}
              onClose={() => {
                setTooltip(null);
                setExpanded(false);
              }}
            />
          )}

          {fullScreen && (
            <div className="absolute top-0 left-0">
              <button className="m-2 underline" onClick={back}>
                {t('Back to report')}
              </button>
              <button
                className='m-2 underline'
                onClick={() => setShowLabels(x => !x)}>
                {showLabels ? t('Hide labels') : t('Show labels')}
              </button>
              {enableFavorites && (
                <button
                  className="m-2 underline"
                  onClick={() => setShowFavorites(x => !x)} 
                >
                  {showFavorites ? t('お気に入りを非表示') : t('お気に入りを表示')}
                </button>
              )}
              <button
                className="m-2 underline"
                onClick={() => setShowTitle(x => !x)}
              >
                {showTitle ? t('タイトルを非表示') : t('タイトルを表示')}
              </button>
              <button
                className="m-2 underline"
                onClick={() => setShowRatio(x => !x)}
              >
                {showRatio ? t('割合を非表示') : t('割合を表示')}
              </button>
              {zoom.reset && (
                <button
                  className="m-2 underline"
                  onClick={zoom.reset as any}
                >
                  {t('Reset zoom')}
                </button>
              )}
              {dataHasVotes && (
                <button
                  className="m-2 underline"
                  onClick={() => {
                    setShowFilters((x) => !x);
                  }}
                >
                  {showFilters ? t('Hide filters') : t('Show filters')}
                </button>
              )}
              {showFilters && (
                <div className="absolute w-[400px] top-12 left-2 p-2 border bg-white rounded leading-4">
                  <div className="flex justify-between">
                    <button className="inline-block m-2 text-left">
                      {t('Votes')} {'>'}{' '}
                      <span className="inline-block w-10">
                        {minVotes}
                      </span>
                    </button>
                    <input
                      className="inline-block w-[200px] mr-2"
                      id="min-votes-slider"
                      type="range"
                      min="0"
                      max="50"
                      value={minVotes}
                      onInput={(e) => {
                        setMinVotes(
                          parseInt(
                            (e.target as HTMLInputElement).value
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button className="inline-block m-2 text-left">
                      {t('Consensus')} {'>'}{' '}
                      <span className="inline-block w-10">
                        {minConsensus}%
                      </span>
                    </button>
                    <input
                      className="inline-block w-[200px] mr-2"
                      id="min-consensus-slider"
                      type="range"
                      min="50"
                      max="100"
                      value={minConsensus}
                      onInput={(e) => {
                        setMinConsensus(
                          parseInt(
                            (e.target as HTMLInputElement).value
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="text-sm ml-2 mt-2 opacity-70">
                    {t('Showing')} {voteFilter.filtered}/
                    {voteFilter.total} {t('arguments')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* お気に入り機能有効かつ表示中の場合のみリスト表示 */}
        {enableFavorites && (!fullScreen || showFavorites) && (
          <FavoriteList 
            favorites={favorites} 
            clusters={clusters} 
            color={color} 
            onlyCluster={onlyCluster} 
            translator={translator} 
            toggleFavorite={toggleFavorite} 
            fullScreen={fullScreen} 
            height={height!} 
          />
        )}
      </div>
    </>
  );
}

export default DesktopMap;
