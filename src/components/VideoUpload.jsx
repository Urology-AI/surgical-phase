import React from 'react'
import { Upload, Video } from 'lucide-react'

function VideoUpload({ onVideoSelect }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-5 h-5 text-gray-600" />
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Video Source</h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#212070] hover:bg-gray-50 transition-colors cursor-pointer group">
        <label htmlFor="video-upload" className="cursor-pointer">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#212070]/10 transition-colors">
              <Upload className="w-8 h-8 text-gray-600 group-hover:text-[#212070]" />
            </div>
          </div>
          <span className="text-gray-700 font-medium block mb-1">
            Select surgical video file
          </span>
          <span className="text-xs text-gray-500">
            Supported formats: MP4, AVI, MOV
          </span>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={onVideoSelect}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}

export default VideoUpload
