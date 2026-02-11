import React, { useState } from 'react'
import Header from './components/Header'
import BackendConnection from './components/BackendConnection'
import ModelLoader from './components/ModelLoader'
import ConfigurationPanel from './components/ConfigurationPanel'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer'
import ResultsPanel from './components/ResultsPanel'
import ErrorDisplay from './components/ErrorDisplay'
import SideBySideFullscreen from './components/SideBySideFullscreen'
import { useBackend } from './hooks/useBackend'
import { useVideoProcessing } from './hooks/useVideoProcessing'

function App() {
  // Default to localhost backend for development
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_BACKEND_URL || ''
  )
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [showSideBySideFullscreen, setShowSideBySideFullscreen] = useState(false)
  
  const {
    isConnected,
    isModelLoaded,
    status,
    error: backendError,
    testConnection,
    loadModel,
  } = useBackend(backendUrl)
  
  const {
    currentPhase,
    confidence,
    frameCount,
    isProcessing,
    currentTime,
    duration,
    isPlaying,
    framesPerPrediction,
    setFramesPerPrediction,
    minFrames,
    setMinFrames,
    maxFrames,
    setMaxFrames,
    handleVideoSelect,
    togglePlayPause,
    handleSeekStart,
    handleSeekMove,
    handleSeekEnd,
    formatTime,
    videoRef,
    seekBarRef,
    canvasRef,
  } = useVideoProcessing(backendUrl, isModelLoaded, videoUrl, setVideoFile, setVideoUrl)

  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleVideoSelect(e)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-5">
          {/* Backend Connection */}
          <BackendConnection
            backendUrl={backendUrl}
            setBackendUrl={setBackendUrl}
            isConnected={isConnected}
            onTestConnection={testConnection}
          />

          {/* Model Loading */}
          {isConnected && (
            <ModelLoader
              isModelLoaded={isModelLoaded}
              onLoadModel={loadModel}
              status={status}
            />
          )}

          {/* Configuration Panel */}
          {isModelLoaded && (
            <ConfigurationPanel
              framesPerPrediction={framesPerPrediction}
              setFramesPerPrediction={setFramesPerPrediction}
              minFrames={minFrames}
              setMinFrames={setMinFrames}
              maxFrames={maxFrames}
              setMaxFrames={setMaxFrames}
            />
          )}

          {/* Video Upload */}
          {isModelLoaded && (
            <VideoUpload onVideoSelect={handleVideoFileSelect} />
          )}

          {/* Video Player and Results */}
          {videoUrl && (
            <div className="grid lg:grid-cols-2 gap-6">
              <VideoPlayer
                videoUrl={videoUrl}
                videoRef={videoRef}
                seekBarRef={seekBarRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onTogglePlayPause={togglePlayPause}
                onSeekStart={handleSeekStart}
                onSeekMove={handleSeekMove}
                onSeekEnd={handleSeekEnd}
                formatTime={formatTime}
              />
              
              <ResultsPanel
                currentPhase={currentPhase}
                confidence={confidence}
                frameCount={frameCount}
                isProcessing={isProcessing}
                framesPerPrediction={framesPerPrediction}
                status={status}
                onShowSideBySideFullscreen={() => setShowSideBySideFullscreen(true)}
              />
            </div>
          )}

          {/* Error Display */}
          {backendError && <ErrorDisplay error={backendError} />}
        </div>
      </main>
      
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Side by Side Fullscreen */}
      {showSideBySideFullscreen && videoUrl && (
        <SideBySideFullscreen
          videoUrl={videoUrl}
          videoRef={videoRef}
          seekBarRef={seekBarRef}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlayPause={togglePlayPause}
          onSeekStart={handleSeekStart}
          onSeekMove={handleSeekMove}
          onSeekEnd={handleSeekEnd}
          formatTime={formatTime}
          currentPhase={currentPhase}
          isProcessing={isProcessing}
          onClose={() => setShowSideBySideFullscreen(false)}
        />
      )}
    </div>
  )
}

export default App
