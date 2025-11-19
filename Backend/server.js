// ! npm i express mongoose dotenv nodemailer mutler bcryptjs cloudinary cors jsonwebtoken cookie-parser twilio express-async-handler

import app from "./app.js";
import { connectDB } from "./src/config/database.config.js";


connectDB().then(()=>{
    app.listen(process.env.PORT,(err)=>{
        if(err) {console.log(`Error while starting the server`); process.exit(1); }
        else{
            console.log(`Server running at PORT: ${process.env.PORT}`)
        }

    });
    
}).catch((err)=>{
    console.log(`Error while connecting to database`);
    console.log(err);
    process.exit(1);
});