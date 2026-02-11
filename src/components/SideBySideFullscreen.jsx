import React, { useEffect, useRef } from 'react'
import { X, Activity, Play, Pause } from 'lucide-react'

function SideBySideFullscreen({
  videoUrl,
  videoRef,
  seekBarRef,
  isPlaying,
  currentTime,
  duration,
  onTogglePlayPause,
  onSeekStart,
  onSeekMove,
  onSeekEnd,
  formatTime,
  currentPhase,
  isProcessing,
  onClose,
}) {
  const containerRef = useRef(null)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    const enterFullscreen = async () => {
      if (containerRef.current) {
        try {
          await containerRef.current.requestFullscreen()
        } catch (err) {
          console.error('Fullscreen error:', err)
        }
      }
    }
    enterFullscreen()
  }, [])

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#212070] text-white">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Surgical Phase Recognition</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close fullscreen"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Vertical Layout: Video Top (Large), Phase Bottom (Small) */}
      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* Video Section - Takes most space */}
        <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden min-h-0">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              playsInline
              controls
            />
          </div>
          
          {/* Video Controls */}
          <div className="p-4 bg-gray-800 space-y-3 flex-shrink-0">
            {/* Seek Bar */}
            <div className="space-y-2">
              <div
                ref={seekBarRef}
                className="relative h-2 bg-gray-600 rounded-full cursor-pointer group"
                onMouseDown={onSeekStart}
                onMouseMove={onSeekMove}
                onMouseUp={onSeekEnd}
                onMouseLeave={onSeekEnd}
              >
                <div
                  className="absolute h-full bg-[#06ABEB] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#06ABEB] rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center">
              <button
                onClick={onTogglePlayPause}
                className="bg-[#212070] hover:bg-[#1a1a5c] text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Phase Section - Smaller at bottom */}
        <div className="h-32 flex items-center bg-[#212070] rounded-lg px-8 text-white flex-shrink-0">
          <div className="flex items-center gap-6 w-full">
            <div className="p-3 bg-white/10 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                Current Surgical Phase
              </div>
              <div className="text-3xl font-bold text-white">
                {currentPhase}
              </div>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBySideFullscreen
