const addToCartModel = require("../../models/cartProduct");

const deleteAllCartProducts = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const deletedItems = await addToCartModel.deleteMany({ userId: currentUserId });

        res.json({
            message: "All products deleted from cart",
            error: false,
            success: true,
            data: deletedItems
        });

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};
module.exports=deleteAllCartProducts