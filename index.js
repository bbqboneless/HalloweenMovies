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

app.post("/", async (req, res)=>{
    const selectedItem = req.body.item;
    console.log(selectedItem);
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});