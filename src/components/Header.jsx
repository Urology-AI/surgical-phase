import React from 'react'
import { Activity, Stethoscope } from 'lucide-react'

function Header() {
  return (
    <header className="bg-[#212070] border-b-4 border-[#06ABEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-white rounded-lg shadow-sm">
            <Stethoscope className="w-7 h-7 text-[#212070]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
              Surgical Phase Recognition System
            </h1>
            <p className="text-blue-100 text-sm font-normal">
              Mount Sinai Health System • AI-Powered Real-Time Analysis
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Activity className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
