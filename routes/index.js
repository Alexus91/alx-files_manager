import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the new route for creating a new user
router.post('/users', UsersController.postNew); // Fixed the import statement

export default router;

