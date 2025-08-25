const TYRE_CONFIG = {
    Soft: { initialGain: -0.30, degrade: 0.06 },
    Medium: { initialGain: -0.10, degrade: 0.04 },
    Hard: { initialGain: 0.00, degrade: 0.03}
}

const WEATHER_PENALTY = {
    Dry: 0,
    LightRain: 1.5,
    HeavyRain: 3.0
}

const DEFAULT_FUEL_COEF = 0.02

module.exports = { TYRE_CONFIG, WEATHER_PENALTY, DEFAULT_FUEL_COEF}