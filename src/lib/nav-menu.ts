/**
 * Header navigation menus. Edit names/order here; the header (desktop + mobile)
 * renders exactly this list. Each entry links to a filtered /watches listing.
 */
export const SWISS_ETA_COLLECTION = "swiss-eta";

/** Brand display name -> URL slug (also the Brand.slug in the database). */
export const NAV_BRANDS: Record<string, string> = {
  "Tag Heuer": "tag-heuer",
  Rolex: "rolex",
  Rado: "rado",
  Omega: "omega",
  Hublot: "hublot",
  "Audemars Piguet": "audemars-piguet",
  Tissot: "tissot",
  "Patek Philippe": "patek-philippe",
  Longines: "longines",
  Cartier: "cartier",
  Breitling: "breitling",
  "Vacheron Constantin": "vacheron-constantin",
  Panerai: "panerai",
  "Jaeger-LeCoultre": "jaeger-lecoultre",
  IWC: "iwc",
  "Franck Muller": "franck-muller",
  Corum: "corum",
  "Roger Dubuis": "roger-dubuis",
  "Richard Mille": "richard-mille",
  "Porsche Design": "porsche-design",
  Breguet: "breguet",
  "Bell & Ross": "bell-ross",
  "A. Lange & Söhne": "a-lange-sohne",
  Piaget: "piaget",
  Oris: "oris",
  Nomos: "nomos",
  Movado: "movado",
  Graham: "graham",
  "Glashütte Original": "glashutte-original",
  Gucci: "gucci",
  Montblanc: "montblanc",
  "U-Boat": "u-boat",
  Zenith: "zenith",
  Bovet: "bovet",
  Chopard: "chopard",
  "Ulysse Nardin": "ulysse-nardin",
};

export type NavItem = { label: string; href: string };
export type NavMenu = { label: string; href: string; items: NavItem[] };

const MEN = [
  "Tag Heuer", "Rolex", "Rado", "Omega", "Hublot", "Audemars Piguet", "Tissot", "Patek Philippe", "Longines",
  "Cartier", "Breitling", "Vacheron Constantin", "Panerai", "Jaeger-LeCoultre", "IWC", "Franck Muller", "Corum",
  "Roger Dubuis", "Richard Mille", "Porsche Design", "Breguet", "Bell & Ross", "A. Lange & Söhne", "Piaget", "Oris",
  "Nomos", "Movado", "Graham", "Glashütte Original", "Gucci", "Montblanc", "U-Boat", "Zenith", "Bovet", "Chopard",
];

const WOMEN = [
  "Rolex", "Rado", "Omega", "Longines", "Hublot", "Audemars Piguet", "Breguet", "Cartier", "Franck Muller",
  "Panerai", "Patek Philippe", "Richard Mille",
];

const SWISS_ETA = [
  "Tag Heuer", "Rolex", "Rado", "Patek Philippe", "Omega", "Audemars Piguet", "Ulysse Nardin", "Roger Dubuis",
  "Richard Mille", "Panerai", "Hublot", "Franck Muller", "Zenith", "Longines", "Jaeger-LeCoultre", "IWC", "Cartier",
  "Breguet", "Breitling",
];

const slug = (name: string) => NAV_BRANDS[name];

export const NAV_MENUS: NavMenu[] = [
  {
    label: "Men's Watches",
    href: "/watches?gender=MEN",
    items: MEN.map((name) => ({ label: name, href: `/watches?brand=${slug(name)}&gender=MEN` })),
  },
  {
    label: "Women's Watches",
    href: "/watches?gender=WOMEN",
    items: WOMEN.map((name) => ({ label: name, href: `/watches?brand=${slug(name)}&gender=WOMEN` })),
  },
  {
    label: "Swiss ETA Watches",
    href: `/watches?collection=${SWISS_ETA_COLLECTION}`,
    items: SWISS_ETA.map((name) => ({
      label: `${name} Swiss ETA`,
      href: `/watches?brand=${slug(name)}&collection=${SWISS_ETA_COLLECTION}`,
    })),
  },
];

/** Display name for a brand slug from the menu config (used for listing titles). */
export function navBrandName(brandSlug: string | undefined) {
  if (!brandSlug) return undefined;
  return Object.entries(NAV_BRANDS).find(([, s]) => s === brandSlug)?.[0];
}
