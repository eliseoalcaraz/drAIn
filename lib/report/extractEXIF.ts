import ExifReader from 'exifreader';

export interface ExifLocation {
    latitude: number | null;
    longitude: number | null;
}

export async function extractExifLocation(file: File): Promise<ExifLocation> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const tags: any = await ExifReader.load(arrayBuffer);

        const lat = tags.GPSLatitude;
        const lon = tags.GPSLongitude;
        const latRef = tags.GPSLatitudeRef;
        const lonRef = tags.GPSLongitudeRef;

        if (lat && lon && latRef && lonRef) {
            let latitude = lat.description ? parseFloat(lat.description) : null;
            let longitude = lon.description ? parseFloat(lon.description) : null;

            if (latitude !== null && longitude !== null) {
                // Apply hemisphere corrections
                if (latRef.value && latRef.value[0] === 'S') {
                    latitude = -latitude;
                }
                if (lonRef.value && lonRef.value[0] === 'W') {
                    longitude = -longitude;
                }

                return { latitude, longitude };
            }
        }

        return { latitude: null, longitude: null };
    } catch (error) {
        return { latitude: null, longitude: null };
    }
}
