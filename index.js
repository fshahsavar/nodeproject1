const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
// app.use(express.static("./public"))
const mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.99.100/nodetest', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("db connected");
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });

const userDb = mongoose.model('User', userSchema);

app.get('/userlist', (req, res) => {
    
    userDb.find(function (err, users) {
        if (err) return console.error(err);
        console.log(users);
        res.json(users);
      })
     
});

app.post("/authentication/register" , (req , res)=>{

    var username = req.body.username;
    const password = req.body.password;
    
    if(username == null)
    {
        res.send("username empty!");
        return;
    }

    if(password == null)
    {
        res.send("password empty!");
        return;
    }

    findUserByUsername(username , function(callback){
        console.log("sss" + callback);
        if(callback != null){
            res.send("Registered already")
            return;
        }
        const newUser = new userDb({username : username , password : password});
        newUser.save(function (err, newUser) {
               if (err) return console.error(err);
                  console.log("data saved");
                  res.send("Register user successfully")
                  return;
                });
    });

});

app.post("/authentication/login" , (req , res)=>{

    const username = req.body.username;
    const password = req.body.password;
    
    if(username == null)
    {
        res.send("username empty!");
        return;
    }

    if(password == null)
    {
        res.send("password empty!");
        return;
    }
  
    findUserByUsername(username , function(callback){
        console.log("aa" + callback)
        if(callback != null){
            if(callback.password == password){
                res.send("login successfully");
                return;
            }
            else
            {
                res.send("password incorrect");
                return;
            }
        }
        else
         res.send("user not registered");  
    })
   
});

app.listen(3000 ,()=>{
    console.log("server ready221!");
});

function findUserByUsername(username , callback){
    userDb.findOne({'username' : username} , (err, user)=>{
        if (err) return console.error(err);
        console.log(user);
        return callback(user);
     
        // res.json(users);

    }) 
}