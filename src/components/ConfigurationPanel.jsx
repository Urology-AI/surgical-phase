import React from 'react'
import { Settings, Info } from 'lucide-react'

function ConfigurationPanel({
  framesPerPrediction,
  setFramesPerPrediction,
  minFrames,
  setMinFrames,
  maxFrames,
  setMaxFrames,
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Analysis Parameters</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="frames-per-prediction" className="block text-sm font-medium text-gray-700 mb-2">
            Frames per Prediction
          </label>
          <input
            id="frames-per-prediction"
            type="number"
            min="5"
            max="50"
            value={framesPerPrediction}
            onChange={(e) => setFramesPerPrediction(parseInt(e.target.value) || 20)}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="min-frames" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Buffer
          </label>
          <input
            id="min-frames"
            type="number"
            min="5"
            max="30"
            value={minFrames}
            onChange={(e) => setMinFrames(parseInt(e.target.value) || 15)}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="max-frames" className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Buffer
          </label>
          <input
            id="max-frames"
            type="number"
            min="20"
            max="100"
            value={maxFrames}
            onChange={(e) => setMaxFrames(parseInt(e.target.value) || 30)}
            className="input-field"
          />
        </div>
      </div>
      
      <div className="flex items-start gap-3 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg">
        <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          System processes <strong className="text-gray-900">{framesPerPrediction}</strong> frames per analysis cycle.
          Frame buffer range: <strong className="text-gray-900">{minFrames}</strong> - <strong className="text-gray-900">{maxFrames}</strong> frames.
        </p>
      </div>
    </div>
  )
}

export default ConfigurationPanel
