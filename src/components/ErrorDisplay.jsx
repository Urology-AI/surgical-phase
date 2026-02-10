import React from 'react'
import { AlertCircle, X } from 'lucide-react'

function ErrorDisplay({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="card border-l-4 border-l-red-500 bg-red-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900 mb-1">System Error</p>
          <p className="text-sm text-red-800">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorDisplay
