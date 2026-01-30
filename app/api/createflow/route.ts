// app/api/createflow/route.ts  (example path)

import { openDb } from "@/mongodb/lib/db";
import { NextResponse } from "next/server";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, type, ...rest } = body;

    // Basic validation
    if (!name || !title || !type) {
      return NextResponse.json(
        { message: "Name, title, and type are required" },
        { status: 400 }
      );
    }

    const db = await openDb(DB_NAME, COLLECTION);

    const id = name.toLowerCase().replace(/\s+/g, "_");

    const document = {
      _id: id,
      title,
      type,
      ...rest,
      nodes: rest.nodes ?? [],
      edges: rest.edges ?? [],
      createdAt: new Date(),
    };

    const result = await db.insert(document);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("DB error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}