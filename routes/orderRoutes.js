import express from 'express'
import { orderController } from '../controllers/index.js'
import * as validations from '../middleware/validations/orderValidations.js'
import { isAuthenticated } from '../middleware/authenticationMiddleware.js'
import { isUser ,isRestaurant} from '../middleware/permissionsMiddleware.js'

const initOrderRoutes = ()=>{
    const orderRoutes = express.Router()

    orderRoutes.route('/place').post(isAuthenticated,isUser,validations.placeOrder,orderController.placeOrder)
    orderRoutes.route('/count').get(orderController.getOrderCount)
    orderRoutes.route('/:orderId').get(isAuthenticated,orderController.getOrder)
    orderRoutes.route('/status/:orderId').post(isAuthenticated,isRestaurant,validations.updateOrderStatus,orderController.updateOrderStatus)
    orderRoutes.route('/user/:user_id').get(orderController.getUserOrders)
    orderRoutes.route('/user/cancel/:orderId').post(isAuthenticated,isUser,orderController.cancelUserOrder)
    orderRoutes.route('/restaurant/:restaurant_id').get(isAuthenticated,isRestaurant,orderController.getRestaurantOrders)
    orderRoutes.route('/restaurant/stats/:restaurant_id').get(isAuthenticated,isRestaurant,orderController.getRestaurantOrderStats)
    orderRoutes.route('/restaurant/stats/filters/:restaurant_id').get(isAuthenticated,isRestaurant,orderController.getRestaurantOrderStatsWithFilters)

    return orderRoutes
}


export default initOrderRoutes