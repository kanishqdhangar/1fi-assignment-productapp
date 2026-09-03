import mongoose from "mongoose";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import EmiPlan from "../models/EmiPlan.js";

function serializePlan(plan) {
  return {
    id: plan._id.toString(),
    tenureMonths: plan.tenureMonths,
    monthlyAmount: plan.monthlyAmount,
    interestRate: plan.interestRate,
    cashback: plan.cashback,
    fundedBy: plan.fundedBy,
  };
}

function serializeVariant(variant, plans) {
  return {
    id: variant._id.toString(),
    label: variant.label,
    storage: variant.storage ?? null,
    color: variant.color ?? null,
    mrp: variant.mrp,
    price: variant.price,
    imageUrl: variant.imageUrl,
    isDefault: variant.isDefault,
    emiPlans: plans.map(serializePlan),
  };
}

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find({})
      .sort({ createdAt: 1 })
      .lean();

    const variants = await Variant.find({
      productId: { $in: products.map((product) => product._id) },
    })
      .sort({ isDefault: -1, createdAt: 1 })
      .lean();

    const variantsByProduct = new Map();

    for (const variant of variants) {
      const key = variant.productId.toString();
      if (!variantsByProduct.has(key)) variantsByProduct.set(key, []);
      variantsByProduct.get(key).push(variant);
    }

    const response = products.map((product) => {
      const productVariants = variantsByProduct.get(product._id.toString()) ?? [];
      const defaultVariant =
        productVariants.find((variant) => variant.isDefault) ??
        productVariants[0];

      return {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        thumbnail: defaultVariant?.imageUrl ?? null,
        startingPrice: productVariants.length
          ? Math.min(...productVariants.map((variant) => variant.price))
          : null,
      };
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    }).lean();

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Get all variants
    const variants = await Variant.find({
      productId: product._id,
    })
      .sort({
        isDefault: -1,
        createdAt: 1,
      })
      .lean();

    // Find the default variant
    const defaultVariant =
      variants.find((variant) => variant.isDefault) ??
      variants[0];

    // Get EMI plans ONLY for the default variant
    let defaultPlans = [];

    if (defaultVariant) {
      defaultPlans = await EmiPlan.find({
        variantId: defaultVariant._id,
      })
        .sort({
          tenureMonths: 1,
        })
        .lean();
    }

    res.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,

      variants: variants.map((variant) => ({
        id: variant._id.toString(),
        label: variant.label,
        storage: variant.storage ?? null,
        color: variant.color ?? null,
        mrp: variant.mrp,
        price: variant.price,
        imageUrl: variant.imageUrl,
        isDefault: variant.isDefault,

        // Only the default variant gets EMI plans
        ...(defaultVariant &&
        variant._id.toString() === defaultVariant._id.toString()
          ? {
              emiPlans: defaultPlans.map(serializePlan),
            }
          : {}),
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getVariantEmiPlans(req, res, next) {
  try {
    const { variantId } = req.params;

    if (!mongoose.isValidObjectId(variantId)) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const variant = await Variant.findById(variantId).lean();

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const product = await Product.findOne({
      _id: variant.productId,
      slug: req.params.slug,
    }).lean();

    if (!product) {
      return res.status(404).json({ error: "Variant not found" });
    }

    const plans = await EmiPlan.find({ variantId })
      .sort({ tenureMonths: 1 })
      .lean();

    res.json(plans.map(serializePlan));
  } catch (error) {
    next(error);
  }
}
