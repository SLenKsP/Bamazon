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
        res.map((item) => {
            console.log(`${ item.product_id } | ${ item.product_name } | ${ item.department_name } | ${ item.price } | ${ item.stock_quantity }`);
        })
        console.log("-----------------------------------");
        productPurchaseConfirmation();

    });
};

let displayProducts = () => {
    connection.query("SELECT product_id, product_name FROM bamazon_db.products", (err, res) => {
        if (err) throw err;
        res.map(function (item) {
            console.log(`${ item.product_id } | ${ item.product_name }`);
        });
        console.log("-----------------------------------");
    });
};
let productsWithId = [];
connection.query("SELECT product_id FROM bamazon_db.products", (err, res) => {
    if (err) throw err;
    res.map(function (item) {
        productsWithId.push(item.product_id);
    });
});
let inquirer = require("inquirer");
let confirm = require("inquirer-confirm");

function productPurchaseConfirmation() {
    confirm({
        question: "Would you like to purchase?",
        default: true
    }).then(purchaseProduct, declinePurchase);
};

function purchaseProduct() {
    console.log(`Yes, I would like to purchase`);
    requestedProductID();
};
let selectedProdId;
let selectedQuantity;
let availableQuantity;
let requestedProductID = () => {
    inquirer.prompt({
        type: "rawlist",
        name: "product_id",
        message: "Which product would you like to buy? Please pick from the list",
        choices: productsWithId,
        default: productsWithId[0]
    }).then((answer) => {
        selectedProdId = answer.product_id;
        console.log(`You selected : ${ answer.product_id }`);
        requestedQuantity();
        // return selectedProdId;
    });
};
let requestedQuantity = () => {
    inquirer.prompt([{
        type: "number",
        name: "quantity",
        message: "How many of these you would like to purchase?"
    }]).then((ans) => {
        selectedQuantity = ans.quantity;
        console.log(`The quantity you have requested is: ${ selectedQuantity }\n
            Please wait while we check the stock of product availability in the quantity you needed!`);
        checkAvailableQuantity();
        return selectedQuantity;
    });
};
let checkAvailableQuantity = () => {
    console.log(`Selected Prod ID: ${selectedProdId}`);
    connection.query(`SELECT stock_quantity FROM bamazon_db.products WHERE product_id = ${ selectedProdId }`, (err, res) => {
        if (err) throw err;
        availableQuantity = res[0].stock_quantity;
        console.log(`Available Quantity: ${ availableQuantity }`);
        if (selectedQuantity > availableQuantity) {
            console.log(`Sorry we do not have enough quantity you have requested`);
        } else {
            console.log(`Congrates, you OWN it!`);
            updatedQuantity = availableQuantity - selectedQuantity;
            connection.query(`UPDATE products
                 SET stock_quantity = ${updatedQuantity }
                 WHERE product_id = ${selectedProdId };
                 `);
        }
        return availableQuantity;
    });
};

function declinePurchase() {
    console.log(`No, some another time.`);
    confirm({
        question: "Are you sure?",
        default: false
    }).then(`Thanks for visiting website`, wantToPurchase);
};

function wantToPurchase() {
    console.log(`Actually, I changed my mind`);
    purchaseProduct();
};