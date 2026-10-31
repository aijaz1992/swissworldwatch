import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

const CART_COOKIE = "sww_cart";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          brand: { select: { name: true, slug: true } },
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
        },
      },
    },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export async function getCart() {
  const session = await getSession();
  if (session) {
    return prisma.cart.findUnique({ where: { userId: session.sub }, include: cartInclude });
  }
  const sessionId = (await cookies()).get(CART_COOKIE)?.value;
  if (!sessionId) return null;
  return prisma.cart.findUnique({ where: { sessionId }, include: cartInclude });
}

export function cartCount(cart: CartWithItems | null) {
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const session = await getSession();

  if (session) {
    const existing = await prisma.cart.findUnique({ where: { userId: session.sub } });
    if (existing) return existing;
    const sessionId = cookieStore.get(CART_COOKIE)?.value;
    if (sessionId) {
      const guest = await prisma.cart.findUnique({ where: { sessionId } });
      if (guest && !guest.userId) {
        return prisma.cart.update({
          where: { id: guest.id },
          data: { userId: session.sub, sessionId: null },
        });
      }
    }
    return prisma.cart.create({ data: { userId: session.sub } });
  }

  let sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const existing = await prisma.cart.findUnique({ where: { sessionId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { sessionId } });
}

export async function attachGuestCart(userId: string) {
  const sessionId = (await cookies()).get(CART_COOKIE)?.value;
  if (!sessionId) return;

  const guest = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!guest) return;

  const userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    await prisma.cart.update({
      where: { id: guest.id },
      data: { userId, sessionId: null },
    });
    return;
  }

  if (guest.id === userCart.id) return;

  for (const item of guest.items) {
    const existing = userCart.items.find((entry) => entry.productId === item.productId);
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { cartId: userCart.id },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guest.id } });
}
