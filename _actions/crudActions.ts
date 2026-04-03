"use server";

import { openDb } from "@/mongodb/lib/db";

export async function getAllData({ filter = {}, options = {} }: { filter?: Record<string, any>, options?: Record<string, any> }) {
  try {
    const db = openDb("crud", "portfolio");
    const data = await db.getList(filter, options);
    return data; 
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function postData(body: Record<string, any>) {
  try {
    const db = openDb("crud", "portfolio");
    const { _id, ...data } = body;
    const result = await db.insert({
      _id,
      ...data,
    });
    return result;
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error("Failed to create item");
  }
}

export async function deleteData(_id: string) {
  try {
    const db = openDb("crud", "portfolio");
    // Pass the filter directly, not wrapped in a filter object
    const result = await db.deleteMany({ _id });
    return result;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}

export async function updateData(_id: string, updates: Record<string, any>) {
  try {
    const db = openDb("crud", "portfolio");
    const result = await db.update({ _id }, updates);

    if (result?.modifiedCount === 0) {
      throw new Error("Item not found");
    }

    return result;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error; // Re-throw to handle in the API route
  }
}
