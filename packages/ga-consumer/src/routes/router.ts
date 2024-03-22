import express from 'express'
import * as healthController from '../controllers/healthController'

export const router = express.Router()

/* GET health. */
router.get('/health', healthController.get)
