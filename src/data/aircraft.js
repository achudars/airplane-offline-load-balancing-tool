/**
 * Aircraft weight & balance database.
 * All masses in kg. Index values are dimensionless (0–100 scale).
 *
 * Index formula (per station):
 *   indexDelta = mass_kg * armFactor * 1000
 * Total index = dowIndex + sum(indexDelta for all loaded stations)
 */

export const AIRCRAFT = [
  // ─── Boeing 737-800 ───────────────────────────────────────────────────────
  {
    id: "b737-800",
    name: "Boeing 737-800",
    manufacturer: "Boeing",
    type: "Narrowbody",
    icao: "B738",
    dow: 41413,
    mzfw: 61688,
    mtow: 79016,
    mlm: 66360,
    maxWingFuel: 26020,
    maxPax: 189,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 14000,
    engines: 2,
    taxiFuelBurn: 200,
    dowIndex: 48.2,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-12)", armFactor: 0.00021 },
      paxMid: { label: "Pax Zone B (rows 13-24)", armFactor: 0.00026 },
      paxAft: { label: "Pax Zone C (rows 25-32)", armFactor: 0.00031 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.00018 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.00033 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.000255 },
      potWater: { label: "Potable Water", armFactor: 0.000265 },
    },
    envelope: [
      { index: 33, mass: 41413 },
      { index: 58, mass: 41413 },
      { index: 62, mass: 55000 },
      { index: 65, mass: 61688 },
      { index: 30, mass: 61688 },
      { index: 27, mass: 55000 },
      { index: 25, mass: 47000 },
      { index: 33, mass: 41413 },
    ],
    mtowEnvelope: [
      { index: 25, mass: 63000 },
      { index: 70, mass: 63000 },
      { index: 74, mass: 79016 },
      { index: 20, mass: 79016 },
      { index: 25, mass: 63000 },
    ],
  },

  // ─── Boeing 757-200 ───────────────────────────────────────────────────────
  {
    id: "b757-200",
    name: "Boeing 757-200",
    manufacturer: "Boeing",
    type: "Narrowbody",
    icao: "B752",
    dow: 57975,
    mzfw: 83460,
    mtow: 115680,
    mlm: 89810,
    maxWingFuel: 42680,
    maxPax: 239,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 20000,
    engines: 2,
    taxiFuelBurn: 350,
    dowIndex: 50.0,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-15)", armFactor: 0.00019 },
      paxMid: { label: "Pax Zone B (rows 16-30)", armFactor: 0.00024 },
      paxAft: { label: "Pax Zone C (rows 31-42)", armFactor: 0.000295 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.000165 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.00031 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.000242 },
      potWater: { label: "Potable Water", armFactor: 0.00025 },
    },
    envelope: [
      { index: 30, mass: 57975 },
      { index: 65, mass: 57975 },
      { index: 70, mass: 70000 },
      { index: 72, mass: 83460 },
      { index: 28, mass: 83460 },
      { index: 26, mass: 70000 },
      { index: 30, mass: 57975 },
    ],
    mtowEnvelope: [
      { index: 22, mass: 85000 },
      { index: 78, mass: 85000 },
      { index: 82, mass: 115680 },
      { index: 18, mass: 115680 },
      { index: 22, mass: 85000 },
    ],
  },

  // ─── Boeing 777-200ER ─────────────────────────────────────────────────────
  {
    id: "b777-200er",
    name: "Boeing 777-200ER",
    manufacturer: "Boeing",
    type: "Widebody",
    icao: "B772",
    dow: 138100,
    mzfw: 208650,
    mtow: 297560,
    mlm: 213180,
    maxWingFuel: 117340,
    maxPax: 440,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 50000,
    engines: 2,
    taxiFuelBurn: 800,
    dowIndex: 49.0,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-20)", armFactor: 0.00015 },
      paxMid: { label: "Pax Zone B (rows 21-40)", armFactor: 0.0002 },
      paxAft: { label: "Pax Zone C (rows 41-60)", armFactor: 0.000255 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.00013 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.00027 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.000202 },
      potWater: { label: "Potable Water", armFactor: 0.00021 },
    },
    envelope: [
      { index: 32, mass: 138100 },
      { index: 60, mass: 138100 },
      { index: 68, mass: 180000 },
      { index: 70, mass: 208650 },
      { index: 28, mass: 208650 },
      { index: 24, mass: 180000 },
      { index: 32, mass: 138100 },
    ],
    mtowEnvelope: [
      { index: 20, mass: 210000 },
      { index: 80, mass: 210000 },
      { index: 85, mass: 297560 },
      { index: 15, mass: 297560 },
      { index: 20, mass: 210000 },
    ],
  },

  // ─── Airbus A320-200 ──────────────────────────────────────────────────────
  {
    id: "a320",
    name: "Airbus A320-200",
    manufacturer: "Airbus",
    type: "Narrowbody",
    icao: "A320",
    dow: 42400,
    mzfw: 61000,
    mtow: 77000,
    mlm: 66000,
    maxWingFuel: 18728,
    maxPax: 180,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 13500,
    engines: 2,
    taxiFuelBurn: 200,
    dowIndex: 47.5,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-12)", armFactor: 0.000215 },
      paxMid: { label: "Pax Zone B (rows 13-24)", armFactor: 0.000265 },
      paxAft: { label: "Pax Zone C (rows 25-30)", armFactor: 0.000315 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.000185 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.000335 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.00026 },
      potWater: { label: "Potable Water", armFactor: 0.00027 },
    },
    envelope: [
      { index: 30, mass: 42400 },
      { index: 60, mass: 42400 },
      { index: 66, mass: 55000 },
      { index: 68, mass: 61000 },
      { index: 27, mass: 61000 },
      { index: 24, mass: 55000 },
      { index: 30, mass: 42400 },
    ],
    mtowEnvelope: [
      { index: 22, mass: 63000 },
      { index: 74, mass: 63000 },
      { index: 78, mass: 77000 },
      { index: 18, mass: 77000 },
      { index: 22, mass: 63000 },
    ],
  },

  // ─── Airbus A321-200 ──────────────────────────────────────────────────────
  {
    id: "a321-200",
    name: "Airbus A321-200",
    manufacturer: "Airbus",
    type: "Narrowbody",
    icao: "A321",
    dow: 48500,
    mzfw: 73800,
    mtow: 93500,
    mlm: 77800,
    maxWingFuel: 23700,
    maxPax: 220,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 17000,
    engines: 2,
    taxiFuelBurn: 250,
    dowIndex: 48.0,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-14)", armFactor: 0.000195 },
      paxMid: { label: "Pax Zone B (rows 15-28)", armFactor: 0.000248 },
      paxAft: { label: "Pax Zone C (rows 29-37)", armFactor: 0.000302 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.000165 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.000325 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.00025 },
      potWater: { label: "Potable Water", armFactor: 0.000258 },
    },
    envelope: [
      { index: 28, mass: 48500 },
      { index: 62, mass: 48500 },
      { index: 68, mass: 62000 },
      { index: 70, mass: 73800 },
      { index: 26, mass: 73800 },
      { index: 22, mass: 62000 },
      { index: 28, mass: 48500 },
    ],
    mtowEnvelope: [
      { index: 18, mass: 76000 },
      { index: 78, mass: 76000 },
      { index: 82, mass: 93500 },
      { index: 14, mass: 93500 },
      { index: 18, mass: 76000 },
    ],
  },

  // ─── Airbus A330-200 ──────────────────────────────────────────────────────
  {
    id: "a330-200",
    name: "Airbus A330-200",
    manufacturer: "Airbus",
    type: "Widebody",
    icao: "A332",
    dow: 120500,
    mzfw: 170000,
    mtow: 242000,
    mlm: 182000,
    maxWingFuel: 97530,
    maxPax: 406,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 40000,
    engines: 2,
    taxiFuelBurn: 700,
    dowIndex: 48.5,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-18)", armFactor: 0.000155 },
      paxMid: { label: "Pax Zone B (rows 19-36)", armFactor: 0.000205 },
      paxAft: { label: "Pax Zone C (rows 37-54)", armFactor: 0.000262 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.000135 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.00028 },
      fuel: { label: "Wing / Centre Fuel", armFactor: 0.000208 },
      potWater: { label: "Potable Water", armFactor: 0.000215 },
    },
    envelope: [
      { index: 30, mass: 120500 },
      { index: 62, mass: 120500 },
      { index: 70, mass: 148000 },
      { index: 72, mass: 170000 },
      { index: 26, mass: 170000 },
      { index: 22, mass: 148000 },
      { index: 30, mass: 120500 },
    ],
    mtowEnvelope: [
      { index: 18, mass: 172000 },
      { index: 80, mass: 172000 },
      { index: 86, mass: 242000 },
      { index: 14, mass: 242000 },
      { index: 18, mass: 172000 },
    ],
  },

  // ─── Boeing 747-400 ───────────────────────────────────────────────────────
  {
    id: "b747-400",
    name: "Boeing 747-400",
    manufacturer: "Boeing",
    type: "Widebody",
    icao: "B744",
    dow: 178756,
    mzfw: 238815,
    mtow: 396890,
    mlm: 295742,
    maxWingFuel: 173940,
    maxPax: 524,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 55000,
    engines: 4,
    taxiFuelBurn: 1200,
    dowIndex: 50.5,
    stations: {
      paxFwd: { label: "Main Deck Fwd (rows 1-20)", armFactor: 0.00011 },
      paxMid: { label: "Main Deck Mid (rows 21-40)", armFactor: 0.000148 },
      paxAft: { label: "Main Deck Aft (rows 41-60)", armFactor: 0.000192 },
      cargoFwd: { label: "Fwd Lower Deck", armFactor: 0.000095 },
      cargoAft: { label: "Aft Lower Deck", armFactor: 0.0002 },
      fuel: { label: "Wing / Centre / Stab Fuel", armFactor: 0.000148 },
      potWater: { label: "Potable Water", armFactor: 0.000155 },
    },
    envelope: [
      { index: 32, mass: 178756 },
      { index: 62, mass: 178756 },
      { index: 72, mass: 220000 },
      { index: 74, mass: 238815 },
      { index: 28, mass: 238815 },
      { index: 24, mass: 220000 },
      { index: 32, mass: 178756 },
    ],
    mtowEnvelope: [
      { index: 18, mass: 242000 },
      { index: 82, mass: 242000 },
      { index: 88, mass: 396890 },
      { index: 12, mass: 396890 },
      { index: 18, mass: 242000 },
    ],
  },

  // ─── Embraer E190 ─────────────────────────────────────────────────────────
  {
    id: "e190",
    name: "Embraer E190",
    manufacturer: "Embraer",
    type: "Regional jet",
    icao: "E190",
    dow: 28080,
    mzfw: 40600,
    mtow: 51800,
    mlm: 44800,
    maxWingFuel: 13986,
    maxPax: 114,
    paxWeightKg: 84,
    bagWeightKg: 13,
    maxCargo: 8000,
    engines: 2,
    taxiFuelBurn: 120,
    dowIndex: 48.0,
    stations: {
      paxFwd: { label: "Pax Zone A (rows 1-8)", armFactor: 0.00027 },
      paxMid: { label: "Pax Zone B (rows 9-16)", armFactor: 0.00033 },
      paxAft: { label: "Pax Zone C (rows 17-25)", armFactor: 0.000395 },
      cargoFwd: { label: "Fwd Cargo Hold", armFactor: 0.00023 },
      cargoAft: { label: "Aft Cargo Hold", armFactor: 0.00041 },
      fuel: { label: "Wing Fuel", armFactor: 0.00033 },
      potWater: { label: "Potable Water", armFactor: 0.000335 },
    },
    envelope: [
      { index: 32, mass: 28080 },
      { index: 60, mass: 28080 },
      { index: 65, mass: 35000 },
      { index: 67, mass: 40600 },
      { index: 28, mass: 40600 },
      { index: 25, mass: 35000 },
      { index: 32, mass: 28080 },
    ],
    mtowEnvelope: [
      { index: 22, mass: 42000 },
      { index: 73, mass: 42000 },
      { index: 77, mass: 51800 },
      { index: 18, mass: 51800 },
      { index: 22, mass: 42000 },
    ],
  },
];

