import { Users, Package, Fuel, Droplets, Luggage } from 'lucide-react'

function SliderRow({ label, icon: Icon, value, min, max, step = 1, onChange, warn }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-slate-300">
          {Icon && <Icon size={12} className="text-slate-500" />}
          {label}
        </span>
        <span className={`font-mono font-semibold ${warn ? 'text-red-400' : 'text-sky-300'}`}>
          {value.toLocaleString()} kg
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full accent-sky-400 cursor-pointer"
        />
        <span className="text-xs text-slate-600 w-7 text-right">{pct}%</span>
      </div>
      {warn && <p className="text-xs text-red-400">{warn}</p>}
    </div>
  )
}

export default function LoadInputs({ aircraft, load, onChange }) {
  if (!aircraft) return null
  const set = key => val => onChange({ ...load, [key]: val })

  const paxCountFwd = Math.round(load.paxFwd / aircraft.paxWeightKg)
  const paxCountMid = Math.round(load.paxMid / aircraft.paxWeightKg)
  const paxCountAft = Math.round(load.paxAft / aircraft.paxWeightKg)
  const totalPax    = paxCountFwd + paxCountMid + paxCountAft
  const cargoTotal  = (load.cargoFwd || 0) + (load.cargoAft || 0) + (load.bagFwd || 0) + (load.bagAft || 0)
  const maxPaxZone  = Math.round(aircraft.maxPax / 3) * aircraft.paxWeightKg

  return (
    <div className="space-y-6 text-sm">

      <section>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          <Users size={12} /> Passengers ({totalPax} / {aircraft.maxPax})
        </h3>
        <div className="space-y-3">
          <SliderRow label={`${aircraft.stations.paxFwd.label} (${paxCountFwd} pax)`}
            value={load.paxFwd} min={0} max={maxPaxZone} step={aircraft.paxWeightKg}
            onChange={set('paxFwd')}
            warn={totalPax > aircraft.maxPax ? `Exceeds max ${aircraft.maxPax}` : null} />
          <SliderRow label={`${aircraft.stations.paxMid.label} (${paxCountMid} pax)`}
            value={load.paxMid} min={0} max={maxPaxZone} step={aircraft.paxWeightKg}
            onChange={set('paxMid')} />
          <SliderRow label={`${aircraft.stations.paxAft.label} (${paxCountAft} pax)`}
            value={load.paxAft} min={0} max={maxPaxZone} step={aircraft.paxWeightKg}
            onChange={set('paxAft')} />
        </div>
        <p className="mt-1.5 text-xs text-slate-600">{aircraft.paxWeightKg} kg/pax std (incl. carry-on)</p>
      </section>

      <section>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          <Luggage size={12} /> Checked Baggage
        </h3>
        <div className="space-y-3">
          <SliderRow label="Fwd hold bags" value={load.bagFwd} min={0} max={Math.round(aircraft.maxCargo / 2)} step={10} onChange={set('bagFwd')} />
          <SliderRow label="Aft hold bags" value={load.bagAft} min={0} max={Math.round(aircraft.maxCargo / 2)} step={10} onChange={set('bagAft')} />
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          <Package size={12} /> Cargo ({cargoTotal.toLocaleString()} / {aircraft.maxCargo.toLocaleString()} kg)
        </h3>
        <div className="space-y-3">
          <SliderRow label={aircraft.stations.cargoFwd.label}
            value={load.cargoFwd} min={0} max={Math.round(aircraft.maxCargo / 2)} step={10} onChange={set('cargoFwd')}
            warn={cargoTotal > aircraft.maxCargo ? 'Total cargo exceeds limit' : null} />
          <SliderRow label={aircraft.stations.cargoAft.label}
            value={load.cargoAft} min={0} max={Math.round(aircraft.maxCargo / 2)} step={10} onChange={set('cargoAft')} />
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          <Fuel size={12} /> Fuel
        </h3>
        <div className="space-y-3">
          <SliderRow label="Block fuel" icon={Fuel}
            value={load.fuel} min={0} max={aircraft.maxWingFuel} step={50} onChange={set('fuel')} />
          <SliderRow label="Taxi fuel"
            value={load.taxiFuel} min={0} max={aircraft.taxiFuelBurn * 5} step={10} onChange={set('taxiFuel')} />
        </div>
        <p className="mt-1.5 text-xs text-slate-600">Typical taxi fuel: {aircraft.taxiFuelBurn} kg</p>
      </section>

      <section>
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          <Droplets size={12} /> Potable Water
        </h3>
        <SliderRow label="Water quantity"
          value={load.potWater} min={0} max={500} step={10} onChange={set('potWater')} />
      </section>
    </div>
  )
}
