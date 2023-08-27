import dotenv from "dotenv"
import fastify from "fastify";
import fastifyCors  from "@fastify/cors";
import fastifyIO from "fastify-socket.io";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN||"http://localhost:3000";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL

if (!UPSTASH_REDIS_REST_URL){
    console.error("missing UPSTASH_REDIS_REST_URL")
    process.exit(1)
}
// create an instance of fastify

async function buildServer(){
const app = fastify();
// server is up and responding 

//register cors plugin 

await app.register(fastifyCors,{
    origin: CORS_ORIGIN,
});

await app.register(fastifyIO)


//healtcheck
app.get(`/healthcheck`, ()=>{
    return {
        status:"ok",
        port:PORT,
    }
})
return app;
}

// starting the server

async function main(){
const app =  await buildServer ();
try {
    await app.listen({
        port:PORT,
        host:HOST,
    });
    console.log(`Server started at http://${HOST}:${PORT}`);
} catch (e) {
    console.error(e)
    process.exit(1)
    
}
}

main();