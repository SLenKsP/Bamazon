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
    -- -- -- -- --Thanks For visiting "BAMAZON' ----------\n`);
    // confirm({
    //     question: "Would you like to see some of our fast selling products?",
    //     default: true
    // }).then(getProductsInfo, exitStore);
    getProductsInfo();
});

let getProductsInfo = () => {
    console.log("\n Displaying Fast Selling products \n");
    connection.query("SELECT * FROM bamazon_db.products", (err, res) => {
        if (err) throw err;
        // res.map((item) => {
        //     console.table(`${ item.product_id } | ${ item.product_name } | ${ item.department_name } | $ ${ item.price } | ${ item.stock_quantity }`);
        // });
        console.table(res);

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
let selectedProdId;
let selectedProdName;
let selectedQuantity;
let availableQuantity;
let productSaleBeforeSelling;
let updatedSaleTotal;
let productPrice;
let productsWithId = [];
connection.query("SELECT product_id FROM bamazon_db.products", (err, res) => {
    if (err) throw err;
    res.map(function (item) {
        productsWithId.push(item.product_id);
    });

});
let productsWithName = [];
connection.query("SELECT product_name FROM bamazon_db.products", (err, res) => {
    if (err) throw err;
    res.map(function (item) {
        productsWithName.push(item.product_name);
    });
});

function productPurchaseConfirmation() {
    confirm({
        question: "\n Would you like to purchase?",
        default: true
    }).then(purchaseProduct, declinePurchase);
};

function purchaseProduct() {
    console.log(`\n Yes, I would like to purchase \n`);
    requestedProductID();
};

let requestedProductID = () => {
    inquirer.prompt({
        type: "rawlist",
        name: "product_id",
        message: "Which product would you like to buy? Please pick from the list",
        choices: productsWithId,
        default: productsWithId[0]
    }).then((answer) => {
        selectedProdId = answer.product_id;
        // console.log(`You selected : ${ answer.product_id }`);
        getSelectedProductInfo(selectedProdId);

        return selectedProdId;
    });
};
let requestedQuantity = () => {
    inquirer.prompt([{
        type: "number",
        name: "quantity",
        message: "How many of these you would like to purchase?\n "
    }]).then((ans) => {
        selectedQuantity = ans.quantity;
        console.log(`The quantity you have requested is: ${ selectedQuantity }\n
            Please wait while we check the stock of product availability in the quantity you needed!`);
        setTimeout(checkAvailableQuantity, 2000);
        return selectedQuantity;
    });
};
let checkAvailableQuantity = () => {
    // console.log(`Selected Prod ID: ${selectedProdId}`);
    connection.query(`SELECT stock_quantity FROM bamazon_db.products WHERE product_id = ${ selectedProdId }`, (err, res) => {
        if (err) throw err;
        availableQuantity = res[0].stock_quantity;
        console.log(`\nAvailable Quantity: ${ availableQuantity }\n`);
        if (selectedQuantity > availableQuantity) {
            console.log(`Insufficient quantity of ${ selectedProdName } !`);
            confirm({
                question: `\nWould you like to purchase another product?`
            }).then(purchaseProduct, exitStore)
        } else {
            console.log(`We have enough quantity!\n`);
            confirm({
                question: "\nWould you like to go ahead with the purchase?",
            }).then(checkout, exitStore);
        };
        return availableQuantity;
    });
};


async function getSelectedProductInfo(prodID) {
    connection.query(`SELECT product_name, price, product_sales, product_id FROM bamazon_db.products
    WHERE product_id = ${prodID }`, (err, res) => {
        if (err) throw err;
        selectedProdName = res[0].product_name;
        productPrice = res[0].price;
        productSaleBeforeSelling = res[0].product_sales;
        console.log(`\n
            Product Name: ${selectedProdName } \n
            Product SKU: ${res[0].product_id } \n
            Price: $${productPrice };
            `);
    });
    setTimeout(requestedQuantity, 1000);
};
let productSaleTotal;
let totalPrice = (price, quantity) => {
    productSaleTotal = parseFloat(price * quantity).toFixed(2);
    return productSaleTotal;
};
let checkout = () => {
    console.log(`\n Your Order information : \n
    Product Name: ${selectedProdName } \n
    Product SKU: ${selectedProdId } \n
    Item Price: $${productPrice }\n
    -----------------------------\n
    Total: $${totalPrice(productPrice, selectedQuantity) } ($${ productPrice } * ${ selectedQuantity })\n
    -----------------------------\n`);
    confirm({
        question: "\n Place Order?"
    }).then(placeOrder, exitStore);
};
let placeOrder = () => {
    console.log(`\n Your order has been placed! Thank you for shopping with us!\n `);
    updatedQuantity = availableQuantity - selectedQuantity;
    updatedSaleTotal = parseFloat(productSaleBeforeSelling) + parseFloat(productSaleTotal);
    connection.query(`UPDATE products
                 SET stock_quantity = ${updatedQuantity },
                 product_sales = ${parseFloat(updatedSaleTotal)}
                 WHERE product_id = ${selectedProdId };
                 `);
    process.exit();
};

function declinePurchase() {
    console.log(`\n No, some another time.\n `);
    confirm({
        question: "\n Are you sure?",
        default: false
    }).then(exitStore, wantToPurchase);
};

function wantToPurchase() {
    console.log(`Actually, I changed my mind`);
    purchaseProduct();
};
let exitStore = () => {
    console.log(`\nThanks for visiting Bamazon!\n`);
    process.exit();
}