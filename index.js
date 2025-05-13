import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";
import fs from "fs";
import csv from "csv-parser";


env.config(); // load the env files


const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const app = express();
const port = 3000;

db.connect();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


/* ---------Insert data in the csv file to the database------------ */

const countries = [];

fs.createReadStream("flags.csv")
    .pipe(csv())
    .on("data", (row) => {
        countries.push(row);
    })
    .on("end", async() => {
        //you can comment out this after doing it once .
        console.log("✅ All data collected!: ", countries);
        

        //countries =[
        //   { id: '1', name: 'Afghanistan', flag: '🇦🇫' },
        //   { id: '2', name: 'Aland Islands', flag: '🇦🇽' },
        //   { id: '3', name: 'Albania', flag: '🇦🇱' },
        //etc...

        /*insert the countries into the database*/
        for (const country of countries){
            const id = parseInt(country.id);
            const name = country.name;
            const flag = country.flag;

            try {
                await db.query("INSERT INTO flags (id, name, flag) VALUES ($1, $2, $3)",
                [id, name, flag]
            );
            } catch (error) {
                //you can comment out this after doing it once .
                console.error(`❌ Error inserting ${name}:`, error.message);
            }
            
        }
        
    })
    .on("error", (error) => {
        console.error("❌ Error: ", error);
    });


/* ----------Done inserting data into the database ----------------*/

/* ---------------Data handling----------------- */
let totalScore = 0;
let availableQuestions =[];

async function loadQuestions(){
    const results = await db.query("SELECT * FROM flags");
    availableQuestions = [...results.rows]
}

await loadQuestions()

function getRandomQuestion(){
    // if their are no questions
    if (availableQuestions.length === 0) {
        loadQuestions();
        totalScore = 0;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    availableQuestions.splice(randomIndex, 1);
    return question;

}


app.get("/", (req, res) => {
    const question = getRandomQuestion();
    res.render("index.ejs", {
        name: question.name,
        id: question.id,
        flag: question.flag,
        score: totalScore,
    });
});

app.post("/submit", async(req, res) => {
    const userAnswer = req.body.answerInput.trim().toLowerCase();
    const answerId = req.body.answerId;

    try {
        const result = await db.query("SELECT name FROM flags WHERE id = $1", [answerId]);

        if (result.rows.length === 0) {
            return res.sendStatus(404);
        }

        const correctAnswer = result.rows[0].name.toLowerCase();

        if (correctAnswer === userAnswer) {
            totalScore ++;

        } else {
            totalScore = 0;
            await loadQuestions(); // reset
        }

        const question = getRandomQuestion();
        res.render("index.ejs", {
            name: question.name,
            id: question.id,
            flag: question.flag,
            score: totalScore,
        });

    } catch (error) {
        res.sendStatus(500);
    }
})


app.listen(port, () => {
    console.log(`Server running in the port: ${port}`)
});