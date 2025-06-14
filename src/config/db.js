import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });

const {Pool} = pkg;

//connecting database 
const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT,
});


pool.on("connect", () =>{
    console.log(`Database connected`);
});

export default pool;