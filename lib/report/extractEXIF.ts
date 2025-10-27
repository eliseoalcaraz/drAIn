import ExifReader from 'exifreader';

export interface ExifLocation {
    latitude: number | null;
    longitude: number | null;
}

export async function extractExifLocation(file: File): Promise<ExifLocation> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const tags: Record<string, unknown> = await ExifReader.load(arrayBuffer);

        const lat = tags.GPSLatitude;
        const lon = tags.GPSLongitude;
        const latRef = tags.GPSLatitudeRef;
        const lonRef = tags.GPSLongitudeRef;

        if (lat && lon && latRef && lonRef) {
            let latitude = (lat as { description?: string }).description ? parseFloat((lat as { description: string }).description) : null;
            let longitude = (lon as { description?: string }).description ? parseFloat((lon as { description: string }).description) : null;

            if (latitude !== null && longitude !== null) {
                // Apply hemisphere corrections
                if ((latRef as { value?: string[] }).value && (latRef as { value: string[] }).value[0] === 'S') {
                    latitude = -latitude;
                }
                if ((lonRef as { value?: string[] }).value && (lonRef as { value: string[] }).value[0] === 'W') {
                    longitude = -longitude;
                }

                return { latitude, longitude };
            }
        }

        return { latitude: null, longitude: null };
    } catch (_error) {
        return { latitude: null, longitude: null };
    }
}
