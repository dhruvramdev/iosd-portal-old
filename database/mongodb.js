import mongoose from 'mongoose';
import config from '../config/config';
import constants from '../constants/constants';

let mongodb = {
  getConnection: () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(config.database, function(err) {
        if(err) {
          reject(err);
        } else {
          resolve(constants.DB_CONNECTED);
        }
      });
    })
  }
}

export default mongodb;
