import express from 'express';
import { ClassesController } from './controllers/ClassesController';

const routes = express.Router();

routes.get('/classes', new ClassesController().index);
routes.post('/classes', new ClassesController().create);

export default routes;
