import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment' ;

const UserSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: String ,
    email: {
        type: String,
        required: true
    } ,
    twitter: String,
    facebook: String,
    linkedin: String,
    college: String,
    phone: Number,
    picture: String ,
    isAdmin:Boolean,
    joinDate : { type:String , default :moment().format('DD-MM-YYYY') }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

export default mongoose.model('User', UserSchema);
