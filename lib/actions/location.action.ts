"use server";

type Province = { code: string; name: string; region: string };
type CityOrMunicipality = {
  code: string;
  name: string;
  type: string;
};
type Barangay = { code: string; name: string };

function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export async function getProvinces(): Promise<Province[]> {
  try {
    const res = await fetch("https://psgc.cloud/api/v2/provinces", {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) return [];

    const raw = await res.json();
    const data = extractArray<Province>(raw);

    return data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    return [];
  }
}

export async function getCitiesByProvince(
  provinceCode: string,
): Promise<CityOrMunicipality[]> {
  if (!provinceCode) return [];

  try {
    const res = await fetch(
      `https://psgc.cloud/api/v2/provinces/${provinceCode}/cities-municipalities`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!res.ok) return [];

    const raw = await res.json();
    const data = extractArray<CityOrMunicipality>(raw);

    return data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return [];
  }
}

export async function getBarangaysByCity(
  cityCode: string,
): Promise<Barangay[]> {
  if (!cityCode) return [];

  try {
    const res = await fetch(
      `https://psgc.cloud/api/v2/cities-municipalities/${cityCode}/barangays`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!res.ok) return [];

    const raw = await res.json();
    const data = extractArray<Barangay>(raw);

    return data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch barangays:", error);
    return [];
  }
}
