import {Router} from "express";
import { addAddress, deleteAddress, getAddress, getAddresses, updateAddress } from "../../controllers/shop/address.controller.js";
import { validate } from '../../middlewares/validate.middleware.js';
import { addressSchema, updateAddressSchema } from "../../validators/address.validation.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
const router=Router();

router.post("/add",authenticate,validate(addressSchema),addAddress);
router.get("/all",authenticate,getAddresses);
router.get("/one/:id",authenticate,getAddress);
router.patch("/update/:id",authenticate,validate(updateAddressSchema),updateAddress);
router.delete("/delete/:id",authenticate,deleteAddress);

export default router