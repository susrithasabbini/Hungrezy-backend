import { Order } from "../models/index.js";
import { dbUtils } from "../utils/index.js";

const TAG = "service.order";

const placeOrder = async (payload) => {
  try {
    const { userId, restaurantId, foodItems, address, paymentDetails } =
      payload;
    const order = new Order({
      userId,
      restaurantId,
      foodItems,
      address,
      paymentDetails,
      orderedAt: new Date(),
      status: "placed",
    });
    await order.save();
    return {
      status: 200,
      message: "order placed!",
      data: order,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in placeOrder() => ${error}`);
    throw error;
  }
};

const getOrder = async (req) => {
  const ObjectId = dbUtils.stringToObjectId(req.params.orderId);
  try {
    const order = await Order.findById(ObjectId).populate(
      "userId",
      "_id firstName lastName"
    );
    if (!order)
      return {
        status: 404,
        message: "order not found",
      };
    if (
      req.user_role === "restaurant" &&
      order.restaurantId.toString() !== req.user_mongo_id
    )
      return {
        status: 403,
        message: "Unauthorized access",
      };
    if (
      req.user_role === "user" &&
      order.userId.toString() !== req.user_mongo_id
    )
      return {
        status: 403,
        message: "Unauthorized access",
      };
    return {
      status: 200,
      message: "Order HIT!",
      data: order,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getOrder() => ${error}`);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const ObjectId = dbUtils.stringToObjectId(orderId);
    const order = await Order.findById(ObjectId);
    if (!order)
      return {
        status: 404,
        message: "order not found",
      };
    const currentStatus = order.status;
    if (!checkValidUpdateOrderStatus(currentStatus, status))
      return {
        status: 400,
        message: "Invalid order status update request",
      };
    order.status = status;
    await order.save();
    return {
      status: 200,
      message: "Order status updated successfully!",
      data: order,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateOrderStatus() => ${error}`);
    throw error;
  }
};

const checkValidUpdateOrderStatus = (currentStatus, status) => {
  console.log(currentStatus, status);
  if (
    currentStatus == "placed" &&
    (status == "processing" || status == "delivered" || status == "cancelled")
  )
    return true;
  if (
    currentStatus == "processing" &&
    (status == "delivered" || status == "cancelled")
  )
    return true;
  return false;
};

const cancelUserOrder = async (orderId) => {
  try {
    const ObjectId = dbUtils.stringToObjectId(orderId);
    const order = await Order.findById(ObjectId);
    if (!order)
      return {
        status: 404,
        message: "order not found",
      };
    order.status = "cancelled";
    await order.save();
    return {
      status: 200,
      message: "Order cancelled successfully!",
      data: order,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in cancelUserOrder() => ${error}`);
    throw error;
  }
};

const getUserOrders = async (user_id, status) => {
  if (!status)
    return {
      status: 400,
      message: "Status query required!",
    };
  const ObjectId = dbUtils.stringToObjectId(user_id);
  let filter = {};
  if (status == "all") filter.userId = ObjectId;
  else {
    filter.userId = ObjectId;
    filter.status = status;
  }
  try {
    const orders = await Order.find(filter).populate(
      "restaurantId",
      "_id name"
    );
    return {
      status: 200,
      message: "User orders HIT!",
      data: orders,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getUserOrders() => ${error}`);
    throw error;
  }
};

const getRestaurantOrders = async (restaurant_id, status, customerId) => {
  if (!status)
    return {
      status: 400,
      message: "Status query required!",
    };
  const ObjectId = dbUtils.stringToObjectId(restaurant_id);
  let filter = {};
  if (status === "all") {
    filter.restaurantId = ObjectId;
  } else {
    filter.restaurantId = ObjectId;
    filter.status = status;
  }
  if (customerId) {
    filter.userId = dbUtils.stringToObjectId(customerId);
  }
  try {
    const orders = await Order.find(filter)
      .populate("restaurantId", "_id name email")
      .populate("userId", "_id firstName lastName");
    return {
      status: 200,
      message: "Restaurant orders HIT!",
      data: orders,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantOrders() => ${error}`);
    throw error;
  }
};

