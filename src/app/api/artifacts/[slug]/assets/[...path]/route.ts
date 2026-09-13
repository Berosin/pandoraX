import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getArtifactBySlug } from "@/lib/registry";
import { ARTIFACTS_ROOT } from "@/lib/artifact-loader";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".hdr": "image/vnd.radiance",
  ".ktx2": "image/ktx2",
};

interface RouteParams {
  params: Promise<{ slug: string; path: string[] }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug, path: pathSegments } = await params;
  const assetPath = pathSegments.join("/");

  const artifact = getArtifactBySlug(slug);
  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  // Only serve files this artifact explicitly declares as an asset —
  // this route is not a general-purpose file server.
  const declared = artifact.assets?.some((asset) => asset.path === assetPath);
  if (!declared) {
    return NextResponse.json({ error: "Asset not declared" }, { status: 404 });
  }

  const assetsRoot = path.join(ARTIFACTS_ROOT, artifact.slug, "assets");
  const fullPath = path.join(assetsRoot, assetPath);

  // Guard against path traversal even though `declared` already
  // constrains this to a known-good relative path.
  if (!fullPath.startsWith(assetsRoot + path.sep)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const file = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Asset file missing" }, { status: 404 });
  }
}