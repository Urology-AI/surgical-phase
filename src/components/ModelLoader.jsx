import React from 'react'
import { RefreshCw, CheckCircle2, Loader2 } from 'lucide-react'

function ModelLoader({ isModelLoaded, onLoadModel, status }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">AI Model Status</h2>
          </div>
          {status && (
            <p className="text-sm text-gray-600 mt-1">{status}</p>
          )}
        </div>
        <button
          onClick={onLoadModel}
          disabled={isModelLoaded}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
            isModelLoaded
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {isModelLoaded ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Ready
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Initialize Model
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ModelLoader
