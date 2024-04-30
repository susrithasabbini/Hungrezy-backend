import { adminService,imageUploadService } from "../services/index.js"

const TAG = 'controller.admin';


const getAdmins = async(req,res,next)=>{
    try{
        const result = await adminService.getAdmins();
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getAdmins() => ${error.message}`);
        next(error)
    }
}

const setActive = async(req,res,next)=>{
    try{
        const result = await adminService.setActive(req.params.id,req.body.active);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in setActive() => ${error.message}`);
        next(error)
    }
}

const shareAdminCredentials = async(req,res,next)=>{
    try{
        const result = await adminService.shareAdminCredentials(req.params.id);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in shareAdminCredentials() => ${error.message}`);
        next(error)
    }
}

const announce = async(req,res,next)=>{
    try{
        const result = await adminService.announce(req.body.announcement, req.body.to);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in announce() => ${error.message}`);
        next(error)
    }
}

const getAnnouncements = async(req,res,next)=>{
    try{
        const result = await adminService.getAnnouncements(req.body.to);
        res.status(result.status).send({
            status : result.status,
            message : result.message,
            data : result.data,
        })
    }catch(error){
        console.error(`${TAG} ERROR in getAnnouncements() => ${error.message}`);
        next(error)
    }
}


export {
    getAdmins,
    setActive,
    shareAdminCredentials,
    announce,
    getAnnouncements
}