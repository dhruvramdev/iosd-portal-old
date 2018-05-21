import LocationHistory from '../models/location';
import Recent from '../models/recent';
import constants from '../constants/constants';

let updateRecent = (data) => {
    let query = {
        username : data.username
    };
    let update = {
        lat : data.lat ,
        lng : data.lng ,
        date : data.date ,
        time : data.time
    };

    if(data.dutyon){
        update.dutyon = data.dutyon
    }
    if(data.dutyoff){
        update.dutyoff = data.dutyoff
    }

    let options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Recent.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;

        console.log(`Recents Updated for User # ${data.username}`);
    });
};

let mainController = {

    bulk : (req,res) => {
        console.log(req.body);
        LocationHistory.findOne({
            'username' : req.decoded.username ,
            'date' :req.body.date
        }).then( function (data) {
            // console.log(data);
            if(!data){
                //New Record
                console.log('Making New Record');
                let record = new LocationHistory({
                    username: req.decoded.username,
                    date : req.body.date,
                    officer : req.decoded.id ,
                    track : req.body.track
                });
                record.save().then(function (data) {
                    let recent = data.track[data.track.length - 1 ];
                    updateRecent({
                        lat : recent.lat ,
                        lng : recent.lng ,
                        time : recent.time ,
                        username: req.decoded.username,
                        date : req.body.date ,
                    });
                    res.json({
                        success : true,
                        message : constants.LOCATION_UPDATED
                    })
                } , (err) => {
                    console.error(err);
                    res.json({
                        message : constants.LOCATION_ERROR
                    });
                })
            } else {
                console.log("Updating Record");
                data.track = data.track.concat( req.body.track  );
                // console.log(data);
                data.save().then(function (data) {
                    let recent = data.track[data.track.length - 1 ];
                    updateRecent({
                        lat : recent.lat ,
                        lng : recent.lng ,
                        time : recent.time ,
                        username: req.decoded.username,
                        date : req.body.date
                    });

                    console.log(data);

                    res.json({
                        success : true,
                        message : constants.LOCATION_UPDATED
                    });


                });

            }
        } , (err) => {
            console.error(err);
            res.json({
                message : constants.LOCATION_ERROR
            });
        })
    }
    ,
    update : (req , res) => {
        console.log(req.body);
        LocationHistory.findOne({
            'username' : req.decoded.username ,
            'date' :req.body.date
        }).then( function (data) {
            // console.log(data);
            if(!data){
                //New Record
                console.log('Making New Record');
                let record = new LocationHistory({
                    username: req.decoded.username,
                    date : req.body.date,
                    officer : req.decoded.id,
                    track : [{
                        lat : req.body.lat ,
                        lng : req.body.lng ,
                        time : req.body.time ,
                    }]
                });
                record.save().then(function (data) {
                    updateRecent({
                        lat : req.body.lat ,
                        lng : req.body.lng ,
                        time : req.body.time ,
                        username: req.decoded.username,
                        date : req.body.date
                    });
                    res.json({
                        success : true,
                        message : constants.LOCATION_UPDATED
                    })
                } , (err) => {
                    console.error(err);
                    res.json({
                        message : constants.LOCATION_ERROR
                    });
                })
            } else {
                console.log("Updating Record");
                data.track.push({
                    lat : req.body.lat ,
                    lng : req.body.lng ,
                    time : req.body.time ,
                });
                // console.log(data);
                data.save().then(function (data) {

                    updateRecent({
                        lat : req.body.lat ,
                        lng : req.body.lng ,
                        time : req.body.time ,
                        username: req.decoded.username,
                        date : req.body.date
                    });

                    console.log(data);

                    res.json({
                        success : true,
                        message : constants.LOCATION_UPDATED
                    });


                });

            }
        } , (err) => {
            console.error(err);
            res.json({
                message : constants.LOCATION_ERROR
            });
        })
    } ,
    duty : (req ,res) => {
        let event = req.params.event ;
        let json = {
            username: req.decoded.username,
            date : req.body.date,
            officer : req.decoded.id ,
            track : []
        };
        if(event === 'on'){
            json.dutyon = req.body.time
        } else if ( event === 'off' ) {
            json.dutyoff = req.body.time
        } else {
            res.json({
                success : false,
                message : "Time Not Present"
            });
            return;
        }

        LocationHistory.findOne({
            'username' : req.decoded.username ,
            'date' :req.body.date
        }).then( function (data) {
            // console.log(data);
            if(!data){
                //New Record
                console.log('Making New Record');
                let record = new LocationHistory(json);
                record.save().then(function (data) {
                    res.json({
                        success : true,
                        message : constants.DUTY_UPDATED
                    })
                } , (err) => {
                    console.error(err);
                    res.json({
                        message : constants.LOCATION_ERROR
                    });
                })
            } else {
                console.log("Updating Record");

                if(event === 'on'){
                    data.dutyon = req.body.time
                } else if ( event === 'off' ) {
                    data.dutyoff = req.body.time
                }

                updateRecent(json);

                data.save().then(function (data) {
                    res.json({
                        success : true,
                        message : constants.DUTY_UPDATED
                    });
                });

            }
        } , (err) => {
            console.error(err);
            res.json({
                message : constants.LOCATION_ERROR
            });
        })

    } ,
    recent : (req , res) => {
        Recent.find().then((data) => {
            res.json({
                success : true ,
                data : data
            });
        } , (err) => {
            res.json({
                message : constants.LOCATION_ERROR
            });
        })
    } ,
    history : (req , res) => {
        console.log(req.body)
        LocationHistory.findOne({
            username : req.body.username ,
            date : req.body.date
        }).then((data) => {
            console.log(data);
            if(data){
                res.json({
                    success : true ,
                    data : data
                })
            } else {
                res.json({
                    success : false ,
                    message : constants.HISTORY_NOT_FOUND
                })
            }

        })
    }
};

export default mainController;
