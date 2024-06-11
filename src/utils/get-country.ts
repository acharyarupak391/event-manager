import { Request } from "express";

export const getCountry = async (req: Request) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.ip;
  const geoApiUrl = `https://ipinfo.io/${ipAddress}`;

  try {
    const response = await fetch(geoApiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.IPINFO_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    const ipData = await response.json();

    if (ipData && ipData.country) {
      return ipData.country;
    }
  } catch (error) {
    console.error(error);

  }

  return process.env.COUNTRY_FALLBACK;
}