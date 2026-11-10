import { PrismaClient, type Gender } from "@prisma/client";
import { hash } from "bcryptjs";
import { persistLocalCatalogImages } from "./persist-images";

const prisma = new PrismaClient();

const img = (n: number) => `/catalog/${String(n).padStart(2, "0")}.jpg`;

const brands = [
  { name: "Leman", slug: "leman", description: "Steel sports watches with Swiss automatic movements.", imageUrl: img(15), featured: true, sortOrder: 1 },
  { name: "Alpine", slug: "alpine", description: "Chronographs and field watches for daily wear.", imageUrl: img(9), featured: true, sortOrder: 2 },
  { name: "Montreux", slug: "montreux", description: "Dress watches with slim cases and clean dials.", imageUrl: img(10), featured: true, sortOrder: 3 },
  { name: "Helvetia", slug: "helvetia", description: "Classic automatics, including a moonphase.", imageUrl: img(3), featured: true, sortOrder: 4 },
  { name: "Nord", slug: "nord", description: "Smaller cases and quartz movements.", imageUrl: img(5), featured: true, sortOrder: 5 },
  { name: "Atelier Geneve", slug: "atelier-geneve", description: "Shaped cases in steel and rose gold tone.", imageUrl: img(17), featured: true, sortOrder: 6 },
  { name: "Swiss World", slug: "swiss-world", description: "Boxes and accessories from the store.", imageUrl: img(7), featured: false, sortOrder: 7 },
];

const categories = [
  { name: "Divers", slug: "divers", description: "Rotating-bezel watches built for water.", sortOrder: 1 },
  { name: "Chronograph", slug: "chronograph", description: "Watches with a stopwatch layout.", sortOrder: 2 },
  { name: "Dress", slug: "dress", description: "Slim watches for a shirt cuff.", sortOrder: 3 },
  { name: "Sports", slug: "sports", description: "GMT and tool watches.", sortOrder: 4 },
  { name: "Classic", slug: "classic", description: "Time-and-date watches with simple dials.", sortOrder: 5 },
  { name: "Watch Box", slug: "watch-box", description: "Cases and presentation boxes.", sortOrder: 6 },
];

const collections = [
  { name: "Swiss Automatic", slug: "swiss-automatic", description: "Automatic movements." },
  { name: "Steel Sport", slug: "steel-sport", description: "Steel cases and bracelets." },
  { name: "Evening", slug: "evening", description: "Gold-tone and leather straps." },
  { name: "Accessories", slug: "accessories", description: "Storage and presentation." },
];

type SeedWatch = {
  name: string;
  slug: string;
  brand: string;
  category: string;
  collection: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  gender: Gender;
  movement: string | null;
  caseMaterial: string | null;
  strapMaterial: string | null;
  dialColor: string | null;
  caseSize: string | null;
  waterResistance: string | null;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  image: number;
  gallery: number;
};

