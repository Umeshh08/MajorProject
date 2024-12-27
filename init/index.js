const mongoose = require('mongoose');
const initdata =  require("./data.js");
const Listing = require('../models/listings.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB  = async()=>{
    await Listing.deleteMany();
    initdata.data = initdata.data.map((obj)=> ({...obj, owner: "6742d4376c021b378e97eddf"}));
    await Listing.insertMany(initdata.data); //initdata.data in written bc initdata is object and we accessed keys of that object which is data.

    console.log("data was initialized");
};

initDB();