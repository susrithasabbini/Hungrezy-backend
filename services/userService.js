import { User } from "../models/index.js";
import { dbUtils } from "../utils/index.js";
import { authUtils } from "../utils/index.js";
import * as Constants from "../constants/userRoleConstants.js";

const TAG = "service.user";

const addImageDetails = async (data) => {
  const { imageUrl, imageId, userId } = data;
  if (!imageUrl && !imageId && userId)
    throw {
      message: "Image details not provided",
      status: 400,
    };
  try {
    const ObjectId = dbUtils.stringToObjectId(userId);
    const user = await User.findById(ObjectId);
    if (!user)
      throw {
        message: "User not found!",
        status: 404,
      };
    user.image = imageUrl;
    user.imageId = imageId;
    await user.save();
    const accessToken = await authUtils.generateAccessToken({
      id: user.email,
      user_role: Constants.USER_ROLE,
      user,
    });
    const token = {};
    token.accessToken = accessToken;
    token.user = user;
    return {
      token,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in addImageDetails() => ${error}`);
  }
};

const getAllUsers = async (data) => {
  const { date, status } = data;
  let query = {};
  if (date) {
    const dateQuery = dbUtils.getDateQuery(date);
    query = { ...dateQuery };
  }
  if (status && status !== "all") {
    query = { ...query, status: status };
  }

  try {
    const users = await User.find(query);
    return {
      status: 200,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getAllUsers() => ${error}`);
  }
};

const getUserDetails = async (id) => {
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const user = await User.findById(ObjectId);
    if (!user)
      throw {
        message: "User not found!",
        status: 404,
      };
    return {
      status: 200,
      message: "User fetched successfully",
      data: user,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getUserDetails() => ${error}`);
  }
};

const updateCustomerStatus = async (req) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const user = await User.findById(ObjectId);
    if (!user)
      throw {
        message: "User not found!",
        status: 404,
      };
    user.status = status;
    await user.save();
    return {
      status: 200,
      message: `User ${status} successfully!`,
      data: user,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateCustomerStatus() => ${error}`);
  }
};

const getCustomerCount = async () => {
  try {
    const [totalUsers, activeUsers, inActiveUsers] = await Promise.all([
      User.countDocuments(),
      User.find({ status: "active" }).countDocuments(),
      User.find({ status: "inactive" }).countDocuments(),
    ]);

    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: [
                  null,
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
              in: {
                $arrayElemAt: ["$$monthsInString", "$_id"],
              },
            },
          },
          count: { $ifNull: ["$count", 0] },
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const mergedData = allMonths.map((month) => {
      const existingData = monthlyUsers.find((item) => item.month === month);
      if (existingData) {
        return {
          month,
          customers: existingData.count,
        };
      } else {
        return { month, customers: 0 };
      }
    });

    return {
      status: 200,
      message: "Customer count fetched successfully",
      data: {
        totalUsers,
        activeUsers,
        inActiveUsers,
        monthlyUsers: mergedData,
      },
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getCustomerCount() => ${error}`);
  }
};

export {
  addImageDetails,
  getAllUsers,
  getUserDetails,
  updateCustomerStatus,
  getCustomerCount,
};
