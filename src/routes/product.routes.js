import express from 'express'
import { protect } from '../middlewares/auth.middleware.js';
import { addProduct,deleteProduct,getProduct, updateProduct } from '../controllers/product.controller.js';
import { restrictTo } from '../middlewares/restrict.middleware.js';

const router = express.Router();


router.post("/",protect,restrictTo('user'),addProduct);
router.get("/:productId",protect,restrictTo('user'),getProduct);
router.put("/:productId",protect,restrictTo('user'),updateProduct);
router.delete("/:productId",protect,restrictTo('user'), deleteProduct);


export default router;