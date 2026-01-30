"use server";

import dbConnect from "@/lib/dbConnect";
import Product from "@/models/postModels";


// GET handler to fetch all products
export async function getProducts() {
  try {
    await dbConnect();
    const products = await Product.find().lean();
    return { data: products };
  } catch (error: any) {
    return { error: error.message, status: "ERROR" };
  }
}

// POST handler to create a new product
export async function createProduct(body: Record<string, any>) {
  try {
    await dbConnect();

    // Basic validation
    if (!body.name || !body.price) {
      return { error: "Name and price are required", status: "ERROR" };
    }

    const newProduct = new Product(body);
    const savedProduct = await newProduct.save();
    return { data: savedProduct, status: "SUCCESS" };
  } catch (error: any) {
    return { error: error.message, status: "ERROR" };
  }
}

// DELETE handler to delete a product by ID
export async function deleteProduct(body: { id: string }) {
  try {
    await dbConnect();

    if (!body.id) {
      return { error: "Product ID is required", status: "ERROR" };
    }

    const deletedProduct = await Product.findByIdAndDelete(body.id);

    if (!deletedProduct) {
      return { error: "Product not found", status: "ERROR" };
    }

    return { data: deletedProduct, status: "SUCCESS" };
  } catch (error: any) {
    return { error: error.message, status: "ERROR" };
  }
}


// UPDATE handler to update a product by ID
export async function updateProduct(body: { id: string } & Record<string, any>) {
  try {
    await dbConnect();

    const { id, ...updateData } = body;

    if (!id) {
      return { error: "Product ID is required", status: "ERROR" };
    }

    if (Object.keys(updateData).length === 0) {
      return { error: "No update data provided", status: "ERROR" };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return { error: "Product not found", status: "ERROR" };
    }

    return { data: updatedProduct, status: "SUCCESS" };
  } catch (error: any) {
    return { error: error.message, status: "ERROR" };
  }
}