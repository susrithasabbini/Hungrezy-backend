import { Menu } from "../models/index.js";
import Restaurant from "../models/Restaurant.js";

const TAG = "service.menu";

const getMenuById = async (id, query) => {
  try {
    const menu = await Menu.findOne({ _id: id });
    if (!menu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    if(query && query.availability){
      const availability = query.availability === 'true' ? true : false;
      const categories = Object.keys(menu._doc);
      categories.forEach(category => {
        const items = Object.keys(menu._doc[category]);
        items.forEach(item => {
          if(menu._doc[category][item].availability !== availability){
            delete menu._doc[category][item];
          }
        })
      })
    }

    return {
      status: 200,
      message: "Menu found",
      data: menu,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getMenuById() => ${error.message}`);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const addMenu = async (menu) => {
  const { category, name, price, veg_or_non_veg } = menu.menuItem;
  const { restaurantId } = menu;

  try {
    const checkRestaurant = await Restaurant.findOne({ _id: restaurantId });
    let menuId = checkRestaurant.menu_id;

    if (!menuId) {
      const newMenuData = {
        [category]: {
          [name]: { price, veg_or_non_veg, availability: true },
        },
      };
      const newMenu = await Menu.create(newMenuData);
      await Restaurant.findByIdAndUpdate(restaurantId, {
        menu_id: newMenu._id,
      });
      return {
        status: 201,
        message: "Menu added successfully",
        data: newMenu,
      };
    }

    const existingMenu = await Menu.findById(menuId);
    if (!existingMenu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    if (existingMenu[category] && existingMenu[category][name]) {
      return {
        status: 400,
        message: "Menu item already exists",
      };
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        $set: {
          [`${category}.${name}`]: { price, veg_or_non_veg, availability: true },
        },
      },
      { new: true }
    );

    return {
      status: 200,
      message: "Menu added successfully",
      data: updatedMenu,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in addMenu() => ${error.message}`);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const updateMenu = async (menu) => {
  const { category, name, price, veg_or_non_veg, available } = menu.menuItem;
  const { restaurantId } = menu;

  try {
    const checkRestaurant = await Restaurant.findOne({
      _id: restaurantId,
    });

    let menuId = checkRestaurant.menu_id;

    if (!menuId) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    const existingMenu = await Menu.findById(menuId);
    if (!existingMenu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    if (!existingMenu[category] || !existingMenu[category][name]) {
      return {
        status: 404,
        message: "Menu item not found",
      };
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        $set: {
          [`${category}.${name}`]: { price, veg_or_non_veg, availability: available},
        },
      },
      { new: true }
    );

    return {
      status: 200,
      message: "Menu updated successfully",
      data: updatedMenu,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in updateMenu() => ${error.message}`);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const deleteMenu = async (menu) => {
  const { category, name } = menu.menuItem;
  const { restaurantId } = menu;

  try {
    const checkRestaurant = await Restaurant.findOne({
      _id: restaurantId,
    });

    let menuId = checkRestaurant.menu_id;

    if (!menuId) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    const existingMenu = await Menu.findById(menuId);
    if (!existingMenu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    if (!existingMenu[category] || !existingMenu[category][name]) {
      return {
        status: 404,
        message: "Menu item not found",
      };
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        $unset: {
          [`${category}.${name}`]: "",
        },
      },
      { new: true }
    );
``
    return {
      status: 200,
      message: "Menu item deleted successfully",
      data: updatedMenu,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in deleteMenu() => ${error.message}`);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export { addMenu, updateMenu, getMenuById, deleteMenu };
