// app/api/workflows/route.ts

import { openDb } from "@/mongodb/lib/db";
import { NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const query: Record<string, any> = {};

    // Build query object
    searchParams.forEach((value, key) => {
      query[key] = value.replace(/^"|"$/g, "");
    });

    // Await the DB connection
    const { collection } = await openDb(DB_NAME, COLLECTION);

    const workflows = await collection
      .find(query, { projection: { name: 1, title: 1, type: 1, status: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    if (!workflows || workflows.length === 0) {
      return NextResponse.json(
        { code: "02", error: "Workflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Error in GET:", error);

    return NextResponse.json(
      { code: "99", error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}