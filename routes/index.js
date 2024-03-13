import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController'; // Import the FilesController

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// User endpoints
router.post('/users', UsersController.postNew);

// Authentication endpoints
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// Files endpoints
router.post('/files', FilesController.postUpload); // Add the new endpoint for uploading files

export default router;
