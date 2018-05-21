import express from 'express';
import passport from 'passport';
import crypto from 'crypto' ;
import request from 'request' ;
import fs from 'fs' ;

import Book from '../models/book' ;
import Event from '../models/event' ;
import College from '../models/college' ;

import config from '../config/config' ;

let router = express.Router();

router.get('/login' , (req , res) => {
	res.render('login');
});

// router.get('/thanks' , (req , res) => {
//     res.render('feedback');
// });


router.post('/login' , passport.authenticate('local-login' , {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

router.post('/signup' , passport.authenticate('local-signup' , {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false
}));

router.get('/logout' , function (req,res) {
	if(req.isAuthenticated()){
		req.logOut();
		res.redirect('/login');
	}
});

router.get('/' , (req , res)=>{

	console.log("Coming at Home")
	if( req.isAuthenticated() ){
		console.log(req.user);
		let filenameexpected = `/media/${req.user.email}.png`;
		res.render('dashboard' , {
			user : req.user ,
			idcard : filenameexpected
		});

		
	}  else {
		res.redirect('/login')
	}
	
});

router.get('/blog-refresh' , isLoggedIn , (req , res)=>{

	request.get('https://api.rss2json.com/v1/api.json?rss_url=https://medium.jasonmdesign.com/feed' ,(error, response, body) => {
		console.log('Callback');
		if (!error && response.statusCode == 200) {
			// res.json(JSON.parse(body));
			body = JSON.parse(body);
			if(body.status === 'ok'){
				
				body.items.forEach(item => {

					let a = item.guid.split("/");
					a = a[a.length -1]
					console.log(a);
					item.guid = a;

				})
				// console.log(body)
				let data = JSON.stringify(body , null, 4);  
				fs.writeFileSync('feed.json', data);  
				res.send(body);

			} else {
				res.send("Could't Refresh the Feed");
			}

		} else {
			console.log(error);
			console.log(response);
			console.log(body);
			res.send('not ok');
		}
	});


	// res.render('blog' , {
	//     user : req.user ,
	//     title : 'Blog'
	// })
	
});

router.get('/blog/:guid' , isLoggedIn , (req,res) => {

	let rawdata = fs.readFileSync('feed.json');  
	let feed = JSON.parse(rawdata);  

	let guid = req.params.guid ;
	let selected  ;

	feed.items.forEach(item => {

		if(item.guid === guid){
			selected = item;
			return;
		}

	});
	
	res.render('post' , {
		title : "Blog" ,
		user : req.user ,
		post : selected
	}) 


})

router.get('/blog' , isLoggedIn , (req,res) => {

	let rawdata = fs.readFileSync('feed.json');  
	let feed = JSON.parse(rawdata);  
	
	res.render('blog' , {
		title : "Blog" ,
		user : req.user ,
		feed : feed
	}) 


})


router.get('/library' , isLoggedIn , (req,res)=>{

	console.log("Library");
	Book.find().then((data) => {

		console.log(data);


		let category = [];
		console.log('done');

		data.forEach((book) => {
			book.link = config.url + '/' + book.link ;
			console.log('book');
			if (category.indexOf(book.category) === -1) {
				category.push(book.category);
			}
		});
		console.log('done');

		res.render('library' , {
			user : req.user ,
			categories: category ,
			books : data ,
			title : "Library"
		})


	} , (err) => {

		console.log(err);
		res.send('Some Error Occoured');

	})



});

//TODO : Add Links in Per Events 
router.get('/events', isLoggedIn, function (req, res) {

    College.find().then(function (data) {
        res.render('events', {
            user: req.user ,
            title : "Events" ,
			colleges : data
        });
    }, function (err) {
        res.status(400).send(err);
    });


});


router.get('/getevents/:college', function (req, res) {
	let college = req.params.college;
	console.log(college);
	if (college === 'search') {
		College.find().then(function (data) {
			res.json(data);
		}, function (err) {
			res.status(400).send(err);
		});
	} else {
		Event.find({college: college}).then(function (data) {
			console.log('Found');
			console.log(typeof data[0], 'type');
			let di = {
				'college': college,
				'success': 1,
				'result': data
			};
			console.log('di', di);
				// console.log(JSON.stringigy(di , null ,4))
				res.json(di);
			}, function (err) {
				console.log('Error');
				res.status(400).send(err);
			})

	}
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	
	res.redirect('/login');
}

export default router;
