import React from 'react'
import { Play, Pause } from 'lucide-react'

function VideoPlayer({
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
}) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Video Playback</h2>
      </div>
      
      <div 
        className="bg-black rounded-lg overflow-hidden mb-4 border border-gray-200 relative group"
        style={{ 
          resize: 'both', 
          minWidth: '300px', 
          minHeight: '200px',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: '200px'
          }}
          playsInline
          controls
        />
        {/* Resize handle indicator */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize pointer-events-none"
          style={{
            background: 'linear-gradient(-45deg, transparent 0%, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 40%, transparent 40%)'
          }}
        >
        </div>
      </div>
      
      {/* Custom Video Controls */}
      <div className="space-y-4">
        {/* Seek Bar */}
        <div className="space-y-2">
          <div
            ref={seekBarRef}
            className="relative h-2 bg-gray-200 rounded-full cursor-pointer group"
            onMouseDown={onSeekStart}
            onMouseMove={onSeekMove}
            onMouseUp={onSeekEnd}
            onMouseLeave={onSeekEnd}
          >
            <div
              className="absolute h-full bg-[#212070] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#212070] rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={onTogglePlayPause}
            className="btn-primary flex items-center gap-2 px-8 py-2.5"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
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
  )
}

export default VideoPlayer
