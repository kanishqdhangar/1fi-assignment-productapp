import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import EmiPlan from "../models/EmiPlan.js";

const TENURES = [3, 6, 12, 24, 36, 48, 60];
const CASHBACK = 7500;

const imageUrls = {
  iphoneSilver:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl4U7-T1Xfghru-UFF24bI8Jc1bTgXvotcp3DRZKRFqw&s=10",
  iphoneOrange:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3drbikxGCm2nQKZ1LVTVnHn__T-1VUwTel7H8MkwGyA&s=10",
  iphoneBlue:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbdF2wUTx-uDxvLZZZBNP6zm209J_LJqoiuVzj2i0f-A&s=10",
  samsungBlack:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTclChh_l8ApPqcVqHJ9bwcdj6oMfEbW77S0fxcHBqKWw&s",
  samsungGray:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHZ1-15SXOR0JwaoBJclIY8sgidZjJoHCDgLaAY-Y-Nw&s=10",
  oneplusEmerald:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqSpKzQOtUxwjBZZfZ1XdRJsUft5TlLwFxGiu3MnSZbg&s=10",
  oneplusBlack:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEjiTQlejJyq_TdDt1fdMVmfWpv4c2Sv5168VVz8lsg&s",
};

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    description:
      "A premium smartphone with a titanium-inspired design and a high-performance camera system.",
    variants: [
      {
        label: "256GB / Silver",
        storage: "256GB",
        color: "Silver",
        mrp: 134900,
        price: 127400,
        imageUrl: imageUrls.iphoneSilver,
        isDefault: true,
      },
      {
        label: "256GB / Orange",
        storage: "256GB",
        color: "Orange",
        mrp: 134900,
        price: 127400,
        imageUrl: imageUrls.iphoneOrange,
        isDefault: false,
      },
      {
        label: "256GB / Blue",
        storage: "256GB",
        color: "Blue",
        mrp: 134900,
        price: 129400,
        imageUrl: imageUrls.iphoneBlue,
        isDefault: false,
      },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    description:
      "A flagship Android smartphone with a large display, versatile cameras, and premium performance.",
    variants: [
      {
        label: "256GB / Titanium Black",
        storage: "256GB",
        color: "Titanium Black",
        mrp: 129999,
        price: 114999,
        imageUrl: imageUrls.samsungBlack,
        isDefault: true,
      },
      {
        label: "512GB / Titanium Gray",
        storage: "512GB",
        color: "Titanium Gray",
        mrp: 139999,
        price: 124999,
        imageUrl: imageUrls.samsungGray,
        isDefault: false,
      },
    ],
  },
  {
    name: "OnePlus 12",
    slug: "oneplus-12",
    brand: "OnePlus",
    description:
      "A performance-focused smartphone with a bright display, flagship chipset, and fast charging.",
    variants: [
      {
        label: "256GB / Flowy Emerald",
        storage: "256GB",
        color: "Flowy Emerald",
        mrp: 64999,
        price: 59999,
        imageUrl: imageUrls.oneplusEmerald,
        isDefault: true,
      },
      {
        label: "512GB / Silky Black",
        storage: "512GB",
        color: "Silky Black",
        mrp: 69999,
        price: 64999,
        imageUrl: imageUrls.oneplusBlack,
        isDefault: false,
      },
    ],
  },
];

function calculateMonthlyAmount(principal, tenureMonths, annualRate) {
  if (annualRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const payment =
    (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(payment);
}

function createPlans(variant) {
  return TENURES.map((tenureMonths) => {
    const interestRate = tenureMonths <= 12 ? 0 : 10.5;

    return {
      tenureMonths,
      monthlyAmount: calculateMonthlyAmount(
        variant.price,
        tenureMonths,
        interestRate
      ),
      interestRate,
      cashback: CASHBACK,
      fundedBy: "Mutual Fund",
    };
  });
}

async function seed() {
  try {
    await connectDB();

    await EmiPlan.deleteMany({});
    await Variant.deleteMany({});
    await Product.deleteMany({});

    for (const productData of products) {
      const { variants, ...productFields } = productData;
      const product = await Product.create(productFields);

      for (const variantData of variants) {
        const variant = await Variant.create({
          ...variantData,
          productId: product._id,
        });

        await EmiPlan.insertMany(
          createPlans(variant).map((plan) => ({
            ...plan,
            variantId: variant._id,
          }))
        );
      }
    }

    const productCount = await Product.countDocuments();
    const variantCount = await Variant.countDocuments();
    const planCount = await EmiPlan.countDocuments();

    console.log(
      `Seed complete: ${productCount} products, ${variantCount} variants, ${planCount} EMI plans`
    );
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
