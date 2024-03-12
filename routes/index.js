import { Router } from 'express';
import AppController from '../controllers/AppController';
import { postNew } from '../controllers/UsersController.js';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the new route for creating a new user
router.post('/users', postNew);

export default router;
