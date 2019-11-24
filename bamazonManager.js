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
    This section is for Management purpose only!\n`);
    confirm({
        question: "Are you authorized?\n"
    }).then(getAuthorization, exitSection);
    // doActivity();
});
let getAuthorization = () => {
    let authCode = 0000;
    inquirer.prompt({
        type: Number,
        name: "auth",
        message: "Enter your authorization Code\n"
    }).then((answer) => {
        if (parseInt(answer.auth) === authCode) {
            console.log(`Welcome to Manager section!`);
            doActivity();
        } else {
            getAuthorization();
        };
    });
}

let doActivity = () => {
    inquirer.prompt({
        type: "list",
        name: "activity",
        Message: "Please Select an Activity you would like to perform",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Nothing"],
        default: "View Products for Sale"
    }).then((choice) => {
        let selectedChoice = choice.activity;
        switch (selectedChoice) {
            case "View Products for Sale":
                viewProductForSale();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addtoInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                exitSection();
        }
    });
}
let doAnotherActivity = () => {
    confirm({
        question: "Would you like to perform another activity?"
    }).then(doActivity, exitSection);
}
let viewProductForSale = () => {
    console.log(`\nProducts for Sale: \n-------------------`);
    connection.query("SELECT * FROM bamazon_db.products", (err, res) => {
        if (err) throw err;
        console.table(res);
        setTimeout(doAnotherActivity, 2000);
    });
};
let viewLowInventory = () => {
    console.log(`\nLow inventory Products: \n-------------------`);
    connection.query("SELECT * from bamazon_db.products where stock_quantity <5", (err, res) => {
        if (err) throw err;
        console.table(res);
        setTimeout(doAnotherActivity, 2000);
    });

}
let productName = [];
connection.query("SELECT product_name FROM bamazon_db.products", (err, res) => {
    if (err) throw err;
    res.map(function (item) {
        productName.push(item.product_name);
    });
    // console.table(res);
});
let selectedProduct;
let addtoInventory = () => {
    console.log(`\nAdd stock to Product: \n---------------------`);
    inquirer.prompt({
        type: "rawlist",
        name: "Item",
        Message: "Select the product",
        choices: productName,
        default: productName[0]
    }).then((answer) => {
        selectedProduct = answer.Item;
        console.log(`You have selected ${ selectedProduct }`);
        howManyQuantity(selectedProduct);
    });
}
let addNewProduct = () => {
    console.log(`\nAdd New Product: \n-------------------`);
    inquirer.prompt([{
            type: "text",
            name: "product_name",
            message: "Enter the product"
        },
        {
            type: "number",
            name: "product_id",
            message: "Enter SKU (max:9 digits)"
        },
        {
            type: "text",
            name: "department",
            message: "Enter Department"
        },
        {
            type: "number",
            name: "price",
            message: "Enter unit cost"
        },
        {
            type: "number",
            name: "quantity",
            message: "Enter the stock quantity"
        }
    ]).then((ans) => {
        console.log(`Details for the new product: \n-----------------------------\n
        Product name: ${ans.product_name }\n
        SKU: ${ans.product_id }\n
        Department: ${ans.department }\n
        Unit cost: $${ans.price }\n
        Stock Quantity: ${ans.quantity }\n-------------------------------\n`);
        addProduct(ans.product_id, ans.product_name, ans.department, ans.price, ans.quantity);
        console.log(`Updated Product List: \n-----------------------\n`);
        viewProductForSale();

    })
};
let addProduct = (sku, name, dept, price, stock) => {
    connection.query(`INSERT INTO products(product_id,product_name,department_name,price,stock_quantity)
    value(${sku },"${ name }","${ dept }",${ price },${ stock})`)
}

let howManyQuantity = (product) => {
    let currentQuantity;
    connection.query(`SELECT stock_quantity FROM bamazon_db.products WHERE product_name= "${product }"`, (err, res) => {
        if (err) throw err;
        currentQuantity = parseInt(res[0].stock_quantity);
    });
    inquirer.prompt({
        type: "number",
        name: "quantity",
        message: "How many would you like to add to inventory?"
    }).then((ans) => {
        let totalQuantity = currentQuantity + ans.quantity;
        // console.log(typeof totalQuantity);
        connection.query(`UPDATE products
    SET stock_quantity = ${totalQuantity}
    WHERE product_name = "${product}";
    `);
        console.log(`\nAdded ${ ans.quantity } quantities successfully for ${ product }\n\nUpdated Product Info:\n-----------------------`);
        connection.query(`SELECT * FROM bamazon_db.products WHERE product_name = "${ product }"`, (err, res) => {
            if (err) throw err;
            console.table(res);
            doAnotherActivity();
        });
    });
}
let exitSection = () => {
    console.log(`\n Have a nice Day!\n`);
    process.exit();
}