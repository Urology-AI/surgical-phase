import { useState } from 'react'

export function useBackend(backendUrl) {
  const [isConnected, setIsConnected] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const testConnection = async () => {
    if (!backendUrl) {
      setError('Please enter a backend URL')
      return
    }

    try {
      setError('')
      setStatus('Testing connection...')
      const response = await fetch(`${backendUrl}/health`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'healthy') {
        setIsConnected(true)
        setStatus('Connected to backend')
        setError('')
      } else {
        setIsConnected(false)
        setError('Backend returned unexpected status')
      }
    } catch (err) {
      setIsConnected(false)
      setError(`Failed to connect to backend: ${err.message}`)
      setStatus('')
    }
  }

  const loadModel = async () => {
    if (!isConnected) {
      setError('Please connect to backend first')
      return
    }

    try {
      setError('')
      setStatus('Loading model...')
      const response = await fetch(`${backendUrl}/load-model`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'success') {
        setIsModelLoaded(true)
        setStatus(`Model loaded: ${data.num_classes} classes detected`)
        setError('')
      } else {
        setError('Failed to load model')
        setStatus('')
      }
    } catch (err) {
      setError(`Error loading model: ${err.message}`)
      setStatus('')
    }
  }

  return {
    isConnected,
    isModelLoaded,
    status,
    error,
    testConnection,
    loadModel,
  }
}
