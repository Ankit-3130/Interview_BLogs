const mongoose=require("mongoose");

const connecttomongo=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/InterviewProject", { useNewUrlParser: true });
}
connecttomongo();
// Models
require('./Category');
require('./Interview');