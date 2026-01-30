import { NextRequest, NextResponse } from "next/server";
import { openDb } from "@/mongodb/lib/db";

const DB_NAME = "etracs_mgmt_base_oscp";
const COLLECTION = "wf_design";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return NextResponse.json(
        { code: "01", error: "Missing workflow ID" },
        { status: 400 }
      );
    }

    const db = openDb(DB_NAME, COLLECTION);
    const data = await db.find({ _id: id }); 

    if (!data) {
      return NextResponse.json(
        { code: "02", error: "Workflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { code: "99", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
