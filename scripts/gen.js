const fs = require('fs');
var Papa = require('papaparse');
import User from './../models/user' ;

var file = fs.readFileSync('./scripts/load.csv');

Papa.parse(file.toString(), { delimiter:',', header : true,
    complete: function(results) {
        // console.log(results);
        results.data.forEach(function(user) {

            // console.log(user);
            var newUser = new User();

            newUser.name = user.name ;

            if(!user.password || !user.username) {
               return ;
            }

            newUser.username = user.username ;
            newUser.password = user.password ;
            newUser.post = user.post ;

            console.log(newUser);
            newUser.save(function (err) {
                if (err)
                    console.log(err);

                console.log('Success');
            });
        });
    }
});

