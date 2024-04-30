import { menuService } from "../services/index.js";

const TAG = "controller.menu";

const getMenuById = async (req, res, next) => {
  try {
    const result = await menuService.getMenuById(req.params.id, req.query);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getMenuById() => ${error.message}`);
    next(error);
  }
};

const addMenu = async (req, res, next) => {
  try {
    const result = await menuService.addMenu(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in addMenu() => ${error.message}`);
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const result = await menuService.updateMenu(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in updateMenu() => ${error.message}`);
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const result = await menuService.deleteMenu(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in deleteMenu() => ${error.message}`);
    next(error);
  }
};

export { addMenu, updateMenu, getMenuById, deleteMenu };
