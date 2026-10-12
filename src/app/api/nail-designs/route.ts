import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export interface NailDesign {
  id: string;
  title: string;
  image: string;
  price: number;
  shape?: string;
  length?: string;
  createdAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "nail-designs.json");

async function readDesignsFromFile(): Promise<NailDesign[]> {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeDesignsToFile(designs: NailDesign[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(designs, null, 2), "utf-8");
  } catch {
    // Ignore
  }
}

export async function GET() {
  try {
    // 1. Primary: Load from Supabase PostgreSQL via Prisma
    try {
      const dbDesigns = await prisma.nailDesign.findMany({
        orderBy: { createdAt: "desc" },
      });

      const formatted = dbDesigns.map((d) => ({
        id: d.id,
        title: d.title,
        image: d.image,
        price: Number(d.price),
        shape: d.shape,
        length: d.length,
        createdAt: d.createdAt.toISOString(),
      }));

      return NextResponse.json({ success: true, data: formatted });
    } catch (dbErr) {
      console.warn("Prisma nail-designs GET error, falling back to local storage:", dbErr);
    }

    // 2. Secondary fallback: local file
    const fileDesigns = await readDesignsFromFile();
    return NextResponse.json({ success: true, data: fileDesigns });
  } catch (error) {
    console.error("GET nail-designs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch nail designs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Nail design title is required" },
        { status: 400 }
      );
    }

    if (!body.image || !body.image.trim()) {
      return NextResponse.json(
        { success: false, error: "Nail design image is required" },
        { status: 400 }
      );
    }

    const price = Number(body.price) || 700;
    const finalPrice = price < 0 ? 700 : price;

    // 1. Primary: Save to Supabase PostgreSQL via Prisma
    try {
      const created = await prisma.nailDesign.create({
        data: {
          title: body.title.trim(),
          image: body.image.trim(),
          price: finalPrice,
          shape: body.shape || "Almond",
          length: body.length || "Medium",
        },
      });

      const result: NailDesign = {
        id: created.id,
        title: created.title,
        image: created.image,
        price: Number(created.price),
        shape: created.shape,
        length: created.length,
        createdAt: created.createdAt.toISOString(),
      };

      // Also mirror to file as local cache
      const fileDesigns = await readDesignsFromFile();
      await writeDesignsToFile([result, ...fileDesigns]);

      return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma nail-designs POST error, saving to local file:", dbErr);
    }

    // 2. Fallback: Save to local file
    const newDesign: NailDesign = {
      id: `nd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: body.title.trim(),
      image: body.image.trim(),
      price: finalPrice,
      shape: body.shape || "Almond",
      length: body.length || "Medium",
      createdAt: new Date().toISOString(),
    };

    const designs = await readDesignsFromFile();
    const updated = [newDesign, ...designs];
    await writeDesignsToFile(updated);

    return NextResponse.json({ success: true, data: newDesign }, { status: 201 });
  } catch (error) {
    console.error("POST nail-designs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save nail design" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Design ID is required" },
        { status: 400 }
      );
    }

    // 1. Try deleting from Supabase
    try {
      await prisma.nailDesign.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("Prisma nail-designs DELETE error:", dbErr);
    }

    // 2. Also remove from local file cache
    const designs = await readDesignsFromFile();
    const filtered = designs.filter((d) => d.id !== id);
    await writeDesignsToFile(filtered);

    return NextResponse.json({ success: true, message: "Design deleted" });
  } catch (error) {
    console.error("DELETE nail-designs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete nail design" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, price, shape, length, image } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Design ID is required" },
        { status: 400 }
      );
    }

    // 1. Try updating in Supabase
    try {
      const updated = await prisma.nailDesign.update({
        where: { id },
        data: {
          title: title ? title.trim() : undefined,
          image: image ? image.trim() : undefined,
          price: price !== undefined ? Number(price) : undefined,
          shape: shape || undefined,
          length: length || undefined,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updated.id,
          title: updated.title,
          image: updated.image,
          price: Number(updated.price),
          shape: updated.shape,
          length: updated.length,
          createdAt: updated.createdAt.toISOString(),
        },
      });
    } catch (dbErr) {
      console.warn("Prisma nail-designs PATCH error, falling back to local file:", dbErr);
    }

    // 2. Fallback update local file
    const designs = await readDesignsFromFile();
    const index = designs.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Nail design not found" },
        { status: 404 }
      );
    }

    const current = designs[index];
    designs[index] = {
      ...current,
      title: title ? title.trim() : current.title,
      image: image ? image.trim() : current.image,
      price: price !== undefined ? Number(price) : current.price,
      shape: shape || current.shape,
      length: length || current.length,
    };

    await writeDesignsToFile(designs);
    return NextResponse.json({ success: true, data: designs[index] });
  } catch (error) {
    console.error("PATCH nail-designs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update nail design" },
      { status: 500 }
    );
  }
}
