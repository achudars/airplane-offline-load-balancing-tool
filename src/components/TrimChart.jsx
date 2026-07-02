import {
  ResponsiveContainer, ComposedChart, Line, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend
} from 'recharts'

/** Convert polygon vertices to a recharts-compatible line dataset */
function polygonToLine(vertices) {
  return [...vertices, vertices[0]].map(v => ({ x: v.index, y: v.mass }))
}

/** Point-in-polygon ray-casting test */
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
      <p className="text-sky-300">Index: {d.x?.toFixed(1)}</p>
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

export default function TrimChart({ aircraft, result }) {
  if (!aircraft || !result) return null

  const { zfm, tom, zfmIndex, tomIndex } = result

  const envLine  = polygonToLine(aircraft.envelope)
  const mtowLine = polygonToLine(aircraft.mtowEnvelope)

  const allMasses = [
    ...aircraft.envelope.map(v => v.mass),
    ...aircraft.mtowEnvelope.map(v => v.mass),
    zfm, tom,
  ]
  const allIndexes = [
    ...aircraft.envelope.map(v => v.index),
    ...aircraft.mtowEnvelope.map(v => v.index),
  ]
  const massMin  = Math.min(...allMasses) * 0.94
  const massMax  = Math.max(...allMasses) * 1.03
  const indexMin = Math.max(0,   Math.min(...allIndexes) - 6)
  const indexMax = Math.min(100, Math.max(...allIndexes) + 6)

  const zfmOk = zfm <= aircraft.mzfw && pointInPolygon(zfmIndex, zfm, aircraft.envelope)
  const tomOk = tom <= aircraft.mtow && pointInPolygon(tomIndex, tom, aircraft.mtowEnvelope)
  const allOk = zfmOk && tomOk

  const points = [
    { x: zfmIndex, y: zfm, label: 'ZFM', ok: zfmOk },
    { x: tomIndex, y: tom, label: 'TOF', ok: tomOk },
  ]

  return (
    <div className="space-y-3">
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
          <ComposedChart margin={{ top: 10, right: 80, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d4a6a" />

            <XAxis
              dataKey="x" type="number"
              domain={[indexMin, indexMax]}
              tickCount={12}
              tick={{ fill: '#98c1d9', fontSize: 11 }}
              label={{ value: 'Loaded Index', position: 'insideBottom', offset: -12, fill: '#c5e6f0', fontSize: 12 }}
            />
            <YAxis
              dataKey="y" type="number"
              domain={[massMin, massMax]}
              tickFormatter={v => `${Math.round(v / 1000)}t`}
              tick={{ fill: '#98c1d9', fontSize: 11 }}
              width={45}
              label={{ value: 'Gross Mass (kg)', angle: -90, position: 'insideLeft', offset: 15, fill: '#c5e6f0', fontSize: 12 }}
            />

            <Tooltip content={<PointTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, color: '#98c1d9', paddingBottom: 8 }} />

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
            <ReferenceLine y={aircraft.mzfw} stroke="#82c0cc" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: `MZFW`, fill: '#82c0cc', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={aircraft.mtow} stroke="#ffa62b" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: `MTOW`, fill: '#ffa62b', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={aircraft.mlm} stroke="#ffa62b" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: `MLM`, fill: '#ffa62b', fontSize: 10, position: 'right' }} />

            {/* Operating points */}
            <Scatter data={points} name="Operating Points" shape={DotShape} />
          </ComposedChart>
        </ResponsiveContainer>
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
