import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the new route for creating a new user
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect); // New authentication endpoint
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

export default router;
