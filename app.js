const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
const fs = require('fs')
var session=require('express-session')
app.use(session({secret:'te data'}))

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )

app.use(bodyParser.urlencoded({ extended: false }))

if(process.env.PORT){
    app.listen(process.env.PORT,function(){console.log('Server started')});
  }
  else{
    app.listen(3000,function(){console.log('Server started on port 3000')});
  }

  
let loadUsers = function(){
    try {
        let bufferedData = fs.readFileSync('users.json')
        let dataString = bufferedData.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray
    } catch (error) {
        return []
    }
   
}
let addUsers=function(user={username,password})
{
    let x=loadUsers()
    x.push(user)
    fs.writeFileSync('users.json', JSON.stringify(x))
}


let editUserWatchList=function(user={username,movie})
{
    let x=loadUserWatchList()
    let l=[];
    let f;
    for(var i=0;i<x.length;i++)
    {
        if(x[i].user==user.username)
        {
           l=x[i].watchlist;
           
           f=false;
             for(var j=0;j<l.length;j++)
                {
                    
                    if(l[j]==user.movie)
                    f=true;    
                }
            if(!f){
                l.push(user.movie);
                x[i].watchlist=l;
            }
           
        }
        
    }
 
    fs.writeFileSync('watchlist.json', JSON.stringify(x))
    return(!f);
}

let createWatchlist=function(user={username,watchlist})
{
    let x=loadUserWatchList()
    x.push(user);
    fs.writeFileSync('watchlist.json', JSON.stringify(x));
}
   
let loadUserWatchList =function()
{
    try {
        let bufferedData = fs.readFileSync('watchlist.json')
        let dataString = bufferedData.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray
    } catch (error) {
        return []
    }
}

let getWatchList=function(username)
{
    let x=loadUserWatchList();
    for(var i=0; i<x.length;i++)
    {
        if(x[i].user==username)
        {
            return x[i].watchlist;
        }
    }
}
//handling GET requestsssss
app.get('/action', function(req,res){
    res.render('action');
})

app.get('/drama', function(req,res){
    res.render('drama');
})

app.get('/horror', function(req,res){
    res.render('horror');
})

app.get('/conjuring', function(req,res){
    res.render('conjuring',{msg:""});
})

app.get('/darkknight', function(req,res){
    res.render('darkknight',{msg:""});
})

app.get('/fightclub', function(req,res){
    res.render('fightclub',{msg:""});
})

app.get('/godfather', function(req,res){
    res.render('godfather',{msg:""});
})

app.get('/godfather2', function(req,res){
    res.render('godfather2',{msg:""});
})

app.get('/scream', function(req,res){
    res.render('scream',{msg:""});
})


app.get('/', function(req,res){
    res.render('login',{msg:""});
})


app.get('/registration',function(req,res){
    res.render('registration',{msg:""})
})

app.get('/watchlist', function(req,res){
    let myList=getWatchList(req.session.username);
    res.render('watchlist',{list:myList});
})


//handling POST requests
app.post('/register', function(req,res){
    let f=false
    let x=loadUsers()
    let u={username:req.body.username,password:req.body.password}
    if(req.body.username=="")
        res.render('registration',{msg:"Sorry, you entered an empty username"})

    else{
            if(req.body.password=="")
                res.render('registration',{msg:"Sorry, you entered an empty password"})
        else{
    for(var i=0;i<x.length;i++)
    {
        if(x[i].username==u.username)
        {
           //ERROR
           res.render('registration',{msg:"Sorry, this username is already taken"})
            f=true
        }
        
    }
    if(!f )
    {
        addUsers(u)
        let u1={user:u.username,watchlist:[]};
        createWatchlist(u1);
        res.redirect('/');
    
    }
    }

    
    
}
})

app.post('/',function(req,res){
    let f=false
    let x=loadUsers()
    let u={username:req.body.username,password:req.body.password}

    for(var i=0;i<x.length;i++)
    {
        if(x[i].username==u.username && x[i].password==u.password)
        {
            f=true
            req.session.username=req.body.username;
            res.render('home')
        }
    }
    if(!f)
        {
            res.render('login',{msg:"Sorry, wrong username or password"})
        }
})

app.post('/adddarkknight',function(req,res)
{
   
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"The Dark Knight"}) 
   if(added){
       res.render('darkknight',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('darkknight',{msg:"Movie is already in your Watchlist"});
   }
})

app.post('/addconjuring',function(req,res)
{
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"The Conjuring"}) 
   if(added){
       res.render('conjuring',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('conjuring',{msg:"Movie is already in your Watchlist"});
   }
})
app.post('/addfightclub',function(req,res)
{
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"Fight CLub"}) 
   if(added){
       res.render('fightclub',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('fightclub',{msg:"Movie is already in your Watchlist"});
   }
})
app.post('/addgodfather',function(req,res)
{
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"The God Father"}) 
   if(added){
       res.render('godfather',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('godfather',{msg:"Movie is already in your Watchlist"});
   }
})
app.post('/addgodfather2',function(req,res)
{
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"The God Father Part II"}) 
   if(added){
       res.render('godfather2',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('godfather2',{msg:"Movie is already in your Watchlist"});
   }
})


app.post('/addscream',function(req,res)
{
   let u= req.session.username;
   let added=editUserWatchList({username:u,movie:"Scream"}) 
   if(added){
       res.render('scream',{msg:"Movie Added Succesfully to your Watchlist"});
   }
   else
   {
    res.render('scream',{msg:"Movie is already in your Watchlist"});
   }
})

app.post('/search',function(req,res)
{
    let searchResult = []
    let inputString = ""
    let urlList=[]
    inputString = req.body.Search 
   let u= req.session.username; //not really needed
    if("godfather".includes(inputString)){
        searchResult.push("GodFather")
        urlList.push('https://salty-temple-54042.herokuapp.com/godfather');
    }
    if("godfather II".includes(inputString)){
        searchResult.push("The God Father II")
        urlList.push('https://salty-temple-54042.herokuapp.com/godfather2');

    }
    if("darkknight".includes(inputString) || "dark knight".includes(inputString)){
        searchResult.push("Dark Knight")
        urlList.push('https://salty-temple-54042.herokuapp.com/darkknight');
    }
    if("conjuring".includes(inputString)){
        searchResult.push("Conjuring")
        urlList.push('https://salty-temple-54042.herokuapp.com/conjuring');
    }
    if("fightclub".includes (inputString)){
        searchResult.push("FightClub")
        urlList.push('https://salty-temple-54042.herokuapp.com/fightclub');
    }
    if("scream".includes(inputString)){
        searchResult.push("Scream")
        urlList.push('https://salty-temple-54042.herokuapp.com/scream');
    }
    console.log(searchResult);
    res.render('searchresults',{searchResult,urlList})
   
})
