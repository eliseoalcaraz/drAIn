"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function recordMaintenance(assetType: string, assetId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options) {
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to record maintenance." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.agency_id) {
    return { error: "You must be associated with an agency to record maintenance." };
  }

  const tableName = `${assetType}_maintenance`;
  const assetIdColumn = `${assetType.slice(0, -1)}_gid`;

  const { data, error } = await supabase
    .from(tableName)
    .insert([
      {
        [assetIdColumn]: assetId,
        agency_id: profile.agency_id,
        represented_by: user.id,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error:", error.message);
    return { error: `Failed to record maintenance for ${assetType}.` };
  }

  return { success: true, data: data[0] };
}

export async function getMaintenanceHistory(
  assetType: string,
  assetId: string
) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options) {
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  const tableName = `${assetType}_maintenance`;
  const assetIdColumn = `${assetType.slice(0, -1)}_gid`;

  const { data, error } = await supabase
    .from(tableName)
    .select(
      `
      last_cleaned_at,
      agencies ( name ),
      profiles ( full_name )
    `
    )
    .eq(assetIdColumn, assetId)
    .order("last_cleaned_at", { ascending: false });

  if (error) {
    console.error("Error fetching history:", error);
    return { error: "Failed to fetch maintenance history." };
  }

  return { data };
}
