import express from 'express';
let router = express.Router();

import mainRoutes from './main';
import adminRoutes from './admin' ;

router.use('/', mainRoutes);
router.use('/admin' , isAdmin , adminRoutes)


function isAdmin(req, res, next) {
    if (req.user) {
    	if(req.user.isAdmin)
        	return next();
    }
    res.redirect('/');
}


export default router;
