import express from 'express';

import Book from '../models/book';
import Event from '../models/event';
import College from '../models/college';

import config from '../config/config' ;

import multer from 'multer' ;
let uploadbooks = multer({ dest: 'media/books' })

let router = express.Router();


router.get('/' , (req,res)=>{

    res.render('admin/index' , {
        user : req.user ,
        title : "Admin Panel"
    })

});

router.get('/library' , (req,res)=>{
    Book.find().then(function (data) {
        console.log(data);
        res.render('admin/library' , {
            user : req.user ,
            title : "Manage Library" ,
            books : data
        })

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});

router.get('/library/book/edit/:id' , (req,res)=>{

    let id = req.params.id ;
    Book.findOne({
        _id : id
    }).then(function (data) {
        console.log(data);
        data = data.toJSON();
        delete data._id ;
        delete data.__v ;

        res.render('admin/books/edit' , {
            user : req.user ,
            title : "Edit Book" ,
            book : data
        })

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});

router.post('/library/book/edit/:id' , (req,res)=>{

    let id = req.params.id ;
    Book.update({
        _id : id
    } , req.body ).then(function (data) {
        console.log(data);
        delete data._id ;
        delete data.__v ;

        res.json(data);

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});

router.get('/library/book/delete/:id' , (req,res)=>{

    let id = req.params.id ;
    Book.remove({
        _id : id 
    }).then(function (data) {
        console.log(data);
        res.json(data);

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});

router.get('/library/new' , (req,res)=>{

    res.render('admin/books/new' , {
        user : req.user ,
        title : "New Book"
    })

});

router.post('/library/new' , uploadbooks.single('file') , (req,res)=>{

    let book = new Book(req.body);
    console.log(req.file);
    
    if(req.file == undefined){
        res.send({'error' : 'Attach PDF'});
        return ;
    }

    if(req.file.mimetype != 'application/pdf'){
        res.send({'error' : 'Upload Only PDF Files'});
        return ;
    }

    // res.send(req.file);
    book.link = req.file.path ;

    book.save().then(function (data) {
        console.log(data);
        delete data._id ;
        delete data.__v ;

        res.json(data);

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});


router.get('/events' , (req,res) => {

    Event.find({}).then(function(events){
        College.find().then((colleges) => {
            
            console.log(JSON.stringify(events));
            res.render('admin/events' , {
                user : req.user ,
                events : events ,
                eventsstr : JSON.stringify(events) ,
                colleges : colleges,
                title : "Events Management"
            })

        })

    } , (err) => {
        console.log(err);
        res.send("Some Error Occured");
    });

    
});

router.post('/events' , (req , res)=> {

    let body = req.body ;
    console.log(body);

    let college = new College(body);
    college.save().then((data)=> {
        console.log(data)
        res.redirect('/admin/events');
    } , (err) => {
        console.err(err);
    })


})


router.get('/events/new' , (req,res) => {

    College.find().then((data)=> {
        console.log(data)
        res.render('admin/events/new' , {
            user : req.user ,
            title : "New Event" ,
            colleges : data ,
            classes : ["events-special" , "events-success"  , "events-info"  , "events-inverse"  , "events-warning"]
        })        

    } , (err)=>{
        console.log(err);
        res.send("Error")
    })

});

router.post('/events/new' , (req,res)=>{


    let b = req.body ;
    b.start = b.start + "000" ;
    b.end = b.end + "000" ;
    let event = new Event(b);

    event.save().then(function (data) {
        console.log(data);
        delete data._id ;
        delete data.__v ;

        res.json(data);

    }, function (err) {
        console.log('Err');
        res.send("Some Error Occured")
    });

});




export default router;
