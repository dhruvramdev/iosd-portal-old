import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';

export default class Token {
    constructor(user) {
        console.log(user);
        let secretKey = config.secretKey;
        this.token = jsonwebtoken.sign({
            id: user._id,
            name: user.name,
            isAdmin : user.isAdmin ,
            username: user.username ,
            post : user.post
        }, secretKey, {
            expiresIn: 60*60 * 24 * 7
        });
    }

    getToken() {
        return {
            token: this.token,
            expiresIn: jsonwebtoken.decode(this.token).exp
        };
    }
}
