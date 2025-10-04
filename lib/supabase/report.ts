import client from "@/app/api/client";


export const uploadReport = async (file: File, category: string, description: string ) => {
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
                    image: `public/${file.name}`,
                    category,
                    description,
                    status: 'pending',
                    component_type: 'outlet',
                    component_id: 'O1',
                    coordinates: {
                        lat: 10.357608641506733,
                        lng: 123.918361755162664
                    }
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
      category: report.category,
      description: report.description,
      image: report.image ? `/storage/v1/object/public/ReportImage/${report.image}` : "",
      reporterName: report.reporter_name ?? "Unknown Reporter",
      date: report.created_at ?? new Date().toISOString(),
      status: report.status,
      componentType: report.component_type,
      componentId: report.component_id ?? `I-${index}`,
      coordinates: report.coordinates
        ? [report.coordinates.lng, report.coordinates.lat]
        : [0, 0],
    }));

    return formattedReports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
