let mysql = require("mysql");
let inquirer = require("inquirer");
let confirm = require("inquirer-confirm");
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bamazon_db"
});
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id: ${ connection.threadId }\n 
    This section is for Management purpose only!`);
    confirm({
        question: "Are you authorized?"
    }).then(getAuthorization, exitSection);
});
let getAuthorization = () => {
    let authCode = 0000;
    inquirer.prompt({
        type: Number,
        name: "auth",
        message: "Enter your authorization Code"
    }).then((answer) => {
        if (parseInt(answer.auth) === authCode) {
            console.log(`Welcome to Manager section!`);
        } else {
            console.log("Try again!");
            console.log(`You have ${i} left`);
            getAuthorization();
        };
    });
}
let exitSection = () => {
    console.log(`\n You are not authorized! Please try again after getting authorization\n`);
    process.exit();
}