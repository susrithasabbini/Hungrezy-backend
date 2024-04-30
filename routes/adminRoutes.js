import express from 'express'
import { isAuthenticated } from '../middleware/authenticationMiddleware.js';
import { multerUploads } from '../middleware/multerMiddleware.js';
import {adminController} from '../controllers/index.js';
import { isUser } from '../middleware/permissionsMiddleware.js';


const initAdminRoutes = ()=>{
    const adminRoutes = express.Router();
    //adminRoutes.route('/:id/upload/image').post(isAuthenticated,isUser,multerUploads,userController.uploadImage)
    adminRoutes.route('/all').get(adminController.getAdmins)
    adminRoutes.route('/:id/status').post(adminController.setActive)
    adminRoutes.route('/:id/share-credentials').post(adminController.shareAdminCredentials)
    adminRoutes.route('/announce').post(adminController.announce)
    adminRoutes.route("/announcements").post(adminController.getAnnouncements)
    return adminRoutes;
  }
  
  
  
  export default initAdminRoutes;