const watches: SeedWatch[] = [
  { name: "Leman Mariner Steel Black Dial 41mm Swiss Automatic Watch", slug: "leman-mariner-black", brand: "leman", category: "divers", collection: "swiss-automatic", price: 8499, compareAtPrice: 11999, sku: "SWW-LM-041", stock: 8, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Black", caseSize: "41mm", waterResistance: "300m", featured: true, bestSeller: true, isNew: true, image: 15, gallery: 9 },
  { name: "Leman Mariner Steel Blue Dial 41mm Swiss Automatic Watch", slug: "leman-mariner-blue", brand: "leman", category: "divers", collection: "swiss-automatic", price: 8999, compareAtPrice: 12499, sku: "SWW-LM-042", stock: 6, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Blue", caseSize: "41mm", waterResistance: "300m", isNew: true, image: 4, gallery: 15 },
  { name: "Alpine Peak Chronograph Steel Panda Dial 40mm Swiss Automatic Watch", slug: "alpine-peak-panda", brand: "alpine", category: "chronograph", collection: "swiss-automatic", price: 9999, compareAtPrice: 13999, sku: "SWW-AP-040", stock: 5, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "White panda", caseSize: "40mm", waterResistance: "100m", featured: true, bestSeller: true, isNew: true, image: 9, gallery: 18 },
  { name: "Alpine Peak Chronograph Two-Tone Black Dial 40mm Swiss Automatic Watch", slug: "alpine-peak-two-tone", brand: "alpine", category: "chronograph", collection: "swiss-automatic", price: 10499, compareAtPrice: 14999, sku: "SWW-AP-041", stock: 4, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Two-tone steel", strapMaterial: "Two-tone bracelet", dialColor: "Black", caseSize: "40mm", waterResistance: "100m", isNew: true, image: 18, gallery: 1 },
  { name: "Montreux Roman Steel Silver Dial 39mm Swiss Automatic Watch", slug: "montreux-roman-steel", brand: "montreux", category: "dress", collection: "swiss-automatic", price: 7499, compareAtPrice: 9999, sku: "SWW-MT-039", stock: 11, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Silver", caseSize: "39mm", waterResistance: "50m", bestSeller: true, image: 10, gallery: 3 },
  { name: "Helvetia Classic Steel Slate Dial 40mm Swiss Automatic Watch", slug: "helvetia-classic-slate", brand: "helvetia", category: "classic", collection: "swiss-automatic", price: 6999, compareAtPrice: 9499, sku: "SWW-HV-040", stock: 14, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Slate", caseSize: "40mm", waterResistance: "100m", featured: true, image: 3, gallery: 10 },
  { name: "Leman GMT Two-Tone Black Dial 40mm Swiss Automatic Watch", slug: "leman-gmt-two-tone", brand: "leman", category: "sports", collection: "steel-sport", price: 11499, compareAtPrice: 15999, sku: "SWW-LM-040", stock: 3, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Two-tone steel", strapMaterial: "Two-tone bracelet", dialColor: "Black", caseSize: "40mm", waterResistance: "100m", featured: true, image: 13, gallery: 17 },
  { name: "Alpine Field Green Dial Steel 40mm Swiss Automatic Watch", slug: "alpine-field-green", brand: "alpine", category: "sports", collection: "steel-sport", price: 6499, compareAtPrice: 8999, sku: "SWW-AP-042", stock: 9, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Green", caseSize: "40mm", waterResistance: "100m", image: 14, gallery: 4 },
  { name: "Helvetia Date Steel Bright Blue Dial 41mm Swiss Automatic Watch", slug: "helvetia-date-blue", brand: "helvetia", category: "classic", collection: "swiss-automatic", price: 7999, compareAtPrice: 10999, sku: "SWW-HV-041", stock: 0, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Bright blue", caseSize: "41mm", waterResistance: "100m", image: 16, gallery: 2 },
  { name: "Helvetia Moonphase Steel Silver Dial 40mm Swiss Automatic Watch", slug: "helvetia-moonphase", brand: "helvetia", category: "classic", collection: "swiss-automatic", price: 12999, compareAtPrice: 16999, sku: "SWW-HV-042", stock: 2, gender: "MEN", movement: "Swiss Automatic", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Silver", caseSize: "40mm", waterResistance: "50m", featured: true, image: 12, gallery: 6 },
  { name: "Montreux Slim Rose Gold White Dial Leather 38mm Swiss Automatic Watch", slug: "montreux-slim-rose-gold", brand: "montreux", category: "dress", collection: "evening", price: 8999, compareAtPrice: 11999, sku: "SWW-MT-038", stock: 7, gender: "WOMEN", movement: "Swiss Automatic", caseMaterial: "Rose gold tone", strapMaterial: "Leather strap", dialColor: "White", caseSize: "38mm", waterResistance: "30m", featured: true, image: 5, gallery: 8 },
  { name: "Nord Petite Steel Silver Dial 28mm Swiss Quartz Watch", slug: "nord-petite-silver", brand: "nord", category: "dress", collection: "evening", price: 5499, compareAtPrice: 7999, sku: "SWW-ND-028", stock: 10, gender: "WOMEN", movement: "Swiss Quartz", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Silver", caseSize: "28mm", waterResistance: "30m", bestSeller: true, isNew: true, image: 8, gallery: 5 },
  { name: "Nord Oval Rose Gold White Dial Leather 24mm Swiss Quartz Watch", slug: "nord-oval-rose-gold", brand: "nord", category: "dress", collection: "evening", price: 6499, compareAtPrice: 8999, sku: "SWW-ND-024", stock: 6, gender: "WOMEN", movement: "Swiss Quartz", caseMaterial: "Rose gold tone", strapMaterial: "Leather strap", dialColor: "White", caseSize: "24mm", waterResistance: "30m", bestSeller: true, image: 1, gallery: 5 },
  { name: "Nord Ceramic Bezel Rose Gold Chronograph 38mm Swiss Quartz Watch", slug: "nord-ceramic-chronograph", brand: "nord", category: "chronograph", collection: "evening", price: 11999, compareAtPrice: 15499, sku: "SWW-ND-038", stock: 4, gender: "WOMEN", movement: "Swiss Quartz", caseMaterial: "Rose gold tone", strapMaterial: "Steel bracelet", dialColor: "White", caseSize: "38mm", waterResistance: "50m", image: 11, gallery: 1 },
  { name: "Atelier Geneve Square Rose Gold White Dial Swiss Automatic Watch", slug: "atelier-square-rose-gold", brand: "atelier-geneve", category: "sports", collection: "evening", price: 10999, compareAtPrice: 14999, sku: "SWW-AG-040", stock: 5, gender: "UNISEX", movement: "Swiss Automatic", caseMaterial: "Rose gold tone", strapMaterial: "Steel bracelet", dialColor: "White", caseSize: "40mm", waterResistance: "100m", featured: true, image: 17, gallery: 12 },
  { name: "Atelier Geneve Rectangle Rose Gold White Dial Leather Swiss Quartz Watch", slug: "atelier-rectangle-rose-gold", brand: "atelier-geneve", category: "dress", collection: "evening", price: 8499, compareAtPrice: 11499, sku: "SWW-AG-024", stock: 8, gender: "WOMEN", movement: "Swiss Quartz", caseMaterial: "Rose gold tone", strapMaterial: "Leather strap", dialColor: "White", caseSize: "24mm", waterResistance: "30m", image: 6, gallery: 5 },
  { name: "Montreux Star Steel Blue Dial 36mm Swiss Quartz Watch", slug: "montreux-star-blue", brand: "montreux", category: "dress", collection: "steel-sport", price: 5999, compareAtPrice: 8499, sku: "SWW-MT-036", stock: 0, gender: "WOMEN", movement: "Swiss Quartz", caseMaterial: "Stainless steel", strapMaterial: "Steel bracelet", dialColor: "Blue", caseSize: "36mm", waterResistance: "50m", image: 2, gallery: 16 },
  { name: "Swiss World Leather Presentation Box", slug: "swiss-world-presentation-box", brand: "swiss-world", category: "watch-box", collection: "accessories", price: 1499, compareAtPrice: 1999, sku: "SWW-BX-001", stock: 25, gender: "UNISEX", movement: null, caseMaterial: "Leather", strapMaterial: null, dialColor: null, caseSize: "Single watch", waterResistance: null, image: 7, gallery: 7 },
];

const faqs = [
  { question: "Which movements are in the watches?", answer: "Each product page lists the movement. Swiss automatic watches are self-winding. Swiss quartz watches use a battery. Filter the catalog by Swiss Automatic from the main menu.", sortOrder: 1 },
  { question: "Do the watches include a warranty?", answer: "Quartz watches include 1 year. Swiss automatic watches include 2 years, covering manufacturing defects.", sortOrder: 2 },
  { question: "Are they water-resistant?", answer: "Water resistance is listed on every watch, from 30m dress watches to 300m divers. Do not use the crown in water.", sortOrder: 3 },
  { question: "Do you ship across India?", answer: "Yes. Shipping inside India is free, and most orders leave within 2–3 days. City pages in the footer confirm we deliver there.", sortOrder: 4 },
  { question: "How does the prepaid discount work?", answer: "Choose Prepaid at checkout. The discount percentage is set in the store settings and is calculated on the server from the current prices.", sortOrder: 5 },
  { question: "Can I pay cash on delivery?", answer: "Yes. Cash on delivery is a payment option at checkout and does not include the prepaid discount.", sortOrder: 6 },
  { question: "Does the order include a box?", answer: "Watches ship in a presentation box. A separate leather box is also listed in the Watch Box category.", sortOrder: 7 },
  { question: "How do returns work?", answer: "If the parcel is damaged or the wrong model arrives, contact support within 48 hours with the order number and photos.", sortOrder: 8 },
];

const reviews = [
  { author: "IND A.", rating: 5, body: "The bracelet and dial match the photos. It arrived in two days and the automatic movement started right away." },
  { author: "Rina Rani P.", rating: 5, body: "Clear product page, and the watch I received is the one I ordered. I would buy from the store again." },
  { author: "Ganesh K.", rating: 5, body: "Sizing and water-resistance notes made the choice easy. Packaging was solid." },
  { author: "Subhani S.", rating: 4, body: "Good finish for the price. Support answered the WhatsApp message the same day." },
];

async function main() {
  const password = await hash("Admin@12345", 10);
  const customerPassword = await hash("Customer@12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@swissworldwatch.com" },
    // Runs on every deploy: never overwrite an existing password, or a changed admin password would reset to the default.
    update: { role: "ADMIN" },
    create: { email: "admin@swissworldwatch.com", name: "Store Admin", passwordHash: password, role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { email: "customer@swissworldwatch.com" },
    update: {},
    create: { email: "customer@swissworldwatch.com", name: "Asha Mehta", passwordHash: customerPassword, role: "USER" },
  });

  const settings: Record<string, string> = {
    promoText: "Get 10% OFF on Prepaid",
    phone: "+91 70205 07645",
    hours: "Mon – Sat (10am – 7pm)",
    email: "support@swissworldwatch.com",
    address: "Lower Parel, Mumbai — 400013",
    whatsapp: "917020507645",
    telegram: "https://t.me/swissworldwatch",
    prepaidDiscount: "10",
    heroTitle: "SWISS AUTOMATIC WATCHES",
    heroLine2: "10% DISCOUNT ON PREPAID",
    heroLine3: "CASH ON DELIVERY AVAILABLE IN INDIA",
    heroImage: "/catalog/hero.jpg",
    storeBlurb: "Trusted online store for Swiss automatic and quartz watches, with insured shipping across India.",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: key === "phone" || key === "whatsapp" ? { value } : {},
      create: { key, value },
    });
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: faqs });
  }
  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: reviews });
  }
  if ((await prisma.product.count()) > 0) {
    await persistLocalCatalogImages(prisma);
    return;
  }

  await prisma.brand.createMany({ data: brands });
  await prisma.category.createMany({ data: categories });
  await prisma.collection.createMany({ data: collections });

  const [brandRows, categoryRows, collectionRows] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.collection.findMany(),
  ]);
  const brandId = Object.fromEntries(brandRows.map((row) => [row.slug, row.id]));
  const categoryId = Object.fromEntries(categoryRows.map((row) => [row.slug, row.id]));
  const collectionId = Object.fromEntries(collectionRows.map((row) => [row.slug, row.id]));

  for (const [index, watch] of watches.entries()) {
    const description = watch.movement
      ? `${watch.name} uses a ${watch.movement.toLowerCase()} movement in a ${watch.caseSize} ${watch.caseMaterial?.toLowerCase()} case with a ${watch.dialColor?.toLowerCase()} dial.`
      : "A lined leather presentation box sized for one watch, with a cushion and a snap closure.";
    await prisma.product.create({
      data: {
        name: watch.name,
        slug: watch.slug,
        brandId: brandId[watch.brand],
        categoryId: categoryId[watch.category],
        collectionId: collectionId[watch.collection],
        description,
        details: watch.movement
          ? `Supplied on a ${watch.strapMaterial?.toLowerCase()} with ${watch.waterResistance} water resistance. The price on this page is the current selling price. If a compare-at price is shown, the difference is the discount.`
          : "Sold on its own or added beside a watch. Stock is tracked the same way as the watches.",
        price: watch.price,
        compareAtPrice: watch.compareAtPrice,
        sku: watch.sku,
        stock: watch.stock,
        featured: watch.featured ?? false,
        bestSeller: watch.bestSeller ?? false,
        isNew: watch.isNew ?? false,
        gender: watch.gender,
        movement: watch.movement,
        caseMaterial: watch.caseMaterial,
        strapMaterial: watch.strapMaterial,
        dialColor: watch.dialColor,
        caseSize: watch.caseSize,
        waterResistance: watch.waterResistance,
        createdAt: new Date(Date.UTC(2026, 8, 28) - index * 36 * 60 * 60 * 1000),
        images: {
          create: [
            { url: img(watch.image), alt: watch.name, sortOrder: 0, isPrimary: true },
            ...(watch.gallery === watch.image
              ? []
              : [{ url: img(watch.gallery), alt: `${watch.name} alternate view`, sortOrder: 1, isPrimary: false }]),
          ],
        },
        specs: {
          create: watch.movement
            ? [
                { label: "Crystal", value: "Sapphire", sortOrder: 0 },
                { label: "Clasp", value: watch.strapMaterial?.includes("Leather") ? "Buckle" : "Folding clasp", sortOrder: 1 },
              ]
            : [{ label: "Capacity", value: "One watch", sortOrder: 0 }],
        },
      },
    });
  }

  await persistLocalCatalogImages(prisma);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
