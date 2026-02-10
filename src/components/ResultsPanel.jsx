import React from 'react'
import { Activity, Film, Loader2, Clock, BarChart3 } from 'lucide-react'

function ResultsPanel({
  currentPhase,
  confidence,
  frameCount,
  isProcessing,
  framesPerPrediction,
  status,
}) {
  return (
    <div className="space-y-4">
      {/* Current Phase Display */}
      <div className="card border-l-4 border-l-[#212070]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#212070]/10 rounded-lg">
            <Activity className="w-5 h-5 text-[#212070]" />
          </div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Surgical Phase</h2>
        </div>
        
        <div className="py-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {currentPhase}
          </div>
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
              <Loader2 className="w-4 h-4 text-[#06ABEB] animate-spin" />
              <span>Analyzing video frames...</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">System Metrics</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 text-gray-700">
              <Film className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Frames Captured</span>
            </div>
            <span className="font-semibold text-gray-900">{frameCount}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Processing Status</span>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <Loader2 className="w-4 h-4 text-[#06ABEB] animate-spin" />
              )}
              <span className={`text-sm font-medium ${isProcessing ? 'text-[#06ABEB]' : 'text-gray-500'}`}>
                {isProcessing ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-gray-700">Batch Size</span>
            <span className="font-semibold text-gray-900">{framesPerPrediction} frames</span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#06ABEB] rounded-full"></div>
            <span className="text-sm text-gray-700 font-medium">{status}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPanel
