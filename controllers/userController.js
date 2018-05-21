import User from '../models/user';
import Token from '../common/token';
import constants from '../constants/constants';

let userController = {
    signup: (req, res) => {
        let user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            post: req.body.post
        });

        let token = new Token(user).getToken();
        user.save((err) => {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: constants.CREATED_USER,
                token: token
            });
        });
    },

    login: (req, res) => {
        console.log(req.body)
        User.findOne({
            username: req.body.username
        }).select('name username password isAdmin').exec((err, user) => {
            console.log(err , user , 'dhruv');
            if (err) {
                // console.error(err);
                throw err;
            }
            if (!user) {
                res.send({message: constants.USER_NOT_EXITS});
            } else {
                let validPassword = user.comparePassword(req.body.password);
                console.log(validPassword);
                if (!validPassword) {
                    res.send({message: constants.INVALID_PASS});
                } else {
                    let token = new Token(user).getToken();
                    res.json({
                        success: true,
                        message: constants.LOGIN_SUCCESS,
                        token: token
                    });
                }
            }
        });
    }
};

export default userController;
