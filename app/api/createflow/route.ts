"use server";

import { openDb } from "@/mongodb/lib/db";
import { NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, type, ...rest } = body;

    // Basic validation for required fields
    if (!name || !title || !type) {
      return new Response(
        JSON.stringify({ message: "Name, title, and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = openDb(DB_NAME, COLLECTION);
    const id = name.toLowerCase().replace(/\s+/g, "_");
    
    const document = {
      _id: id,
      title,
      type,
      ...rest, // Spread any additional fields
      nodes: rest.nodes || [],
      edges: rest.edges || [],
      createdAt: new Date(),
    };

    const result = await db.insert(document);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("DB error:", error);
    return new Response(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Server error" 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}