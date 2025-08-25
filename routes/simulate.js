const Joi = require('joi')
const { simulateController } = require('../controllers/simulateController.js')

module.exports = {
    method: 'POST',
    path: '/simulate',
    options: {
        validate: {
            payload: Joi.object({
                circuit: Joi.object({
                    name: Joi.string().required(),
                    laps: Joi.number().integer().min(1).required(),
                    pitLossSeconds: Joi.number().min(0).default(22)
                }).required(),
                baseLapTime: Joi.number().min(0).required(),
                startTyre: Joi.string().valid('Soft','Medium','Hard').default('Soft'),
                strategy: Joi.object({
                    pitStops: Joi.array().items(
                        Joi.object({
                            lap: Joi.number().integer().min(1).required(),
                            tyre: Joi.string().valid('Soft','Medium','Hard').required()
                        })
                    ).default([])
                }).default(),
                weather: Joi.string().valid('Dry','LightRain','HeavyRain').default('Dry'),
                fuelCoef: Joi.number().min(0).default(0.02)
            })
        }
    },
    handler: simulateController
}