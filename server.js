import { MongoClient, ObjectId } from 'mongodb'
import express from 'express';

const port = 3000;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static('public'));

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bookClub');
const membersCollection = db.collection('members');

app.get('/', async (req, res)=>{
    res.render('index');
})

app.get('/members', async(req, res)=>{
    const members = await membersCollection.find({}).toArray();
    res.render('members', { members })
})


app.get('/member/:id', async (req, res)=>{
    const temp = new ObjectId(req.params.id)
    const member = await membersCollection.findOne({_id:temp });
  if (member){
    res.render('member', { member });}
    console.log(member);
});

app.post('/member/:id', async (req, res)=>{
    await membersCollection.deleteOne({_id: new ObjectId(req.params.id)});
    res.redirect('/members');
})


//Lägg till datum via koden. ej form?
app.get('/members/form', async(req, res)=>{
    res.render('form');
})

app.post('/members/form', async (req, res)=>{
    await membersCollection.insertOne(req.body);
    res.redirect('/members');
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port} `)
})