"use server";


import { openDb } from "@/mongodb/lib/db";
import { NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";
export async function POST(request: Request) {
  try {
    const { _id, nodes, edges, nodeStatus, status } = await request.json();

    if (!nodes || !edges) {
      return new Response(JSON.stringify({ message: "Invalid flow data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const  {collection}  = await openDb(DB_NAME, COLLECTION);

    const result = await collection.updateOne(
      { _id: _id },
      {
        $set: {
          nodes,
          edges,
          nodeStatus, // ✅ Save this to keep the disabled state
          status,
          updatedAt: new Date(),
        },
      }
    );

 return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
