const { TYRE_CONFIG, WEATHER_PENALTY, DEFAULT_FUEL_COEF} = require('../utils/constants.js');

function simulateRace(options) {
    const {
        circuit,
        baseLapTime,
        startTyre = 'Soft',
        strategy = { pitStops: [] },
        weather = 'Dry',
        fuelCoef = DEFAULT_FUEL_COEF
    } = options;

    const totalLaps = circuit.laps;
    const pitMap = new Map();
    const pitStops = Array.isArray(strategy?.pitStops) ? strategy.pitStops : [];
    pitStops.forEach(p => {
        pitMap.set(Number(p.lap), p.tyre);
    });

    let currentTyre = startTyre;
    let stintLapIndex = 0;
    const laps = [];
    let totalTime = 0;

    for (let lap = 1; lap <= totalLaps; lap++) {
        const lapsRemaining = totalLaps - lap + 1;
        const fuelPenalty = fuelCoef * Math.sqrt(lapsRemaining);

        const tyreCfg = TYRE_CONFIG[currentTyre];
        const tyreDegrade = tyreCfg.degrade * stintLapIndex;
        const tyreInit = tyreCfg.initialGain;

        const wPenalty = WEATHER_PENALTY[weather] || 0;

        const lapTime = parseFloat(
            (baseLapTime + tyreInit + tyreDegrade + wPenalty + fuelPenalty).toFixed(3)
        );

        const isPit = pitMap.has(lap);
        const pitTyre = pitMap.get(lap);

        let recordedLapTime = lapTime;
        if (isPit) recordedLapTime = parseFloat((lapTime + circuit.pitLossSeconds).toFixed(3));

        laps.push({
            lap,
            tyre: currentTyre,
            lapTime: recordedLapTime, // tetap angka
            isPit,
            pitToTyre: pitTyre || null
        });

        totalTime += recordedLapTime;

        if (isPit && pitTyre) {
            currentTyre = pitTyre;
            stintLapIndex = 0;
        } else {
            stintLapIndex += 1;
        }
    }

    const stints = [];
    let currentStint = null;
    laps.forEach(l => {
        if (!currentStint) {
            currentStint = { tyre: l.tyre, startLap: l.lap, laps: [], avg: 0 };
        }
        currentStint.laps.push(l);
        if (l.isPit) {
            currentStint.endLap = l.lap;
            const sum = currentStint.laps.reduce((s, x) => s + x.lapTime, 0);
            currentStint.avg = parseFloat((sum / currentStint.laps.length).toFixed(3));
            stints.push(currentStint);
            currentStint = null;
        }
    });
    if (currentStint) {
        currentStint.endLap = totalLaps;
        const sum = currentStint.laps.reduce((s, x) => s + x.lapTime, 0);
        currentStint.avg = parseFloat((sum / currentStint.laps.length).toFixed(3));
        stints.push(currentStint);
    }

    return {
        totalTime,
        laps,
        stints,
        summary: {
            circuit: circuit.name,
            totalLaps,
            startTyre,
            strategy,
            weather
        }
    };
}

module.exports = { simulateRace };
