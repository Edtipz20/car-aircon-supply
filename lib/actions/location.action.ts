"use server";

type Province = { code: string; name: string };
type CityOrMunicipality = { code: string; name: string; type: string };

export async function getProvinces(): Promise<Province[]> {
  const res = await fetch("https://psgc.cloud/api/v1/provinces?per_page=100", {
    next: { revalidate: 60 * 60 * 24 }, // this data changes maybe once a quarter — cache a full day
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.data ?? data).map((p: Province) => ({
    code: p.code,
    name: p.name,
  }));
}

export async function getCitiesByProvince(
  provinceCode: string,
): Promise<CityOrMunicipality[]> {
  if (!provinceCode) return [];

  const res = await fetch(
    `https://psgc.cloud/api/v1/provinces/${provinceCode}/cities-municipalities`,
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.data ?? data).map((c: CityOrMunicipality) => ({
    code: c.code,
    name: c.name,
    type: c.type,
  }));
}
