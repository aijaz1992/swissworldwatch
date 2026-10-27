"use server";

import { attachGuestCart, getCart, getOrCreateCart } from "@/lib/cart";
import { clearSession, createSession, getCurrentUser, safeNextPath } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UPI_REFERENCE_PATTERN } from "@/lib/payment";
import { getSettings } from "@/lib/settings";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type FormState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return { error: "Those details don't match an account." };
  }

  await createSession(user);
  await attachGuestCart(user.id);
  redirect(safeNextPath(formData.get("next"), user.role === "ADMIN" ? "/admin" : "/account"));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await hash(parsed.data.password, 10),
      role: "USER",
    },
  });

  await createSession(user);
  await attachGuestCart(user.id);
  redirect("/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function setCurrency(formData: FormData) {
  const currency = formData.get("currency") === "USD" ? "USD" : "INR";
  (await cookies()).set("sww_currency", currency, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}

async function writeCartQuantity(productId: string, quantity: number, mode: "add" | "set") {
  const product = await prisma.product.findFirst({ where: { id: productId, status: "ACTIVE" } });
  if (!product) return { error: "That watch is no longer available." };
  if (product.stock < 1) return { error: "That watch is out of stock." };

  const cart = await getOrCreateCart();
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  const requested = mode === "add" ? (existing?.quantity ?? 0) + quantity : quantity;
  const nextQuantity = Math.max(1, Math.min(product.stock, requested));

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId, quantity: nextQuantity },
  });

  revalidatePath("/", "layout");
  return { error: undefined };
}

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1) || 1);
  await writeCartQuantity(productId, quantity, "add");
}

export async function buyNow(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1) || 1);
  const result = await writeCartQuantity(productId, quantity, "set");
  if (result.error) return;
  redirect("/checkout");
}

export async function updateCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  const cart = await getCart();
  const item = cart?.items.find((entry) => entry.id === itemId);
  if (!item) return;

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    const nextQuantity = Math.min(item.product.stock, quantity);
    if (nextQuantity < 1) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: nextQuantity } });
    }
  }
  revalidatePath("/", "layout");
}

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const cart = await getCart();
  if (!cart?.items.some((item) => item.id === itemId)) return;
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/", "layout");
}

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(10, "Enter a phone number."),
  line1: z.string().trim().min(4, "Enter the address."),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().trim().min(2, "Enter the state."),
  postalCode: z.string().trim().min(4, "Enter the PIN code."),
  paymentMethod: z.enum(["COD", "PREPAID", "UPI"]),
  paymentReference: z
    .string()
    .trim()
    .regex(UPI_REFERENCE_PATTERN, "Enter the UPI transaction ID / UTR exactly as shown on your receipt.")
    .optional(),
  notes: z.string().trim().max(400).optional(),
});

class CheckoutError extends Error {}

export async function placeOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) return { error: "Your cart is empty." };

  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    paymentMethod: formData.get("paymentMethod"),
    paymentReference: formData.get("paymentReference") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const settings = await getSettings();
  const user = await getCurrentUser();
  const activeItems = cart.items.filter((item) => item.product.status === "ACTIVE");
  if (activeItems.length !== cart.items.length) {
    return { error: "A watch in your cart is no longer available. Review the cart and try again." };
  }

  const subtotal = activeItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount =
    parsed.data.paymentMethod === "PREPAID" || parsed.data.paymentMethod === "UPI"
      ? Math.round((subtotal * settings.prepaidDiscount) / 100)
      : 0;
  const total = subtotal - discount;

  try {
    const orderNumber = await prisma.$transaction(async (tx) => {
      for (const item of activeItems) {
        if (item.quantity > item.product.stock) {
          throw new CheckoutError(`Only ${item.product.stock} left for ${item.product.name}.`);
        }
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            status: "ACTIVE",
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new CheckoutError(`${item.product.name} just sold out. Update your cart and try again.`);
        }
      }

      const address = await tx.address.create({
        data: {
          userId: user?.id,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          line1: parsed.data.line1,
          line2: parsed.data.line2,
          city: parsed.data.city,
          state: parsed.data.state,
          postalCode: parsed.data.postalCode,
        },
      });

      const number = `SWW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      await tx.order.create({
        data: {
          orderNumber: number,
          userId: user?.id,
          email: parsed.data.email.toLowerCase(),
          paymentMethod: parsed.data.paymentMethod,
          // UPI QR payments stay PENDING until an admin matches the UTR against the bank statement.
          paymentReference: parsed.data.paymentMethod === "UPI" ? parsed.data.paymentReference : undefined,
          status: parsed.data.paymentMethod === "PREPAID" ? "CONFIRMED" : "PENDING",
          subtotal,
          discount,
          shipping: 0,
          total,
          addressId: address.id,
          notes: parsed.data.notes,
          items: {
            create: activeItems.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              sku: item.product.sku,
              price: item.product.price,
              quantity: item.quantity,
              imageUrl: item.product.images[0]?.url,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return number;
    });

    revalidatePath("/", "layout");
    redirect(`/checkout/success/${orderNumber}`);
  } catch (error) {
    if (error instanceof CheckoutError) return { error: error.message };
    throw error;
  }
}

const upiReferenceSchema = z.object({
  orderNumber: z.string().trim().min(1),
  paymentReference: z
    .string()
    .trim()
    .regex(UPI_REFERENCE_PATTERN, "Enter the UPI transaction ID / UTR exactly as shown on your receipt."),
});

export async function submitUpiReference(_prev: FormState, formData: FormData): Promise<FormState & { ok?: boolean }> {
  const parsed = upiReferenceSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    paymentReference: formData.get("paymentReference"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const updated = await prisma.order.updateMany({
    where: { orderNumber: parsed.data.orderNumber, paymentMethod: "UPI", status: "PENDING" },
    data: { paymentReference: parsed.data.paymentReference },
  });
  if (updated.count !== 1) return { error: "This order can no longer be updated. Contact us on WhatsApp for help." };

  revalidatePath(`/checkout/success/${parsed.data.orderNumber}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
