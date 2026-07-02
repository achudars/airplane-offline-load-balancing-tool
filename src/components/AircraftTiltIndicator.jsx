import { Plane } from 'lucide-react'

/**
 * Visualises the aircraft CG balance as a tilting airplane icon.
 *
 * Tilt logic (based on ZFM index vs ZFW envelope centre):
 *   Forward CG (nose heavy) → nose tilts down  → icon rotates clockwise past 45°
 *   Balanced               → horizontal        → icon at 45°
 *   Aft CG (tail heavy)    → nose tilts up     → icon rotates counter-clockwise from 45°
 */
export default function AircraftTiltIndicator({ aircraft, result }) {
  if (!aircraft || !result) return null

  const allIdx   = aircraft.envelope.map(v => v.index)
  const envMin   = Math.min(...allIdx)
  const envMax   = Math.max(...allIdx)
  const envCenter    = (envMin + envMax) / 2
  const envHalfWidth = (envMax - envMin) / 2

  // Signed deviation: positive = aft of centre, negative = fwd of centre
  const deviation = (result.zfmIndex - envCenter) / envHalfWidth

  // Aft CG → nose UP → subtract from base 45° rotation
  const MAX_TILT = 22
  const tiltDeg  = -Math.max(-MAX_TILT, Math.min(MAX_TILT, deviation * MAX_TILT))
  const totalRot = 45 + tiltDeg

  const isOutOfLimits = Math.abs(deviation) > 1
  const isBiased      = Math.abs(deviation) > 0.4

  let label, colorClass, bgClass, subLabel
  if (deviation < -0.4) {
    label      = 'NOSE HEAVY'
    colorClass = isOutOfLimits ? 'text-red-400' : 'text-amber-400'
    bgClass    = isOutOfLimits ? 'bg-slate-950 border-red-500/70' : 'bg-slate-950 border-amber-400/70'
    subLabel   = 'Forward CG — increase aft load or move fuel aft'
  } else if (deviation > 0.4) {
    label      = 'TAIL HEAVY'
    colorClass = isOutOfLimits ? 'text-red-400' : 'text-amber-400'
    bgClass    = isOutOfLimits ? 'bg-slate-950 border-red-500/70' : 'bg-slate-950 border-amber-400/70'
    subLabel   = 'Aft CG — increase fwd load or reduce aft load'
  } else {
    label      = 'BALANCED'
    colorClass = 'text-emerald-400'
    bgClass    = 'bg-slate-950 border-emerald-700/60'
    subLabel   = 'CG within balanced range'
  }

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-4 ${bgClass}`}>
      {/* Tilting airplane icon */}
      <div
        style={{
          transform: `rotate(${totalRot}deg)`,
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        className="shrink-0"
      >
        <Plane size={32} className={colorClass} />
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold tracking-widest uppercase ${colorClass}`}>{label}</p>
        {isBiased || isOutOfLimits ? (
          <p className="text-xs text-slate-400 mt-0.5 leading-tight">{subLabel}</p>
        ) : (
          <p className="text-xs text-slate-400 mt-0.5">
            CG {result.zfmIndex.toFixed(1)} idx · {(9 + (result.zfmIndex / 100) * 30).toFixed(1)}% MAC
          </p>
        )}
      </div>
    </div>
  )
}
