import client from "@/app/api/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Report {
  id: string;
  date: string;
  category: string;
  description: string;
  image: string;
  reporterName: string;
  status: string;
  componentId: string;
  coordinates: [number, number];
  geocoded_status: string;
  address: string;
}

export const uploadReport = async (file: File, category: string, description: string, component_id: string, long: number, lat: number, userId: string| null, reporterName: string)  => {
    try {
        const { error } = await client.storage
            .from('ReportImage')
            .upload(`public/${file.name}`, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type,
            });
        if (error) {
            console.error("Error uploading file:", error);
            throw error;
        }

        const { error: insertError } = await client
            .from('reports')
            .insert([
                {
                    category,
                    description,
                    image: `public/${file.name}`,
                    reporter_name: reporterName,
                    status: 'pending',
                    component_id: component_id,
                    long: long,
                    lat: lat,
                    address: null,
                    geocoded_status: 'pending',
                    user_id: userId?? null,
                },
            ]);

        if (insertError) {
            console.error("Error inserting report:", insertError);
            throw insertError;
        }

    } catch (error) {
        console.error("Error uploading report:", error);
        throw error;
    }

}

export const fetchReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await client
      .from("reports")
      .select("*");

    if (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }

  if (!data) return [];

  const imageUrls = data.map((report: any) => {
    const {data: img} = client.storage
      .from('ReportImage')
      .getPublicUrl(report.image);

    return {
      imageUrl: img.publicUrl,
    };
  });

  // Transform into desired format
  const formattedReports: Report[] = data.map((report: any, index: number) => ({
    id: report.id?.toString(),
    date: report.created_at,
    category: report.category,
    description: report.description,
    image: imageUrls[index].imageUrl ?? "",
    reporterName: report.reporter_name,
    status: report.status,
    componentId: report.component_id ?? "N/A",
    coordinates: [report.long as number, report.lat as number] as [number, number],
    geocoded_status: report.geocoded_status ?? "pending",
    address: report.address ?? "Loading address...",
    }));
    return formattedReports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const updateReportStatus = async (reportId: string, status: 'in-progress' | 'resolved') => {
    try {
        const { error } = await client
            .from('reports')
            .update({ status })
            .eq('id', reportId);

        if (error) {
            console.error("Error updating report status:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error updating report status:", error);
        throw error;
    }
}

export const deleteReportsByComponentId = async (componentId: string) => {
  try {
    const { error } = await client
      .from('reports')
      .delete()
      .eq('component_id', componentId);

    if (error) {
      console.error("Error deleting reports:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting reports:", error);
    throw error;
  }
};

export const formatReport = (report: any): Report => {
  const { data: img } = client.storage
    .from("ReportImage")
    .getPublicUrl(report.image || "");

  const rawDate = report.created_at || report.date || null;
  const parsedDate = new Date(rawDate);
  const safeDate = !rawDate || isNaN(parsedDate.getTime())
    ? new Date().toISOString()
    : parsedDate.toISOString();

  const long = parseFloat(report.long);
  const lat = parseFloat(report.lat);
  const safeCoords =
    !isNaN(long) && !isNaN(lat)
      ? [long, lat] as [number, number]
      : [0, 0] as [number, number];

  return {
    id: report.id?.toString() ?? crypto.randomUUID(),
    date: safeDate,
    category: report.category ?? "Uncategorized",
    description: report.description ?? "No description provided.",
    image: img?.publicUrl ?? "",
    reporterName: report.reporter_name ?? "Anonymous",
    status: report.status ?? "Pending",
    componentId: report.component_id ?? "N/A",
    coordinates: safeCoords,
    geocoded_status: report.geocoded_status ?? "pending",
    address: report.address ?? "Unknown address",
  };
};


let channel: RealtimeChannel | null = null;
const listeners: {
  onInsert: ((report: any) => void)[];
  onUpdate: ((report: any) => void)[];
} = {
  onInsert: [],
  onUpdate: [],
};

export function initReportChannel() {
  if (channel) return channel;

  channel = client.channel("reports_shared");

  channel
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, (payload) => {
      console.log("Shared Channel Insert:", payload.new);
      listeners.onInsert.forEach((cb) => cb(payload.new));
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "reports" }, (payload) => {
      console.log("Shared Channel Update:", payload.new);
      listeners.onUpdate.forEach((cb) => cb(payload.new));
    })
    .subscribe((status, err) => {
      console.log("Shared Report Channel status:", status, err || "");
    });

  return channel;
}


export function subscribeToReportChanges(onInsert?: (r: any) => void, onUpdate?: (r: any) => void) {
  initReportChannel();

  if (onInsert) listeners.onInsert.push(onInsert);
  if (onUpdate) listeners.onUpdate.push(onUpdate);

  return () => {
    if (onInsert)
      listeners.onInsert = listeners.onInsert.filter((cb) => cb !== onInsert);
    if (onUpdate)
      listeners.onUpdate = listeners.onUpdate.filter((cb) => cb !== onUpdate);
  };
}

export const getreportCategoryCount = async (targetCategory: string, categoryId: string): Promise<number> => {
  try {
    const { count: categoryCount, error } = await client
      .from("reports")
      .select("category", { count: "exact", head: true })
      .eq("category", targetCategory)
      .eq("component_id", categoryId);

    console.log(targetCategory, categoryId, categoryCount);
    return categoryCount?? 0;
  }
  catch (error) {
    console.error("Error fetching reports:", error);
    return 0;
  }
};
