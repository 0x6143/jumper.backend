import express from 'express'
import * as healthController from '../controllers/healthController'
import * as kafkaController from '../controllers/kafkaController'

export const router = express.Router()

/* GET health. */
router.get('/health', healthController.get)

/* POST events */
router.post('/events', kafkaController.postEvent)
