import { useState } from 'react'
import { Plane, ChevronRight } from 'lucide-react'
import AircraftSelector from './components/AircraftSelector'
import AircraftDetails from './components/AircraftDetails'
import LoadInputs from './components/LoadInputs'
import TrimChart from './components/TrimChart'
import CGChart from './components/CGChart'
import MassSummary from './components/MassSummary'
import { computeLoadsheet } from './data/aircraft'

function buildDefaultLoad(aircraft) {
  if (!aircraft) return {}
  const halfPax = Math.floor(aircraft.maxPax / 3)
  return {
    paxFwd:   halfPax * aircraft.paxWeightKg,
    paxMid:   halfPax * aircraft.paxWeightKg,
    paxAft:   halfPax * aircraft.paxWeightKg,
    bagFwd:   halfPax * aircraft.bagWeightKg,
    bagAft:   halfPax * aircraft.bagWeightKg,
    cargoFwd: 0,
    cargoAft: 0,
    fuel:     Math.round(aircraft.maxWingFuel * 0.5),
    taxiFuel: aircraft.taxiFuelBurn,
    potWater: 150,
  }
}

export default function App() {
  const [aircraft, setAircraft] = useState(null)
  const [load, setLoad] = useState({})
  const [activeTab, setActiveTab] = useState('chart')

  const TABS = [
    { id: 'chart',   label: 'Trim Chart' },
    { id: 'cg',      label: 'CG Envelope' },
    { id: 'details', label: 'Aircraft Details' },
  ]

  function handleSelectAircraft(ac) {
    setAircraft(ac)
    setLoad(buildDefaultLoad(ac))
  }

  const result = aircraft ? computeLoadsheet(aircraft, load) : null

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-sky-400">
          <Plane size={22} className="rotate-45" />
          <span className="font-bold text-lg tracking-tight">LoadSheet</span>
          <span className="text-slate-600 text-sm font-normal ml-1">Offline W&amp;B Tool</span>
        </div>
        <ChevronRight size={14} className="text-slate-600" />
        <AircraftSelector selected={aircraft} onSelect={handleSelectAircraft} />
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400">Offline</span>
        </div>
      </header>

      {!aircraft ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
          <Plane size={56} className="rotate-45 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">Select an aircraft to begin</p>
          <p className="text-sm">Use the dropdown above to pick an aircraft type</p>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Load Distribution</p>
              <p className="text-sm text-slate-300 mt-0.5">{aircraft.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <LoadInputs aircraft={aircraft} load={load} onChange={setLoad} />
            </div>
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 shrink-0 bg-slate-950">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-5 flex gap-5">
              {activeTab === 'chart' && (
                <>
                  <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-5 min-w-0">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      Load &amp; Trim Envelope
                    </h2>
                    <TrimChart aircraft={aircraft} result={result} />
                  </div>
                  <div className="w-64 shrink-0 bg-slate-900 rounded-2xl border border-slate-800 p-5">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      Mass Summary
                    </h2>
                    <MassSummary aircraft={aircraft} result={result} />
                  </div>
                </>
              )}
              {activeTab === 'cg' && (
                <>
                  <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-5 min-w-0">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      CG Envelope (%MAC vs Gross Mass)
                    </h2>
                    <CGChart aircraft={aircraft} result={result} />
                  </div>
                  <div className="w-64 shrink-0 bg-slate-900 rounded-2xl border border-slate-800 p-5">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      Mass Summary
                    </h2>
                    <MassSummary aircraft={aircraft} result={result} />
                  </div>
                </>
              )}
              {activeTab === 'details' && (
                <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
                    Aircraft Specifications
                  </h2>
                  <AircraftDetails aircraft={aircraft} />
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
