import { orderService } from "../services/index.js";

const TAG = 'controller.order'


const placeOrder = async(req,res,next)=>{
    try{
        const result = await orderService.placeOrder(req.body)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in placeOrder() => ${error}`);
        next(error)
    }
}

const getOrder = async(req,res,next)=>{
    try{
        const result = await orderService.getOrder(req)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getOrder() => ${error}`);
        next(error)
    }
}

const updateOrderStatus = async(req,res,next)=>{
    console.log(req.body)
    try{
        const result = await orderService.updateOrderStatus(req.params.orderId,req.body.status)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in updateOrderStatus() => ${error}`);
        next(error)
    }
}

const getUserOrders = async(req,res,next)=>{
    const user_id = req.params.user_id;
    const status = req.query.status;
    try{
        const result = await orderService.getUserOrders(user_id,status)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getUserOrders() => ${error}`);
        next(error)
    }
}

const cancelUserOrder = async(req,res,next)=>{
    const orderId = req.params.orderId;
    try{
        const result = await orderService.cancelUserOrder(orderId)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in cancelUserOrder() => ${error}`);
        next(error)
    }
}

const getRestaurantOrders = async(req,res,next)=>{
    const restaurant_id = req.params.restaurant_id;
    const status = req.query.status;
    const customerId = req.query.customerId;
    try{
        const result = await orderService.getRestaurantOrders(restaurant_id,status,customerId)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantOrders() => ${error}`);
        next(error)
    }
}

const getRestaurantOrderStats = async(req,res,next)=>{
    const restaurant_id = req.params.restaurant_id;
    try{
        const result = await orderService.getRestaurantOrderStats(restaurant_id)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantOrderStats() => ${error}`);
        next(error)
    }
}

const getRestaurantOrderStatsWithFilters = async(req,res,next)=>{
    try{
        const result = await orderService.getRestaurantOrderStatsWithFilters(req)
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getRestaurantOrderStatsWithFilters() => ${error}`);
        next(error)
    }
}

const getOrderCount = async(req,res,next)=>{
    try{
        const result = await orderService.getOrderCount()
        res.status(result.status).send(result)
    }catch(error){
        console.error(`${TAG} ERROR in getOrderCount() => ${error}`);
        next(error)
    }
}

export {
    placeOrder,
    getUserOrders,
    getRestaurantOrders,
    getOrder,
    updateOrderStatus,
    getRestaurantOrderStats,
    cancelUserOrder,
    getRestaurantOrderStatsWithFilters,
    getOrderCount
}