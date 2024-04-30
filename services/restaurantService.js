import { Restaurant } from "../models/index.js";
import { getOrSetCache } from "../redis/getOrSetCache.js";
import { dbUtils } from "../utils/index.js";
import { getAllFoodItems } from "./mongoService.js";

const TAG = "service.restaurant";

const getRestaurants = async (query) => {
  let city = query.city;
  let area = query.area;
  if (!city || !area)
    throw {
      message: "Invalid query parameters",
      status: 400,
    };
  let filter = { city, area, status: "approved" };

  const restaurants = await getOrSetCache(
    `restaurants-${city}-${area}`,
    async () => {
      try {
        const restaurants = await Restaurant.find(filter);
        return {
          status: 200,
          message: "Get Restaurants Successful!",
          data: restaurants,
        };
      } catch (error) {
        console.error(`${TAG} ERROR in getRestaurants() => ${error}`);
      }
    }
  );
  return restaurants;
};

const getRestaurantsCount = async () => {
  try {
    const [
      totalRestaurants,
      approvedRestaurants,
      suspendedRestaurants,
      rejectedRestaurants,
      inprogressRestaurants,
    ] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.find({ status: "approved" }).countDocuments(),
      Restaurant.find({ status: "suspended" }).countDocuments(),
      Restaurant.find({ status: "rejected" }).countDocuments(),
      Restaurant.find({ status: "inprogress" }).countDocuments(),
    ]);

    const monthlyRestaurants = await Restaurant.aggregate([
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
      const existingData = monthlyRestaurants.find(
        (item) => item.month === month
      );
      if (existingData) {
        return {
          month,
          restaurants: existingData.count,
        };
      } else {
        return { month, restaurants: 0 };
      }
    });

    return {
      status: 200,
      message: "Get Restaurants Count Successful!",
      data: {
        total: totalRestaurants,
        approved: approvedRestaurants,
        suspended: suspendedRestaurants,
        rejected: rejectedRestaurants,
        inprogress: inprogressRestaurants,
        monthlyRestaurants: mergedData,
      },
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getLocations() => ${error}`);
    throw error;
  }
};

const getAllRestaurants = async (query) => {
  const page = parseInt(query.page);
  const perPage = parseInt(query.perPage);
  const status = query.status;
  const rating = query.rating;
  const search = query.search;

  try {
    const filter = {};
    if (status) filter.status = status;
    if (rating) filter.rating = { $gte: rating, $lte: rating + 1 };
    if (search) {
      filter.name = { $regex: `^${search}`, $options: "i" };
    }

    const restaurants = await Restaurant.find(filter)
      .limit(perPage)
      .skip(perPage * (page - 1));

    const totalRestaurants = await Restaurant.countDocuments();

    return {
      status: 200,
      message: "Get Restaurants Successful!",
      data: restaurants,
      totalPages: Math.ceil(totalRestaurants / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getAllRestaurants() => ${error}`);
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
    };
  }
};

const getLocations = async () => {
  try {
    const citiesWithAreas = await getOrSetCache("citiesWithAreas", async () => {
      const citiesWithAreas = await Restaurant.aggregate([
        { $group: { _id: "$city", areas: { $addToSet: "$area" } } },
      ]);
      const citiesAndAreas = {};
      citiesWithAreas.forEach(({ _id, areas }) => {
        citiesAndAreas[_id] = areas;
      });
      return {
        status: 200,
        message: "Locations HIT!",
        data: citiesAndAreas,
      };
    });

    return citiesWithAreas;
  } catch (error) {
    console.error(`${TAG} ERROR in getLocations() => ${error}`);
    throw error;
  }
};

const getRestaurantById = async (id) => {
  if (!id)
    throw {
      message: "Id is not provided",
      status: 400,
    };
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const restaurant = await Restaurant.findById(ObjectId);
    return {
      status: 200,
      message: "Restaurant HIT!",
      data: restaurant,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantById() => ${error}`);
  }
};

const getRestaurantId = async (query) => {
  const email = query.email;
  if (!email)
    throw {
      message: "restaurant email is not provided",
      status: 400,
    };
  try {
    const restaurant = await Restaurant.findOne({ email });
    return {
      status: 200,
      message: "Restaurant HIT!",
      data: {
        id: restaurant._id,
      },
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantId() => ${error}`);
  }
};

const getMenu = async (id, query) => {
  if (!id)
    throw {
      message: "Id is not provided",
      status: 400,
    };
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const menu = await getAllFoodItems(ObjectId);
    return {
      status: 200,
      message: "menu HIT!",
      data: menu,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getMenu() => ${error}`);
  }
};

const updateRestaurant = async (req) => {
  const { city, area, address } = req.body;
  const id = req.params.id;
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const restaurant = await Restaurant.findById(ObjectId);
    if (!restaurant)
      throw {
        message: "Restaurant not found!",
        status: 404,
      };
    restaurant.city = city;
    restaurant.area = area;
    restaurant.address = address;
    await restaurant.save();
    return {
      status: 200,
      message: "Restaurant details updated",
      data: restaurant,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateRestaurant() => ${error}`);
  }
};

const updateRestaurantStatus = async (req) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    const ObjectId = dbUtils.stringToObjectId(id);
    const restaurant = await Restaurant.findById(ObjectId);
    if (!restaurant)
      throw {
        message: "Restaurant not found!",
        status: 404,
      };
    restaurant.status = status;
    await restaurant.save();
    return {
      status: 200,
      message: `Restaurant ${status} successfully!`,
      data: restaurant,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateRestaurantStatus() => ${error}`);
  }
};

const addImageDetails = async (data) => {
  const { imageUrl, imageId, restaurantId } = data;
  if (!imageUrl && !imageId && restaurantId)
    throw {
      message: "Image details not provided",
      status: 400,
    };
  try {
    const ObjectId = dbUtils.stringToObjectId(restaurantId);
    const restaurant = await Restaurant.findById(ObjectId);
    if (!restaurant)
      throw {
        message: "Restaurant not found!",
        status: 404,
      };
    restaurant.image = imageUrl;
    restaurant.imageId = imageId;
    await restaurant.save();
    return {
      status: 200,
      message: "Image details added successfully",
      data: restaurant,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in addImageDetails() => ${error}`);
  }
};

export {
  getRestaurants,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantId,
  getMenu,
  addImageDetails,
  getLocations,
  updateRestaurant,
  getRestaurantsCount,
  updateRestaurantStatus,
};
