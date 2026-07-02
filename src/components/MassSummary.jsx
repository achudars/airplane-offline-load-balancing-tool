import { AlertTriangle, CheckCircle } from 'lucide-react'
import AircraftTiltIndicator from './AircraftTiltIndicator'

function MassRow({ label, value, limit }) {
  const over = limit != null && value > limit
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${over ? 'border border-red-600/40 bg-red-900/20' : 'bg-slate-800/40'}`}>
      <span className="text-xs text-slate-400">{label}</span>
      <div className="text-right">
        <span className={`font-mono font-bold text-sm ${over ? 'text-red-400' : 'text-white'}`}>
          {value.toLocaleString()}
          <span className="text-slate-500 font-normal text-xs"> kg</span>
        </span>
        {limit != null && (
          <div className="text-xs text-slate-600">max {limit.toLocaleString()}</div>
        )}
      </div>
    </div>
  )
}

function IndexRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-1 px-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`font-mono text-sm font-semibold ${color}`}>{value.toFixed(1)}</span>
    </div>
  )
}

function indexToMAC(index) {
  return 9 + (index / 100) * 30
}

export default function MassSummary({ aircraft, result }) {
  if (!aircraft || !result) return null
  const { zfm, tom, lm, zfmIndex, tomIndex } = result

  const zfmOk = zfm <= aircraft.mzfw
  const tomOk = tom <= aircraft.mtow
  const lmOk  = lm  <= aircraft.mlm
  const allOk = zfmOk && tomOk && lmOk

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${allOk ? 'text-emerald-400' : 'text-red-400'}`}>
        {allOk
          ? <><CheckCircle size={13} /> All masses within limits</>
          : <><AlertTriangle size={13} /> Mass limit exceeded</>
        }
      </div>

      <AircraftTiltIndicator aircraft={aircraft} result={result} />

      <MassRow label="DOW (empty)"       value={aircraft.dow} />
      <MassRow label="Zero Fuel Mass"    value={zfm}  limit={aircraft.mzfw} />
      <MassRow label="Take-Off Mass"     value={tom}  limit={aircraft.mtow} />
      <MassRow label="Landing Mass"      value={lm}   limit={aircraft.mlm} />

      <div className="mt-4 pt-3 border-t border-slate-700 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 px-3 mb-2">CG Index</p>
        <IndexRow label="ZFM index" value={zfmIndex} color="text-sky-300" />
        <IndexRow label="TOF index" value={tomIndex}  color="text-amber-300" />
      </div>

      <div className="pt-3 border-t border-slate-700 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 px-3 mb-2">%MAC estimate</p>
        <IndexRow label="ZFM %MAC" value={indexToMAC(zfmIndex)} color="text-sky-300" />
        <IndexRow label="TOF %MAC" value={indexToMAC(tomIndex)}  color="text-amber-300" />
      </div>
    </div>
  )
}
