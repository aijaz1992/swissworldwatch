export const metadata = { title: "Policies" };

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 text-sm leading-7 text-neutral-700">
      <h1 className="text-3xl font-bold text-neutral-950">Policies</h1>
      <section id="shipping">
        <h2 className="text-xl font-semibold text-neutral-950">Shipping</h2>
        <p className="mt-2">Orders inside India ship free and usually leave within 2–3 days. International shipping is quoted separately before dispatch.</p>
      </section>
      <section id="returns">
        <h2 className="text-xl font-semibold text-neutral-950">Returns</h2>
        <p className="mt-2">If a watch arrives damaged or is not the model you ordered, contact us within 48 hours with your order number and photos of the parcel.</p>
      </section>
      <section id="warranty">
        <h2 className="text-xl font-semibold text-neutral-950">Warranty</h2>
        <p className="mt-2">Quartz watches include a 1 year warranty. Swiss automatic watches include a 2 year warranty covering manufacturing defects.</p>
      </section>
      <section id="privacy">
        <h2 className="text-xl font-semibold text-neutral-950">Privacy</h2>
        <p className="mt-2">Account details, addresses, and orders are stored to fulfil purchases and run the store. They are not sold. Admins can see customer records in the dashboard.</p>
      </section>
    </div>
  );
}
