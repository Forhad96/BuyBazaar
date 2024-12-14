import { CartItem, OrderItem, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";

//Get All Orders admin can see all orders and customer can see only their orders
const getAllOrders = async (user: IAuthUser) => {
  if (user?.role !== UserRole.SUPERADMIN && user?.role !== UserRole.ADMIN) {
    const result = await prisma.order.findMany({
      include: {
        orderItem: true,
      },
    });

    return result;
  } else {
    const result = await prisma.order.findMany({
      where: {
        customerEmail: user?.email as string,
      },
      include: {
        orderItem: true,
      },
    });
    return result;
  }
};

// Create Order
const createOrder = async (user: IAuthUser) => {
  // 1. Fetch Cart Items for the User
  const cartItems = await prisma.cartItem.findMany({
    where: {
      customerEmail: user?.email as string,
    },
    include: {
      product: true,
    },
  });
  //send error if cart is empty
  if (cartItems.length === 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");

  const result = await prisma.$transaction(async (transactionClient) => {
    // 2. Calculate Total Amount
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    // 3. Handle payment for online payment

    let paymentStatus = "PENDING";
    let paymentType = "ONLINE";
    // 4. Create Order

    // 5. Create Order
    const order = await transactionClient.order.create({
      data: {
        customerEmail: user?.email as string,
        total: totalPrice,
        orderItem: {
          createMany: {
            data: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      },
    });
    // 6. Clear Cart
    await transactionClient.cartItem.deleteMany({
      where: {
        customerEmail: user?.email as string,
      },
    });
    // 7.update product inventory
    await transactionClient.product.updateMany({
      where: {
        id: {
          in: cartItems.map((item) => item.productId),
        },
      },
      data: {
        inventory: {
          decrement: cartItems.reduce((total, item) => {
            return total + item.quantity;
          }, 0),
        },
      },
    });
    return order;
  });

  return result;
};

interface TCheckoutOrder {
  customerEmail: string;
  cartItems: CartItem[];
  paymentMethod: string;
  transactionId: string;
  shippingAddress: string;
}
//checkout order
const checkoutOrder = async (user: IAuthUser,payload:TCheckoutOrder) => {
  const { customerEmail, cartItems, paymentMethod, transactionId, shippingAddress } = payload;

    // Validate cart items
    const products = await prisma.product.findMany({
      where: { id: { in: cartItems.map((item:CartItem) => item.productId) } },
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.inventory < item.quantity) {
        throw new Error(`Product ${item.productId} is unavailable.`);
      }
      return sum + product.price * item.quantity;
    }, 0);

    // Handle payment for online methods
    let paymentResponse;
    if (paymentMethod === 'SSLCommerz') {
      paymentResponse = await processSSLCommerzPayment( totalAmount);
    } else if (paymentMethod === 'Stripe') {
      paymentResponse = await processStripePayment(order.id, totalAmount);
    } else {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    return paymentResponse;
    // Create the order
    const order = await prisma.order.create({
      data: {
        customerEmail,
        total: totalAmount,
        paymentMethod,
        status: paymentStatus,
        shippingAddress,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Update stock
    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
};


// return order
const returnOrder = async (user: IAuthUser) => {};

export const OrderServices = {
  getAllOrders,
  createOrder,
};
