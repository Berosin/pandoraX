import "server-only";
import { NextResponse } from "next/server";
import { getArtifactBySlug } from "@/lib/registry";
import { buildArtifactZip } from "@/lib/download";
import { resolveConfigValues } from "@/lib/configuration";
import { decodeConfigFromParams } from "@/lib/config-url";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const artifact = getArtifactBySlug(slug);
  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  // The "export configuration" is resolved here, server-side, from the
  // request's own query string — the same `?key=value` shape the share
  // link and the address bar use — rather than trusting a client-sent
  // values object directly. Anything not recognized by the schema, or
  // out of range, is dropped by resolveConfigValues/decodeConfigFromParams.
  const exportConfigValues = artifact.configSchema
    ? resolveConfigValues(
        artifact.configSchema,
        decodeConfigFromParams(artifact.configSchema, new URL(request.url).searchParams)
      )
    : undefined;

  try {
    const { filename, buffer } = await buildArtifactZip(artifact, exportConfigValues);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(`Failed to build ZIP for artifact "${slug}":`, error);
    return NextResponse.json(
      { error: "Could not build the archive for this artifact." },
      { status: 500 }
    );
  }
}
