// Ključi v shrambi telefona imajo predpono imena aplikacije (brand.json slug), kot localStorage na spletu.
import brand from "../../../brand.json";

export const key = (name: string) => `${brand.slug}.${name}`;
