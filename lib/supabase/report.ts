import client from "@/app/api/client";


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

export const fetchReports = async () => {
  try {
    const { data, error } = await client
      .from("reports")
      .select("*");

    if (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }

    if (!data) return [];

    // Transform into desired format
    const formattedReports = data.map((report: any, index: number) => ({
      id: report.id?.toString() ?? String(index + 1),
      date: report.created_at ?? new Date().toISOString(),
      category: report.category,
      description: report.description,
      image: report.image ? `/storage/v1/object/public/ReportImage/${report.image}` : "",
      reporterName: report.reporter_name ?? "Unknown Reporter",
      status: report.status,
      componentId: report.component_id ?? "N/A",
      coordinates: [report.long, report.lat],
    }));
    console.log("Formatted Reports:", formattedReports);
    return formattedReports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
