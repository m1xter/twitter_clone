import Notification from "../models/notificatio.model.js";

export const getNotifications = async (req,res)=>{
try {
    const userId = req.user._id;
    const notifications = await Notification.find({to:userId})
    .populate({
        path:"from",
        select:"username profileImg",
    })


    await Notification.updateMany({to:userId},{read:true});
    res.status(200).json(notifications);

} catch (error) {
    console.log("error in getNotifications:",error.message);
    res.status(500).json({error: error.message});
}
}


export const delelteNotifications = async (req,res)=>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Notification deleted succesfully"});
    } catch (error) {
        console.log("error in delelteNotifications:",error.message);
        res.status(500).json({error: error.message});
    }
}

/*export const delelteNotification = async (req,res)=>{
    try {
        const notificationid = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findById(notificationid);
        if(!notification) return res.status(404).json({error:"notification not found"});

        if (notification.to.toString() !== userId.toString() ){
            return res.status(403).json({error:"you are not allowed to delete this"});
        }

        await Notification.findByIdAndDelete(notificationid);
        res.status(200).json({message:"notification deleted succesfully"});

    } catch (error) {
        console.log("error in delelteNotifications:",error.message);
        res.status(500).json({error: error.message});
    }
}*/
