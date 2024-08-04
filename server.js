import express, { request, response } from "express";
import mongoose  from "mongoose"

const app = express();

app.use(express.json())

app.set('views', 'views');
app.set('view engine','ejs')

const port = process.env.port || 5000;

mongoose.connect(process.env.mongodb_uri)
.then((client)=>{
  const dbName = client.connection.name;
  const host = client.connection.host;
  console.log('connected to database',dbName,host)
}).catch((error)=>{
  console.error('error ',error)

  process.exit(1)
});


const rapperSchema = mongoose.Schema({
   rapperName:{
    type:String,
    required:true
   },
   bornName:{
    type:String,
    required:true
   },
   likes:{
    type:Number,
    default:0
   }
});


const rapperModel = mongoose.model('rapperModel',rapperSchema);






// post new rapper details
app.post('/rapper',async (request ,response)=>{
  try {
    const {rapperName , bornName , likes} = request.body;
    const newRapper = await new rapperModel({rapperName,bornName, likes});
    const savedRapper = await newRapper.save();
    response.status(201).json({message:'new rapper added successfully',savedRapper})


  } catch (error) {
    response.status(500).json({error:error.message})
  }
})

// get all rapper 

app.get('/',async (request , response)=>{
  try {
    const allRappers = await rapperModel.find({});
  
    response.render('index',{rappers:allRappers})
  } catch (error) {
    response.status(500).json({error:error.message})
  }
})

// update the rapper 

app.put('/rapper/:id',async (request , response)=>{
  const id = request.params.id;
  try {
    const updatedRapper = await rapperModel.findByIdAndUpdate(id,
      { $inc: {likes:1}}
      ,{new:true});


    response.status(200).json({message:'rapper updated successfully',updatedRapper})
  } catch (error) {
    response.status(500).json({error:error.message})
  }
})


// delete the rapper 

app.delete('/rapper/:id', async (request , response)=>{
  const {id} = request.params;
  try {
    const deleteRapper = await rapperModel.findByIdAndDelete(id);
    response.status(200).json({message:'rapper delete successfully'})
  } catch (error) {
    response.status(500).json({error:error.message})
  }
})


app.listen(port,()=>{
  console.log(`server started at http:localhost:${port}`)
})