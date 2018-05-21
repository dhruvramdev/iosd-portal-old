import Notification from '../models/notification';
import constants from '../constants/constants';


let notificationController = {
    new : (req , res) => {
        console.log(req.body);

        let noti = new Notification({
            message : req.body.message ,
            date : req.body.date ,
            title : req.body.title,
            image : 'notifications/' + req.file.filename,
            epoch : req.body.epoch
        });

        noti.save().then(function(data){
            res.json({
                success : true ,
                data : data
            });
        } , function (err) {
            res.status(500).json({
                success:false
            })
        })
    } ,
    recent : (req  , res) => {
        let start = req.params.start ;
        let end = req.params.end ;

        Notification.find({}).sort('-epoch').exec(function (err , posts) {
            if(!err) {
                let query = posts.slice(start, end) ;
                console.log( query );
                res.json( query )

            }
        })

    }
};

export default notificationController;
