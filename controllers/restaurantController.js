import { restaurantService,imageUploadService } from "../services/index.js"

const TAG = 'controller.restaurant';

const getRestaurants = async(req,res,next)=>{
    try{
        const result = await restaurantService.getRestaurants(req.query);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurants() => ${error.message}`);
        next(error)
    }
}

const getRestaurantsCount = async(req,res,next)=>{
    try{
        const result = await restaurantService.getRestaurantsCount();
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data: result.data
        })
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantsCount() => ${error.message}`);
        next(error)
    }
}

const getAllRestaurants = async(req,res,next)=>{
    try{
        const result = await restaurantService.getAllRestaurants(req.query);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getAllRestaurants() => ${error.message}`);
        next(error)
    }
}

const getLocations = async(req,res,next)=>{
    try{
        const result = await restaurantService.getLocations();
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getLocations() => ${error.message}`);
        next(error)
    }
}


const getRestaurantById = async(req,res,next)=>{
    try{
        const result = await restaurantService.getRestaurantById(req.params.id);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantById() => ${error.message}`);
        next(error)
    }
}

const getRestaurantId = async(req,res,next)=>{
    try{
        const result = await restaurantService.getRestaurantId(req.query);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantId() => ${error.message}`);
        next(error)
    }
}

const updateRestaurant = async(req,res,next)=>{
    try{
        const result = await restaurantService.updateRestaurant(req);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in updateRestaurant() => ${error.message}`);
        next(error)
    }
}

const updateRestaurantStatus = async(req,res,next)=>{
    try{
        const result = await restaurantService.updateRestaurantStatus(req);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in updateRestaurantStatus() => ${error.message}`);
        next(error)
    }
}


const getMenu = async(req,res,next)=>{
    try{
        const result = await restaurantService.getMenu(req.params.menu_id);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getMenu() => ${error.message}`);
        next(error)
    }
}

const uploadImage = async(req,res,next)=>{
    try{
        const result = await imageUploadService.uploadImage(req);
        const data = {
            imageUrl : result.data.secure_url,
            imageId : result.data.public_id,
            restaurantId : req.params.id
        }
        const restaurant = await restaurantService.addImageDetails(data);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : restaurant,
        })
    }catch(error){
        console.error(`${TAG} ERROR in uploadImage() => ${error.message}`);
        next(error)
    }
}


export {
    getRestaurants,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantId,
    updateRestaurant,
    getMenu,
    uploadImage,
    getLocations,
    getRestaurantsCount,
    updateRestaurantStatus
}