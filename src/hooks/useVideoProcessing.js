import { useState, useRef, useEffect } from 'react'

export function useVideoProcessing(backendUrl, isModelLoaded, videoUrl, setVideoFile, setVideoUrl) {
  const [currentPhase, setCurrentPhase] = useState('Not predicted yet')
  const [confidence, setConfidence] = useState(null)
  const [frameCount, setFrameCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [framesPerPrediction, setFramesPerPrediction] = useState(20)
  const [minFrames, setMinFrames] = useState(15)
  const [maxFrames, setMaxFrames] = useState(30)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const frameIntervalRef = useRef(null)
  const seekBarRef = useRef(null)

  // Handle video file selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setCurrentPhase('Not predicted yet')
      setConfidence(null)
      framesRef.current = []
      setFrameCount(0)
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    }
  }

  // Update video metadata when loaded
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration)
      }
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoUrl])

  // Update current time
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(video.currentTime)
        }
      }
      video.addEventListener('timeupdate', handleTimeUpdate)
      return () => video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [isDragging])

  // Handle video end
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => {
        setIsPlaying(false)
        stopFrameCapture()
      }
      video.addEventListener('ended', handleEnded)
      return () => video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Capture frame from video
  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas || video.readyState < 2) return null
    
    const ctx = canvas.getContext('2d')
    canvas.width = 640
    canvas.height = 360
    
    ctx.drawImage(video, 0, 0, 640, 360)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  // Send frames for prediction
  const sendFramesForPrediction = async (frames) => {
    if (!isModelLoaded || !backendUrl) return

    try {
      setIsProcessing(true)
      const response = await fetch(`${backendUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frames }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.predicted_phase) {
        setCurrentPhase(data.predicted_phase)
        setConfidence(data.confidence)
      }
      
      setIsProcessing(false)
    } catch (err) {
      console.error('Prediction error:', err)
      setIsProcessing(false)
      // Optionally show error to user - could be added to status/error state
    }
  }

  // Start frame capture
  const startFrameCapture = () => {
    if (frameIntervalRef.current) return
    
    frameIntervalRef.current = setInterval(() => {
      const frame = captureFrame()
      if (frame) {
        framesRef.current.push(frame)
        setFrameCount(framesRef.current.length)
        
        // Send for prediction when we have the configured number of frames
        if (framesRef.current.length >= framesPerPrediction) {
          sendFramesForPrediction([...framesRef.current])
          framesRef.current = []
        } else if (framesRef.current.length > maxFrames) {
          framesRef.current = framesRef.current.slice(-maxFrames)
        }
      }
    }, 100)
  }

  // Stop frame capture
  const stopFrameCapture = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current)
      frameIntervalRef.current = null
    }
  }

  // Play/Pause video
  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
      stopFrameCapture()
      setIsPlaying(false)
    } else {
      video.play()
      startFrameCapture()
      setIsPlaying(true)
    }
  }

  // Seek bar handlers
  const handleSeekStart = (e) => {
    setIsDragging(true)
    handleSeekMove(e)
  }

  const handleSeekMove = (e) => {
    if (!seekBarRef.current || !videoRef.current || !duration) return
    
    const rect = seekBarRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const clampedPos = Math.max(0, Math.min(1, pos))
    const newTime = clampedPos * duration
    
    if (isDragging || e.type === 'mousedown') {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSeekEnd = () => {
    setIsDragging(false)
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle mouse events for seeking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleSeekMove(e)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        handleSeekEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, duration])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFrameCapture()
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  return {
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
  }
}
