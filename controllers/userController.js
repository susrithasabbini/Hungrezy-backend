import { userService, imageUploadService } from "../services/index.js";

const TAG = "controller.user";

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getUsers() => ${error.message}`);
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const result = await imageUploadService.uploadImage(req);
    const data = {
      imageUrl: result.data.secure_url,
      imageId: result.data.public_id,
      userId: req.params.id,
    };
    const token = await userService.addImageDetails(data);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: token,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in uploadImage() => ${error.message}`);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getAllUsers() => ${error.message}`);
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const result = await userService.getUserDetails(req.params.id);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getUserDetails() => ${error.message}`);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in updateUser() => ${error.message}`);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in deleteUser() => ${error.message}`);
    next(error);
  }
}

const updateCustomerStatus = async (req, res, next) => {
  try {
    const result = await userService.updateCustomerStatus(req);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in updateCustomerStatus() => ${error.message}`);
    next(error);
  }
};

const getCustomerCount = async (req, res, next) => {
  try {
    const result = await userService.getCustomerCount();
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getCustomerCount() => ${error.message}`);
    next(error);
  }
};

export {
  uploadImage,
  getAllUsers,
  getUserDetails,
  updateCustomerStatus,
  getCustomerCount,
  getUsers,
  updateUser,
  deleteUser,
};
