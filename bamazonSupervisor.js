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
    console.log(`\nWelcome to supervisor console!\n Select activity:`);
    inquirer.prompt({
        type: "rawlist",
        name: "activity",
        choices: ["View Product Sales By Department", "Create New Department"],
        default: "View Product Sales By Department"
    }).then((answer) => {
        switch (answer.activity) {
            case "View Product Sales By Department":
                viewProductSalesByDepartment();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            default:
                exitSection();
        }
    });
}
let viewProductSalesByDepartment = () => {
    console.log(`\nView product Sales: \n---------------------\n`);
    totalSalesByDepartment();

}
let department_id = [];
connection.query(`SELECT department_id FROM bamazon_db.departments`, (err, res) => {
    if (err) throw err;
    res.map(function (item) {
        department_id.push(item.department_id);
    });
})
let createNewDepartment = () => {
    console.log(`\nAdd New Department: \n---------------------\n`);
    inquirer.prompt({
        type: "number",
        name: "dept_id",
        message: "Enter the department number (000-999)"
    }).then((ans) => {
        if (department_id.includes(ans.dept_id)) {
            console.log(`\nDepartment ID already exists! Try another ID`);
            createNewDepartment();
        } else {
            inquirer.prompt([{
                type: "text",
                name: "dept_name",
                message: "Enter the department name"
            }, {
                type: "number",
                name: "over_head_cost",
                message: "Enter the over head cost"
            }]).then((answer) => {
                console.log(`You entered: \n-----------\n
                Department ID: ${ans.dept_id}\n
                Department Name: ${answer.dept_name}\n
                Over Head Cost: $${answer.over_head_cost}\n`);
                addDept(ans.dept_id, answer.dept_name, answer.over_head_cost);
                setTimeout(doAnotherActivity, 1000);
            });
        }
    });
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
    connection.query(`SELECT departments.*, SUM(products.product_sales) as sales, 
SUM(products.product_sales)-departments.over_head_cost as total_profit
FROM products
RIGHT JOIN departments ON products.department_name= departments.department_name
GROUP BY departments.department_id, departments.department_name, departments.over_head_cost;`, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    setTimeout(doAnotherActivity, 1000);
}
let addDept = (id, name, cost) => {
    connection.query(`INSERT INTO departments(department_id,department_name, over_head_cost)
    VALUES(${id },"${ name }",${ cost })`, (err, res) => {
        if (err) throw err;
        console.log(`Department Added Successfully!`);
    });
}