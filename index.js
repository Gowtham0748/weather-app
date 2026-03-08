import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/",(req,res)=>{
    res.render("index.ejs",{
        weather:null,
        error:null,
    });
});


app.post("/submit", async(req,res)=>{
    const city = req.body.city;
    const apikey = process.env.OPENWEATHER_API_KEY;
    
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`);

        const result = response.data;

        res.render("index.ejs",{
            weather:{
                city : result.name,
                temperature: (result.main.temp - 273.15).toFixed(2),
                description: result.weather[0].description,
                humidity: result.main.humidity,
                wind: result.wind.speed
            },
            error:null
        });
    }catch(error){
        console.log("failed to make request:",error.message);
        res.render("index.ejs",{
            weather:null,
            error: "city not found",
        });
    }

});


app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});