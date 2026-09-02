import { Router } from "express";
import {
  getProductBySlug,
  getProducts,
  getVariantEmiPlans,
} from "../controllers/productsController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:slug/variants/:variantId/emi-plans", getVariantEmiPlans);
router.get("/:slug", getProductBySlug);

export default router;
