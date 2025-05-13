# 🌍 Flags Quiz Web App

A fun and educational web application that challenges users to identify countries based on their flags. This app uses a PostgreSQL database, Express.js, EJS templating, and CSV file integration for importing country data.

---

## 🚀 Features

- Displays random flags and asks users to identify the corresponding country
- Tracks score and resets on incorrect answers
- Dynamically loads and manages questions from a PostgreSQL database
- Simple and intuitive UI with loading animation
- Automatic CSV-to-database population at startup

---

## 🛠️ Technologies Used

- **Node.js** with **Express.js** – server-side logic and routing
- **PostgreSQL** – database for storing flag and country data
- **EJS** – templating engine to render dynamic content
- **CSV Parser** – to read and import data from `flags.csv`
- **dotenv** – for managing environment variables
- **body-parser** – for handling form submissions

---

## 🧠 Skills Demonstrated

- Connecting and querying a **PostgreSQL** database using the `pg` package
- Server-side rendering with **EJS**
- Parsing and importing data from a **CSV** file into a relational database
- Implementing game logic (score tracking, question pool handling)
- Handling POST requests and user inputs with **Express** middleware
- Using environment variables securely with `dotenv`

---
## ⚙️ How to Run This Project

1. **Clone the repository**
```bash
    git clone https://github.com/your-username/flags-quiz.git
    cd flags-quiz
```

2. **Install dependencies**
```bash
    npm install
```

3. **Create .env file**
    PG_USER=your_pg_username
    PG_HOST=localhost
    PG_DATABASE=your_database_name
    PG_PASSWORD=your_password
    PG_PORT=5432

4. **Create the flags table in PostgreSQL**
``` sql
    CREATE TABLE flags (
        id INT PRIMARY KEY,
        name TEXT,
        flag TEXT
    );

```









Application Logic – Flag Quiz
Data Handling:

Initialize totalScore to 0.

Initialize an empty array called availableQuestions.

Function: loadQuestions()

This function retrieves all question data from the database and populates the availableQuestions array.

It is used to refresh the question pool when all available questions have been answered.

Function: getRandomQuestion()

This function selects and returns a random question from the availableQuestions array.

If the array is empty (i.e., the user has answered all questions), it automatically calls loadQuestions() to repopulate the list.

Route: GET /

When the user accesses the root route, a random question is selected using getRandomQuestion().

The index.ejs view is rendered with the following data:

name of the country

flag (flag image or description)

id of the question

totalScore

Route: POST /submit

When the user submits an answer, the application retrieves:

answerInput (the user's input)

answerId (the ID of the current question)

Using the answerId, the corresponding question is fetched from the database.

The submitted answer is compared with the correct answer (e.g., the country's name):

If correct, totalScore is incremented by 1.

If incorrect, totalScore is reset to 0, and the question pool is refreshed by calling loadQuestions().

Regardless of the result, a new question is retrieved using getRandomQuestion() and passed to the index.ejs view, along with the updated totalScore.
( I used chatGpt to organize my thoughts because it is much more readable than my description in this(the data handling logic part).)
