import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Plane } from 'lucide-react'
import { AIRCRAFT } from '../data/aircraft'

export default function AircraftSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const filtered = AIRCRAFT.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.icao.toLowerCase().includes(query.toLowerCase()) ||
    a.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
    a.type.toLowerCase().includes(query.toLowerCase())
  )

  const groups = filtered.reduce((acc, ac) => {
    if (!acc[ac.manufacturer]) acc[ac.manufacturer] = []
    acc[ac.manufacturer].push(ac)
    return acc
  }, {})

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(ac) {
    onSelect(ac)
    setOpen(false)
    setQuery('')
  }

  const typeColors = {
    'Narrowbody':   'bg-slate-950 text-sky-400',
    'Widebody':     'bg-slate-950 text-amber-400',
    'Regional jet': 'bg-slate-950 text-emerald-400',
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 bg-slate-800 border border-slate-600 hover:border-slate-400 rounded-xl px-4 py-2.5 text-left transition-colors"
      >
        <Plane size={16} className="text-sky-400 shrink-0" />
        {selected
          ? <span className="flex-1 text-white font-medium">{selected.name}</span>
          : <span className="flex-1 text-slate-400">Select aircraft…</span>}
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, ICAO, manufacturer…"
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {Object.keys(groups).length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">No aircraft found</p>
            )}
            {Object.entries(groups).map(([mfr, planes]) => (
              <div key={mfr}>
                <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                  {mfr}
                </p>
                {planes.map(ac => (
                  <button
                    key={ac.id}
                    onClick={() => handleSelect(ac)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-700 transition-colors text-left ${
                      selected?.id === ac.id ? 'bg-slate-700' : ''
                    }`}
                  >
                    <span className="flex-1 text-white">{ac.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{ac.icao}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeColors[ac.type] || 'bg-slate-700 text-slate-300'}`}>
                      {ac.type}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
