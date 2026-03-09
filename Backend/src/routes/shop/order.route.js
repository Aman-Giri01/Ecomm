// import {Router} from "express";
// import { createOrder,captureOrder, getOrders, getOrder } from "../../controllers/shop/order.controller.js";
// import { authorize } from "../../middlewares/auth.middleware.js";

// const router=Router();

// router.post("/create",createOrder);

// router.post("/capture",captureOrder);

// router.get('/all-orders',authorize,getOrders);

// router.get('my-orders/:id',getOrder)

// export default router;

import { Router } from "express";
import {
  createOrder,
  captureOrder,
  getOrders,
  getOrder,
} from "../../controllers/shop/order.controller.js";

const router = Router();

router.post("/create", createOrder);
router.post("/capture", captureOrder);

//  FIX 1: removed authorize (admin-only middleware) — regular users need this
router.get("/all-orders", getOrders);

//  FIX 2: added missing leading "/" — Express was never matching this route
router.get("/my-orders/:id", getOrder);

export default router;