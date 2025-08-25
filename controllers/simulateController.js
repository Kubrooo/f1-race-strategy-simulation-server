const { simulateRace } = require('../services/simulateRace.js');

function simulateController(request, h) {
    try {
        const payload = request.payload;

        if (!payload || typeof payload !== 'object') {
            return h
                .response({ status: 'fail', message: 'Invalid payload format' })
                .code(400);
        }

        // Fungsi untuk format waktu
        function formatTime(seconds) {
            if (seconds < 60) {
                return `${seconds.toFixed(3)}s`;
            }
            const mins = Math.floor(seconds / 60);
            const secs = (seconds % 60).toFixed(3).padStart(6, '0');
            return `${mins}m ${secs}s`;
        }

        const result = simulateRace(payload);

        // Format semua waktu di result
        result.totalTime = formatTime(result.totalTime);

        result.laps = result.laps.map(lap => ({
            ...lap,
            lapTime: formatTime(lap.lapTime)
        }));

        result.stints = result.stints.map(stint => ({
            ...stint,
            avg: formatTime(stint.avg),
            laps: stint.laps.map(lap => ({
                ...lap,
                lapTime: formatTime(lap.lapTime)
            }))
        }));

        if (result.fastestLap) {
            result.fastestLap = formatTime(result.fastestLap);
        }

        return h.response({ status: 'success', data: result }).code(200);
    } catch (error) {
        console.error('Simulation error:', error);
        return h
            .response({ status: 'error', message: 'Internal server error during simulation' })
            .code(500);
    }
}

module.exports = { simulateController };
