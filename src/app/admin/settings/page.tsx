import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 mb-6 text-sm text-neutral-600">Promo text, contact details, hero copy, and the prepaid discount are stored in the database.</p>
      <SettingsForm
        values={{
          promoText: settings.promoText,
          phone: settings.phone,
          hours: settings.hours,
          email: settings.email,
          address: settings.address,
          whatsapp: settings.whatsapp,
          telegram: settings.telegram,
          prepaidDiscount: String(settings.prepaidDiscount),
          heroTitle: settings.heroTitle,
          heroLine2: settings.heroLine2,
          heroLine3: settings.heroLine3,
          heroImage: settings.heroImage,
          storeBlurb: settings.storeBlurb,
        }}
      />
    </div>
  );
}
