require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));
app.set("view engine", 'ejs');


app.get("/",(req,res)=>{
    res.render("./pages/index");
});

app.post("/",(req,res)=>{
    let Name=req.body.name;
    let email= req.body.email;
    

    let datas ={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:Name
                }
            }
        ]  
    }


    let jsonData=JSON.stringify(datas);
    console.log(jsonData);
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
                res.render("./pages/fail",{error:returndata.errors[0].error_code});
            }else{
                res.render("./pages/sucess");
            }
        })
    })

    sent.write(jsonData);
    sent.end();
})


app.listen(process.env.PORT||3000,(req,res)=>{
    console.log("server running");
})
