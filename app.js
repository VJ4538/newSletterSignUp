require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signUp.html")
});

app.post("/",(req,res)=>{
    let firstName=req.body.firstname;
    let lastName= req.body.lastname;
    let email= req.body.email;

    let datas ={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]  
    }
    let jsonData=JSON.stringify(datas);
    let url= process.env.url;
    let option={
        auth:process.env.AUTH_KEY,
        method:"POST"
    }

    const sent= https.request(url, option, function(response){
        if(response.statusCode===200){
        }
        response.on("data",function(data){
            let returndata=JSON.parse(data);
            if(returndata.error_count>0){
                res.send(`${returndata.errors.error}`);
            }else{
                res.sendFile(__dirname+"/success.html");
            }
        })
    })

    sent.write(jsonData);
    sent.end();
})


app.listen(process.env.PORT||3000,(req,res)=>{
    console.log("server running");
})
