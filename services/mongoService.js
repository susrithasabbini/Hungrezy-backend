import { getMenuCollection } from "../db/mongoClient.js";


const getAllFoodItems = async (menuId) => {
    try {
        const Menu = await getMenuCollection();
        const menu = await Menu.findOne({ _id: menuId })
        return menu;
    } catch (error) {
        console.error("Error getting all food items:", error);
        return [];
    }
};

export {
    getAllFoodItems,
}