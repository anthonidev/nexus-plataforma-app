import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "src", "data", "terms.md");
  try {
    const content = readFileSync(filePath, "utf8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo cargar los términos y condiciones" },
      { status: 500 }
    );
  }
}
