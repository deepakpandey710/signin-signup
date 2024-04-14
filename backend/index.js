const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/UserRoutes");
const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/signin-signup')
.then(() => console.log("Database connected"));
// mongoose.connect('mongodb+srv://deepakpandey7100:tk3Vaq6BVgbi0EiZ@cluster0.ldvrfga.mongodb.net/dataNeuron?retryWrites=true&w=majority&appName=Cluster0')
// .then(() => console.log("Database connected"));
app.use('/api/user', userRoutes);
app.get('/',(req,res)=>{res.send('hello')});
app.listen(5000, ()=>{
    console.log("Server started at port 5000")}
)
