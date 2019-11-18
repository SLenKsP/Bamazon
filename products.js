let mysql = require("mysql");
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bamazon_db"
});
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id: ${ connection.threadId }\n`);
    getProductsInfo();
});
let getProductsInfo = () => {
    console.log("Displaying all products \n");
    connection.query("SELECT * FROM bamazon_db.products", (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {

            console.log(`${ res[ i ].item_id } | ${ res[ i ].product_name } | ${ res[ i ].department_name } | ${ res[ i ].price } | ${ res[ i ].stock_quantity }`);
        }
        console.log("-----------------------------------");

        connection.end();
    });
};

let inquirer = require("inquirer");
inquirer.prompt([{
        type: "text",
        name: "product_id",
        message: "Enter the product id of the item you would like to buy."
    },
    {
        type: "number",
        name: "quantity",
        message: "Enter the number of quantities you would like to buy"
    }
]);