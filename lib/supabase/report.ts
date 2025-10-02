import client from "@/api/client";


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
                    component_type: 'inlet',
                    coordinates: {
                        lat: 10.360172475881017,
                        lng: 123.915424397260537
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
