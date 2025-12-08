import {Router} from "express";
import { createOrder,captureOrder } from "../../controllers/shop/order.controller.js";

const router=Router();

router.post("/create",createOrder);

router.post("/capture",captureOrder)

export default router;