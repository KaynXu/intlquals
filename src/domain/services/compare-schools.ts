import type { School } from "../models/school.js";

export function compareSchools(schools: School[]) {
  return schools.map((school) => ({
    id: school.id,
    name: school.name,
    city: school.city ?? "",
    curricula: school.curricula.join(",")
  }));
}
