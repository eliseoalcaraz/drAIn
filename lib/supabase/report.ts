import client from "@/app/api/client";

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

export const uploadReport = async (file: File, category: string, description: string, component_id: string, long: number, lat: number)  => {
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

        const { data,error: insertError } = await client
            .from('reports')
            .insert([
                {
                    category,
                    description,
                    image: `public/${file.name}`,
                    report_name: 'Anonymous',
                    status: 'pending',
                    component_id: component_id,
                    long: long,
                    lat: lat,
                    address: null,
                    geocoded_status: 'pending'
                },
            ]);

        console.log("insert data:", data);
        console.log("insert error:", error);

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
    id: report.id?.toString() ?? String(index + 1),
    date: report.created_at ?? new Date().toISOString(),
    category: report.category,
    description: report.description,
    image: imageUrls[index].imageUrl ?? "",
    reporterName: report.reporter_name ?? "Unknown Reporter",
    status: report.status,
    componentId: report.component_id ?? "N/A",
    coordinates: [report.long as number, report.lat as number] as [number, number],
    geocoded_status: report.geocoded_status ?? "pending",
    address: report.address ?? "Loading address...",
    }));
    console.log("Formatted Reports:", formattedReports);
    return formattedReports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

const formatReport = (report: any): Report => {
  const {data: img} = client.storage
    .from('ReportImage')
    .getPublicUrl(report.image);

  return {
    id: report.id?.toString(),
    date: report.created_at,
    category: report.category,
    description: report.description,
    image: img.publicUrl ?? "",
    reporterName: report.reporter_name ?? "Unknown Reporter",
    status: report.status,
    componentId: report.component_id ?? "N/A",
    coordinates: [report.long as number, report.lat as number] as [number, number],
    geocoded_status: report.geocoded_status ?? "pending",
    address: report.address ?? "Loading address...",
  };
};

export const subscribeToReportChanges = (
  onInsert: (newReport: Report) => void,
  onUpdate: (updatedReport: Report) => void
  ) => {
  const channel = client
    .channel('realtime-reports')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'reports' },
      (payload) => {
        const formattedReport = formatReport(payload.new);
        onInsert(formattedReport);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'reports' },
      (payload) => {
        const formattedReport = formatReport(payload.new);
        onUpdate(formattedReport);
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

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