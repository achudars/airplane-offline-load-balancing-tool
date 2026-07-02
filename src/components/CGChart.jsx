import {
  ResponsiveContainer, ComposedChart, Line, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts'

/**
 * Linear mapping used throughout this tool:
 *   index 0  → 9 %MAC
 *   index 100 → 39 %MAC
 */
function indexToMac(index) {
  return 9 + (index / 100) * 30
}

/** Convert index-based polygon vertices to %MAC-based line dataset */
function polygonToMacLine(vertices) {
  return [...vertices, vertices[0]].map(v => ({
    x: Number.parseFloat(indexToMac(v.index).toFixed(2)),
    y: v.mass,
  }))
}

/** Point-in-polygon test on the original index-space polygon */
function pointInPolygon(px, py, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].index, yi = polygon[i].mass
    const xj = polygon[j].index, yj = polygon[j].mass
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside
  }
  return inside
}

const PointTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d?.label) return null
  return (
    <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{d.label}</p>
      <p className="text-sky-300">CG: {d.x?.toFixed(1)} %MAC</p>
      <p className="text-emerald-300">Mass: {d.y?.toLocaleString()} kg</p>
    </div>
  )
}

const DotShape = ({ cx, cy, payload }) => {
  if (!payload) return null
  const color = payload.ok ? '#22c55e' : '#ef4444'
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={color} stroke="#1a2232" strokeWidth={2} />
      <text x={cx + 13} y={cy + 4} fill={color} fontSize={11} fontWeight="bold">{payload.label}</text>
    </g>
  )
}

export default function CGChart({ aircraft, result }) {
  if (!aircraft || !result) return null

  const { zfm, tom, zfmIndex, tomIndex } = result

  const zfmMac = Number.parseFloat(indexToMac(zfmIndex).toFixed(2))
  const tomMac = Number.parseFloat(indexToMac(tomIndex).toFixed(2))

  const zfmOk = zfm <= aircraft.mzfw && pointInPolygon(zfmIndex, zfm, aircraft.envelope)
  const tomOk = tom <= aircraft.mtow && pointInPolygon(tomIndex, tom, aircraft.mtowEnvelope)
  const allOk = zfmOk && tomOk

  const envLine  = polygonToMacLine(aircraft.envelope)
  const mtowLine = polygonToMacLine(aircraft.mtowEnvelope)

  /* ── axis domain ── */
  const allMacs = [
    ...aircraft.envelope.map(v => indexToMac(v.index)),
    ...aircraft.mtowEnvelope.map(v => indexToMac(v.index)),
  ]
  const allMasses = [
    ...aircraft.envelope.map(v => v.mass),
    ...aircraft.mtowEnvelope.map(v => v.mass),
    zfm, tom,
  ]
  const macMin  = Math.max(0,   Math.min(...allMacs)   - 3)
  const macMax  = Math.min(50,  Math.max(...allMacs)   + 3)
  const massMin = Math.min(...allMasses) * 0.94
  const massMax = Math.max(...allMasses) * 1.03

  const points = [
    { x: zfmMac, y: zfm,  label: 'ZFM', ok: zfmOk },
    { x: tomMac, y: tom,  label: 'TOF', ok: tomOk },
  ]

  return (
    <div className="space-y-3">
      {/* Status banner */}
      <div className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border ${
        allOk
          ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
          : 'bg-red-900/40 text-red-300 border-red-700/50'
      }`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${allOk ? 'bg-emerald-400' : 'bg-red-400'}`} />
        {allOk
          ? 'WITHIN LIMITS — Aircraft is safe to dispatch'
          : 'OUT OF LIMITS — Adjust load distribution'}
      </div>

      <div style={{ height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 90, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d4a6a" />

            <XAxis
              dataKey="x"
              type="number"
              domain={[macMin, macMax]}
              tickCount={10}
              tickFormatter={v => `${v.toFixed(0)}%`}
              tick={{ fill: '#98c1d9', fontSize: 11 }}
              label={{
                value: 'Centre of Gravity (%MAC)',
                position: 'insideBottom',
                offset: -12,
                fill: '#c5e6f0',
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={[massMin, massMax]}
              tickFormatter={v => `${Math.round(v / 1000)}t`}
              tick={{ fill: '#98c1d9', fontSize: 11 }}
              width={45}
              label={{
                value: 'Gross Mass (kg)',
                angle: -90,
                position: 'insideLeft',
                offset: 15,
                fill: '#c5e6f0',
                fontSize: 12,
              }}
            />

            <Tooltip content={<PointTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontSize: 11, color: '#98c1d9', paddingBottom: 8 }}
            />

            {/* ZFW envelope polygon */}
            <Line
              data={envLine} dataKey="y" name="ZFW Envelope"
              type="linear" stroke="#82c0cc" strokeWidth={2} dot={false} legendType="line"
            />

            {/* MTOW envelope polygon */}
            <Line
              data={mtowLine} dataKey="y" name="TOF Envelope"
              type="linear" stroke="#ffa62b" strokeWidth={2} strokeDasharray="6 3"
              dot={false} legendType="line"
            />

            {/* Weight limit reference lines */}
            <ReferenceLine
              y={aircraft.mzfw} stroke="#82c0cc" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: 'MZFW', fill: '#82c0cc', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={aircraft.mtow} stroke="#ffa62b" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: 'MTOW', fill: '#ffa62b', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={aircraft.mlm} stroke="#ffa62b" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: 'MLM', fill: '#ffa62b', fontSize: 10, position: 'right' }}
            />

            {/* Operating points */}
            <Scatter data={points} name="Operating Points" shape={DotShape} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* CG readout */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 rounded-xl px-4 py-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">ZFM Centre of Gravity</p>
          <p className="text-lg font-bold text-sky-300">{zfmMac.toFixed(1)} <span className="text-sm font-normal text-slate-400">%MAC</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Index {zfmIndex.toFixed(1)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl px-4 py-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">TOF Centre of Gravity</p>
          <p className="text-lg font-bold text-amber-400">{tomMac.toFixed(1)} <span className="text-sm font-normal text-slate-400">%MAC</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Index {tomIndex.toFixed(1)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> ZFM/TOF within limits</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Out of limits</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-sky-300" /> ZFW envelope</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-dashed border-amber-400" /> TOF envelope</span>
      </div>
    </div>
  )
}
