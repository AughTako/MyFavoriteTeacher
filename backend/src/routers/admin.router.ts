import express from 'express';
import { AdminController } from '../controllers/admin.controller';

const AdminRouter = express.Router()

AdminRouter.route('/login').post(
    (req, res) => new AdminController().login(req, res)
);

AdminRouter.route('/').get(
    (req, res) => new AdminController().getRequests(req, res)
);

AdminRouter.route('/accept').post(
    (req, res) => new AdminController().accept(req, res)
);

AdminRouter.route('/decline').post(
    (req, res) => new AdminController().decline(req, res)
);

// AdminRouter.route('/chart-data').get(
//     (req, res) => new AdminController().getChartData(req, res)
// );
export default AdminRouter;