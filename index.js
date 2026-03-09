import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import https from "https";

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
    //console.log("API KEY:", apikey);
    try{
        const httpsAgent = new https.Agent({ family: 4 });
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`,
            { httpsAgent }
        );

        const result = response.data;

        res.render("index.ejs",{
            weather:{
                city : result.name,
                temperature: result.main.temp,
                description: result.weather[0].description,
                humidity: result.main.humidity,
                wind: result.wind.speed,
                icon:result.weather[0].icon,
            },
            error:null
        });
        }catch(error){
            if (error.response) {
            console.log("API RESPONSE ERROR:", error.response.data);
            } 
            else if (error.request) {
                console.log("NO RESPONSE FROM API:", error.request);
            } 
            else {
                console.log("ERROR:", error.message);
            }

            res.render("index.ejs", {
                weather: null,
                error: "City not found or API request failed"
            });

    }

});


app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});