export function getAircraftById(id) {
  return AIRCRAFT.find((a) => a.id === id) || null;
}

/**
 * Compute weight & balance from a load state object.
 * Returns { zfm, tom, lm, zfmIndex, tomIndex }
 */
export function computeLoadsheet(aircraft, load) {
  const {
    paxFwd = 0,
    paxMid = 0,
    paxAft = 0,
    bagFwd = 0,
    bagAft = 0,
    cargoFwd = 0,
    cargoAft = 0,
    fuel = 0,
    taxiFuel = 0,
    potWater = 0,
  } = load;

  const st = aircraft.stations;

  // Zero Fuel Mass
  const zfm =
    aircraft.dow +
    paxFwd +
    paxMid +
    paxAft +
    bagFwd +
    bagAft +
    cargoFwd +
    cargoAft +
    potWater;

  // Index delta from DOW — armFactor already encodes per-kg index contribution
  const zfmDelta =
    paxFwd * st.paxFwd.armFactor +
    paxMid * st.paxMid.armFactor +
    paxAft * st.paxAft.armFactor +
    bagFwd * st.cargoFwd.armFactor +
    bagAft * st.cargoAft.armFactor +
    cargoFwd * st.cargoFwd.armFactor +
    cargoAft * st.cargoAft.armFactor +
    potWater * st.potWater.armFactor;

  const zfmIndex = aircraft.dowIndex + zfmDelta;

  // Take-off mass
  const tom = zfm + fuel + taxiFuel;
  const fuelDelta = (fuel + taxiFuel) * st.fuel.armFactor;
  const tomIndex = zfmIndex + fuelDelta;

  // Landing mass (simplification: same as TOM in this tool)
  const lm = tom;

  return { zfm, tom, lm, zfmIndex, tomIndex };
}
