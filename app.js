//jshint esversion: 6

const express = require("express")
const bodyParser  = require("body-parser")
const request = require("request")
const https = require("https")

const app = express();

app.use(express.static("public"));//We used {express.static} because when we tend to bring
//a local/static file online i.e localhost:{port} it does't recognize the files that are within the local
//storage of stylesheets i.e {.css} or other preliminary hence we in the following had to Name
//the express.static with the incubation of "public" folder by which we can allow
//local/static stylesheets and other files to be able to come online.

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname  + "/signup.html");
});

app.post("/", function(req,res){

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;


const data = { //code snippets being taken from "mailchimp" api section to create
  //for {members} mailing
  members: [ {
    email_address: email,
    status: "subscribed",
    merge_fields: { //The {merge_fields} is shown to be an object
      FNAME:  firstName,
      LNAME:  lastName

    }
  }

  ]

};

const jsonData  = JSON.stringify(data);//For a flat string JSON of the data. this is what
//MailChimp will read so this will be sent to it.

const url = "https://us14.api.mailchimp.com/3.0/lists/{List Id}";//List Id Number;In the
//url the "usX" where the "X" needs to be replaced the the End "us" value of your API Key
//Furthur explaining is available on (https://mailchimp.com/developer/marketing/docs/fundamentals/)
//And i will provide the specific article image block in the repo.
const options = {

method: "POST",
auth: "{username}:{API Key}"//This is a basic
//http authentication procedure where the format is as follows: {username:password}
//where the username could be anything but the password should be your API Key.

}

const request = https.request(url,  options,function(response){
//Since being {within app.post()} we will create the {url} and {options}
//above this statement.Also we need to create {const request} for two reasons
//"request" for avoiding conflicts with the "req" and it will be "const"
//for ease in furthur usage using {request.write} over to the server.

if (response.statusCode === 200) {
  res.sendFile(__dirname + "/success.html")
}
else{
    res.sendFile(__dirname + "/failure.html")
}

response.on("data",function(data){
  console.log(JSON.parse(data));
})



})

request.write(jsonData);
request.end();

});

app.listen(process.env.PORT || 3000,function(){//By using {process.env.PORT}
  //we can deploy our application to Heroku since it'll be using its own system
  //we cannot always enter the {Port} by ourselves.But you can OR it to work locally on port 3000.
  // console.log("Server is running on port 3000");

});

//We will be using MailChimp to Sign up and retrieve an API Key and List Id
//List Id is created for adding an audience or a single user