const getRestaurantOrderStats = async (restaurant_id) => {
  const ObjectId = dbUtils.stringToObjectId(restaurant_id);
  try {
    const [
      totalOrders,
      newOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      Order.find({ restaurantId: ObjectId }).countDocuments(),
      Order.find({ status: "placed", restaurantId: ObjectId }).countDocuments(),
      Order.find({
        status: "processing",
        restaurantId: ObjectId,
      }).countDocuments(),
      Order.find({
        status: "delivered",
        restaurantId: ObjectId,
      }).countDocuments(),
      Order.find({
        status: "cancelled",
        restaurantId: ObjectId,
      }).countDocuments(),
      Order.aggregate([
        { $match: { restaurantId: ObjectId, status: "delivered" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$paymentDetails.amount" },
          },
        },
      ]),
    ]);

    const quarterlyOrders = await Order.aggregate([
      {
        $match: {
          restaurantId: ObjectId, 
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $and: [{ $lte: [{ $month: "$orderedAt" }, 3] }, { $gte: [{ $month: "$orderedAt" }, 1] }] }, then: "Jan-Mar" },
                { case: { $and: [{ $lte: [{ $month: "$orderedAt" }, 6] }, { $gte: [{ $month: "$orderedAt" }, 4] }] }, then: "Apr-Jun" },
                { case: { $and: [{ $lte: [{ $month: "$orderedAt" }, 9] }, { $gte: [{ $month: "$orderedAt" }, 7] }] }, then: "Jul-Sep" },
                { case: { $and: [{ $lte: [{ $month: "$orderedAt" }, 12] }, { $gte: [{ $month: "$orderedAt" }, 10] }] }, then: "Oct-Dec" },
              ],
              default: "Unknown"
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          quarter: "$_id",
          count: { $ifNull: ["$count", 0] },
        },
      },
      {
        $sort: { quarter: 1 },
      },
    ]);
    
    const quarters = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
    
    const mergedData = quarters.map((quarter) => {
      const existingData = quarterlyOrders.find((item) => item.quarter === quarter);
      if (existingData) {
        return {
          quarter,
          orders: existingData.count,
        };
      } else {
        return { quarter, orders: 0 };
      }
    });

    const stats = {
      totalOrders,
      newOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
      quarterlyOrders: mergedData,
    };

    return {
      status: 200,
      message: "Order Stats HIT!",
      data: stats,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantOrderStats() => ${error}`);
    throw error;
  }
};

const getRestaurantOrderStatsWithFilters = async (req) => {
  const restaurantId = dbUtils.stringToObjectId(req.params.restaurant_id);
  const { status, date, customerId } = req.query;
  let matchFilter = { restaurantId };

  if (status && status != "all") matchFilter.status = status;
  if (customerId && customerId != "all")
    matchFilter.userId = dbUtils.stringToObjectId(customerId);
  if (date && date != "all") matchFilter = getDateFilter(matchFilter, date);

  try {
    const result = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          averageRevenuePerOrder: { $avg: "$paymentDetails.amount" },
          totalRevenue: { $sum: "$paymentDetails.amount" },
          mostFrequentCategories: { $addToSet: "$foodItems.category" },
          mostFrequentFoodItems: { $addToSet: "$foodItems.name" },
        },
      },
      {
        $project: {
          totalOrders: 1,
          averageRevenuePerOrder: 1,
          totalRevenue: 1,
          mostFrequentCategory: { $slice: ["$mostFrequentCategories", 1] },
          mostFrequentFoodItem: { $slice: ["$mostFrequentFoodItems", 1] },
        },
      },
      {
        $unwind: {
          path: "$mostFrequentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$mostFrequentFoodItem",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    let stats = result[0];
    if (!stats) {
      stats = {
        totalOrders: 0,
        averageRevenuePerOrder: 0,
        totalRevenue: 0,
        mostFrequentCategory: ["NA"],
        mostFrequentFoodItem: ["NA"],
      };
    }

    return {
      status: 200,
      message: "Orders Stats HIT!",
      data: stats,
    };
  } catch (error) {
    console.error(
      `${TAG} ERROR in getRestaurantOrderStatsWithFilters() => ${error}`
    );
    throw error;
  }
};

const getDateFilter = (filter, date) => {
  if (date === "today") {
    filter.orderedAt = {
      $gte: new Date(new Date().setHours(0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59)),
    };
  } else if (date === "last-week") {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get the first day of the current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Get the last day of the current week
    filter.orderedAt = { $gte: startOfWeek, $lt: endOfWeek };
  } else if (date === "last-month") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Get the first day of the current month
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Get the first day of the next month
    filter.orderedAt = { $gte: startOfMonth, $lt: endOfMonth };
  } else if (date === "last-year") {
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1); // Get the first day of the current year
    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(endOfYear.getFullYear() + 1); // Get the first day of the next year
    filter.orderedAt = { $gte: startOfYear, $lt: endOfYear };
  }
  return filter;
};

const getOrderCount = async () => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.find({ status: "delivered" }).countDocuments();
    return {
      status: 200,
      message: "Order count HIT!",
      data: {
        totalOrders,
        deliveredOrders,
      },
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getOrderCount() => ${error}`);
    throw error;
  }
};

export {
  placeOrder,
  getUserOrders,
  getRestaurantOrders,
  getOrder,
  updateOrderStatus,
  getRestaurantOrderStats,
  cancelUserOrder,
  getRestaurantOrderStatsWithFilters,
  getOrderCount,
};
