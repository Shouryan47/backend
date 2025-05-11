const orderModel = require("../../models/orderProductModel").default;

const orderController = async (request, response) => {
  console.log("Order Controller");
  try {
    const currentUserId = request.userId;
    console.log(currentUserId);

    const orderList = await orderModel
      .find({ userId: currentUserId })
      .sort({ createdAt: -1 });

    response.json({
      data: orderList,
      message: "Order list",
      success: true,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = orderController;
