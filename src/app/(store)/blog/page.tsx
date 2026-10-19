import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on choosing a Swiss automatic or quartz watch.",
};

const posts = [
  {
    title: "How to read a watch specification",
    body: "Start with case size, then movement, water resistance, and strap. A 40mm automatic diver and a 28mm quartz dress watch solve different days. The product page lists each of those fields from the catalog, so you can compare two watches without guessing.",
  },
  {
    title: "Prepaid or cash on delivery",
    body: "Cash on delivery keeps payment until the parcel arrives. Prepaid checkout applies the discount configured in the store settings. Either way, the order is saved with the address, items, and price you confirmed.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="mt-8 space-y-10">
        {posts.map((post) => (
          <article key={post.title}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
