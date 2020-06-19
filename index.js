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

var passwordHash = require('password-hash');

app.get('/userlist', (req, res) => {
    
    userDb.find(function (err, users) {
        if (err) return console.error(err);
        console.log(users);
        res.json(users);
      })
     
});

app.post("/authentication/register" , async(req , res)=>{

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

    const userOutput = await getUser(username);
        console.log("sss" + userOutput);
        if(userOutput != null){
            res.send("Registered already")
            return;
        }
        var hashedPassword = passwordHash.generate(password);
        const newUser = new userDb({username : username , password : hashedPassword});
        newUser.save(function (err, newUser) {
               if (err) return console.error(err);
                  console.log("data saved");
                  res.send("Register user successfully")
                  return;
                });
            });

app.post("/authentication/login" , async (req , res)=>{

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

    const userOutput = await getUser(username);
        if(userOutput != null){
          if(passwordHash.verify(password , userOutput.password)){
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
    });


app.listen(3000 ,()=>{
    console.log("server ready!");
});

let getUser = async (username) => {
    const userOutput = await userDb.findOne({
      username: username
    });
  
    return userOutput;
  };
