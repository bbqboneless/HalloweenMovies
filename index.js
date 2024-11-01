//supabase pw: Licea58Dominguez%
import { createClient } from "@supabase/supabase-js";
import express from "express";
import bodyParser from "body-parser";

// Replace with your Supabase project URL and public anon key
const supabaseUrl = 'https://vfonhrhytuqpfrybiaez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmb25ocmh5dHVxcGZyeWJpYWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1NjQ3MDMsImV4cCI6MjA0NTE0MDcwM30.iAexr_t1QidRrmHwwjkR7fGn5aGLi1ygDkhPgFu2GUc';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Function to fetch data
async function fetchData() {
  const { data, error } = await supabase
    .from('movies') // Replace with your table name
    .select('*'); // Selects all columns

    if(error){
        throw new Error(error.message);
    }

    return data;
}

//Function to get data
app.get("/", async (req, res)=>{
    try{
        const response = await fetchData();
        //console.log(response);
        res.render("index.ejs", {data : response});
    } catch(error) {
        console.error("Error:", error.message);
        res.render("index.ejs", {
          error: error,
        });
    }
});

//Function to post data
async function postData(movieName,creatorName,score,comments){
    const {data,error} = await supabase
    .from('movies')
    .insert([{
        name: movieName,
        created_by: creatorName,
        ranking: score,
        comments: comments
    }]);

    if(error){
        throw new Error(error.message);
    }

    return data;
}

//Function to delete data
async function deleteData(id){
    const {data,error} = await supabase
    .from('movies')
    .delete()
    .eq('id',id);

    if(error){
        throw new Error(error.message);
    }

    return data;
}

app.get("/new", async (req, res)=>{
    try{
        res.render("new_entry.ejs");
    }catch(error){
        console.log("Error on rendering new entry.")
    }
});

app.post("/new", async (req, res)=>{
    const { movie, creator, score, comments } = req.body;
    try{
        const insertedData = await postData(movie,creator,score,comments);
        console.log(insertedData);
        res.redirect("/");
    } catch(error){
        console.log("Error inserting data: ",error.message);
        res.render("index.ejs", {
            error: error,
        });
    }
});

app.post("/delete/:id", async(req,res) => {
    const id = req.params.id;
    
    try{
        await deleteData(id);
        console.log(`Deleted movie with id: ${id}`);
        res.redirect("/");
    } catch(error){
        console.log("Error deleting data: ",error.message);
        res.render("index.ejs", {
            error: error,
        });
    }
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});