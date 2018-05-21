import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config';
import constants from '../constants/constants';

export default (req, res, next) => {

  let token = req.body.token || req.param('token') || req.headers['authorization'];

  if(token) {
    jsonwebtoken.verify(token, config.secretKey, (err, decoded) => {
      if(err) {
        res.status(403).send({
          success: false,
          message: constants.AUTHENTICATION_FAILED
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: constants.NOT_TOKEN
    });
  }
};
