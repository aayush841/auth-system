import express from 'express';
import { protect} from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/restrict.middleware.js';
import { getAllProducts, getAllUsers } from '../controllers/admin.controller.js';

const router = express.Router();


router.get('/users',protect,restrictTo('Admin'),getAllUsers);
router.get('/products',protect,restrictTo('Admin'),getAllProducts);


export default router;