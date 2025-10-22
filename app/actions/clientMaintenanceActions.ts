"use client";

import client from "@/app/api/client";
import { updateReportStatus } from "@/lib/supabase/report";

// Helper function to normalize Supabase joined data to arrays for TypeScript
// Supabase's select syntax for related tables (e.g., `agencies ( name )`) often
// returns a single object if there's a one-to-one relationship, but TypeScript
// infers it as an array due to potential one-to-many. This function ensures
// it's always an array for type consistency if needed.
const normalizeJoinedData = (data: any) => {
  if (!data) return data;

  return data.map((record: any) => {
    const newRecord = { ...record };
    if (newRecord.agencies && !Array.isArray(newRecord.agencies)) {
      newRecord.agencies = [newRecord.agencies];
    }
    if (newRecord.profiles && !Array.isArray(newRecord.profiles)) {
      newRecord.profiles = [newRecord.profiles];
    }
    return newRecord;
  });
};

// Inlet Maintenance Functions
export async function recordInletMaintenance(inletId: string, reportId?: string, status?: 'in-progress' | 'resolved', description?: string) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to record maintenance." };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.agency_id) {
    return { error: "You must be associated with an agency to record maintenance." };
  }

  const { data, error } = await client
    .from("inlets_maintenance")
    .insert([
      {
        in_name: inletId, // Using 'in_name' as the column for string identifier
        agency_id: profile.agency_id,
        represented_by: user.id,
        addressed_report_id: reportId,
        status: status,
        description: description,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error (inlet):", error.message);
    return { error: `Failed to record maintenance for inlet ${inletId}.` };
  }

  if (reportId && status) {
    await updateReportStatus(reportId, status);
  }

  return { success: true, data: data[0] };
}

export async function getInletMaintenanceHistory(inletId: string) {
  const { data, error } = await client
    .from("inlets_maintenance")
    .select(
      `
      last_cleaned_at,
      agencies ( name ),
      profiles ( full_name ),
      status,
      addressed_report_id,
      description
    `
    )
    .eq("in_name", inletId) // Using 'in_name' as the column for string identifier
    .order("last_cleaned_at", { ascending: false });

  if (error) {
    console.error("Error fetching inlet history:", error.message);
    return { error: "Failed to fetch inlet maintenance history." };
  }
  const normalizedData = normalizeJoinedData(data);
  return { data: normalizedData };
}

// Man Pipe Maintenance Functions
export async function recordManPipeMaintenance(manPipeId: string, reportId?: string, status?: 'in-progress' | 'resolved', description?: string) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to record maintenance." };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.agency_id) {
    return { error: "You must be associated with an agency to record maintenance." };
  }

  const { data, error } = await client
    .from("man_pipes_maintenance")
    .insert([
      {
        name: manPipeId, // Using 'name' as the column for string identifier
        agency_id: profile.agency_id,
        represented_by: user.id,
        addressed_report_id: reportId,
        status: status,
        description: description,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error (man_pipe):", error.message);
    return { error: `Failed to record maintenance for man pipe ${manPipeId}.` };
  }

    if (reportId && status) {
        await updateReportStatus(reportId, status);
    }

  return { success: true, data: data[0] };
}

export async function getManPipeMaintenanceHistory(manPipeId: string) {
  const { data, error } = await client
    .from("man_pipes_maintenance")
    .select(
      `
      last_cleaned_at,
      agencies ( name ),
      profiles ( full_name ),
      status,
      addressed_report_id,
      description
    `
    )
    .eq("name", manPipeId) // Using 'name' as the column for string identifier
    .order("last_cleaned_at", { ascending: false });

  if (error) {
    console.error("Error fetching man pipe history:", error.message);
    return { error: "Failed to fetch man pipe maintenance history." };
  }
  const normalizedData = normalizeJoinedData(data);
  return { data: normalizedData };
}

// Outlet Maintenance Functions
export async function recordOutletMaintenance(outletId: string, reportId?: string, status?: 'in-progress' | 'resolved', description?: string) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to record maintenance." };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.agency_id) {
    return { error: "You must be associated with an agency to record maintenance." };
  }

  const { data, error } = await client
    .from("outlets_maintenance")
    .insert([
      {
        out_name: outletId, // Using 'out_name' as the column for string identifier
        agency_id: profile.agency_id,
        represented_by: user.id,
        addressed_report_id: reportId,
        status: status,
        description: description,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error (outlet):", error.message);
    return { error: `Failed to record maintenance for outlet ${outletId}.` };
  }

    if (reportId && status) {
        await updateReportStatus(reportId, status);
    }

  return { success: true, data: data[0] };
}

export async function getOutletMaintenanceHistory(outletId: string) {
  const { data, error } = await client
    .from("outlets_maintenance")
    .select(
      `
      last_cleaned_at,
      agencies ( name ),
      profiles ( full_name ),
      status,
      addressed_report_id,
      description
    `
    )
    .eq("out_name", outletId) // Using 'out_name' as the column for string identifier
    .order("last_cleaned_at", { ascending: false });

  if (error) {
    console.error("Error fetching outlet history:", error.message);
    return { error: "Failed to fetch outlet maintenance history." };
  }
  const normalizedData = normalizeJoinedData(data);
  return { data: normalizedData };
}

// Storm Drain Maintenance Functions
export async function recordStormDrainMaintenance(stormDrainId: string, reportId?: string, status?: 'in-progress' | 'resolved', description?: string) {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to record maintenance." };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.agency_id) {
    return { error: "You must be associated with an agency to record maintenance." };
  }

  const { data, error } = await client
    .from("storm_drains_maintenance") // Assuming a new table for storm drains
    .insert([
      {
        in_name: stormDrainId, // Using 'in_name' as the column for string identifier for storm drains
        agency_id: profile.agency_id,
        represented_by: user.id,
        addressed_report_id: reportId,
        status: status,
        description: description,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error (storm_drain):", error.message);
    return { error: `Failed to record maintenance for storm drain ${stormDrainId}.` };
  }

    if (reportId && status) {
        await updateReportStatus(reportId, status);
    }

  return { success: true, data: data[0] };
}

export async function getStormDrainMaintenanceHistory(stormDrainId: string) {
  const { data, error } = await client
    .from("storm_drains_maintenance") // Assuming a new table for storm drains
    .select(
      `
      last_cleaned_at,
      agencies ( name ),
      profiles ( full_name ),
      status,
      addressed_report_id,
      description
    `
    )
    .eq("in_name", stormDrainId) // Using 'in_name' as the column for string identifier for storm drains
    .order("last_cleaned_at", { ascending: false });

  if (error) {
    console.error("Error fetching storm drain history:", error.message);
    return { error: "Failed to fetch storm drain maintenance history." };
  }
  const normalizedData = normalizeJoinedData(data);
  return { data: normalizedData };
}
