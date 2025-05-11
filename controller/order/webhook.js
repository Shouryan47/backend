const stripe = require("../../config/stripe");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");

const endpointSecret =
  "whsec_709fce569106eb50cf43adea688b66ff4925dce50682e883968499ec3490ebe4";

// Helper function to extract product details
async function getLineItems(lineItems) {
  let productItems = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      const productData = {
        productId: productId,
        name: product.name,
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        image: product.images,
      };
      console.log(productData);
      productItems.push(productData, "Product Data");
    }
  }

  return productItems;
}

const webhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      endpointSecret
    );

    // Handle checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fetch line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const productDetails = await getLineItems(lineItems);

      // Prepare order data
      const orderDetails = {
        productDetails: productDetails,
        email: session.customer_email,
        userId: session.metadata.userId,
        paymentDetails: {
          paymentId: session.payment_intent,
          payment_method_type: session.payment_method_types,
          payment_status: session.payment_status,
        },
        shipping: session.shipping || null, // Optional shipping info
        totalAmount: session.amount_total / 100,
      };

      console.log(orderDetails);

      console.log("Saving Order:", orderDetails); // 🔍 for debugging

      const order = new orderModel(orderDetails);
      const savedOrder = await order.save();

      if (savedOrder?._id) {
        // Clear the user's cart
        await addToCartModel.deleteMany({ userId: session.metadata.userId });
        console.log("✅ Order saved and cart cleared.");
      }
    }

    response.status(200).send();
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = webhooks;
