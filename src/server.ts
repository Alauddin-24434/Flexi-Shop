import app from "./app";
import config from "./app/config";



async function serverStart() {

    try {
        
    app.listen(config.PORT, ()=>{
        console.log(`Flexi Shop server on port: ${config.PORT}` )
      })

    } catch (error) {
        console.error(error || "Seomething went wrong server")
    }
    
}

 
serverStart();