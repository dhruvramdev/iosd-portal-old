import User from '../models/user';
import constants from '../constants/constants';


let searchController = {
    search : (req , res) => {
        let name = req.params.query ;
        User.find({'name': {$options:'i', $regex: name }}).select('name username').exec(function(err, data){
            if (err){
                console.log('err',err);
                return res.status(400).send({msg: "error"});
            } else {
                // console.log(data);
                return res.json(data);
                // or
                //return res.status(200).send(data);
            }
        });
    }
};

export default searchController;
