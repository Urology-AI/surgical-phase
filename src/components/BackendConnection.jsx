import React from 'react'
import { Server, CheckCircle2, Wifi } from 'lucide-react'

function BackendConnection({ backendUrl, setBackendUrl, isConnected, onTestConnection }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#212070]/10 rounded-lg">
          <Server className="w-5 h-5 text-[#212070]" />
        </div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">System Connection</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="backend-url" className="block text-sm font-medium text-gray-700 mb-2">
            Server Endpoint
          </label>
          <div className="flex gap-3">
            <input
              id="backend-url"
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="Enter server URL"
              className="input-field flex-1"
            />
            <button
              onClick={onTestConnection}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Wifi className="w-4 h-4" />
              Connect
            </button>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-3 py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-800">Connected to analysis server</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BackendConnection
