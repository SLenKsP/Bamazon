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
    console.log(`Connected as id: ${ connection.threadId }`);
    doSupervisorActivity();
});

let doSupervisorActivity = () => {
    console.log(`\nWelcome to suervisor console!\n Select activity:`);
    inquirer.prompt({
        type: "rawlist",
        name: "activity",
        choices: ["View Product Sales By Department", "Create New Department"],
        default: "View Product Sales By Department"
    }).then((answer) => {
        answer.activity === "View Product Sales By Department" ? viewProductSalesByDepartment() : createNewDepartMent();
    });
}
let viewProductSalesByDepartment = () => {
    console.log(`\nView product Sales: \n---------------------\n`);
    totalSalesByDepartment();

}
let createNewDepartment = () => {
    console.log(`\nAdd New Department: \n---------------------\n`);
    doAnotherActivity();
}

let doAnotherActivity = () => {
    confirm({
        question: "\nDo you want to perform another activity?\n"
    }).then(doSupervisorActivity, exitSection);
}
let exitSection = () => {
    console.log(`\n Have a nice Day!\n`);
    process.exit();
}
let totalSalesByDepartment = () => {
    connection.query(`SELECT department_name,
                    SUM(product_sales)
                    FROM products
                    GROUP BY department_name;`, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    setTimeout(doAnotherActivity,1000);
}