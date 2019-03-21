var mysql = require("mysql");
var inquirer = require("inquirer");
// var myConnection = requier("./connection.js");
var colors = require("colors");
var table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nationcampbell",
    database: "bamazon_db"
});




connection.connect(function(err) {
    if(err) throw err;
    console.log("connection as id " + connection.threadId);
    inventory();
})
console.log(colors.yellow("TEST"));




function inventory() {
    connection.query("SELECT * FROM products;",
    function(err, res) {
        if(err) throw err;
        var table1 = new table([{
            head: ["ID", "PRODUCT", "DEPARTMENT", "PRICE", "STOCK"],
            colWidths: [100, 200, 200, 200, 200]
        }]);
        console.log(colors.green("\THESE ARE THE ITEMS WE HAVE FOR SALE\n"));
        console.log("\--------------------------------------\n");
        for(var i = 0; i < res.length; i++)
        {
            table1.push([
                res[i].item_id, res[i].product_name, res[i].department_name,
                 "$" + res[i].price, res[i].stock_quantity
            ]);
        }
        console.log(table1.toString());
        console.log(colors.blue("\--------------------------------------\n"));
        console.log(colors.blue("\--------------------------------------\n"));
        productToBuy();
    });
}


function productToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "pickItem",
            message: "Please select the ID of the product you want to buy?"
        },
        {
            type: "input",
            name: "itemAmount",
            message: "How many product would you like to buy?"
        }
    ])
    .then(function(answer) {
        console.log(answer);
        connection.query("SELECT * FROM product WHERE item_id=", answer.pickItem, function(err, res) {
            console.log(answer.pickItem);
            for(var i = 0; i < res.length; i++) {
                console.log(res);
                if(answer.itemAmount > res[i].stock_quantity) {
                    console.log(colors.red("\---------------------------\n"));
                    console.log("\---Insufficient quantity---\n");
                    console.log(colors.red("\---------------------------\n"));
                } else {
                    var stockUpdate = res[i].stock_quantity - answer.itemAmount;
                    console.log(stockUpdate);
                    console.log(colors.blue("TOTAL " + answer.pickItem * res[i].price));
                    console.log(colors.white("\---------------------------\n"));
                }
            }
        });
    });
}





