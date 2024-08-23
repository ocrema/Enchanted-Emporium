// ----------------------------------------------
// TCSS 460: Summer 2024
// Backend REST Service Module
// ----------------------------------------------
// Express is a Node.js web application framework
// that provides a wide range of APIs and methods
// Express API Reference:
// https://expressjs.com/en/resources/middleware/cors.html

// ----------------------------------------------
// retrieve necessary files (express and cors)
const express = require("express")
const cors = require("cors")
// retrieve the MySQL DB Configuration Module
const dbConnection = require("./config")
// use this library for parsing HTTP body requests
var bodyParser = require('body-parser');


// ----------------------------------------------
// (A)  Create an express application instance
//      and parses incoming requests with JSON
//      payloads
// ----------------------------------------------
var app = express(express.json); 

// ----------------------------------------------
// (B)  Use the epxress cors middleware
//      Cross-origin resource sharing (CORS)
//      is a technique that restricts specified
//      resources within web page to be accessed
//      from other domains on which the origin
//      resource was initiated the HTTP request
//      Also use the bodyParser to parse in 
//      format the body of HTTP Requests
// ----------------------------------------------
app.use(cors());
app.use(bodyParser.json());

// ----------------------------------------------
// Ref: https://expressjs.com/en/4x/api.html#app
// (C)  Create a server such that it binds and
//      listens on a specified host and port.
//      We will use default host and port 3000.
app.listen(2000, () => {
    console.log("Express server is running and listening");
}); 

// get items for search page
app.get('/search/:order/:offset', (request, response) => {
    const order = request.params.order;
    const offset = request.params.offset;
    const getOrder = function(o) {
        switch (o) {
            case 'rating': return 'avgrating DESC';
            case 'highestprice': return 'p.Price DESC';
            case 'lowestprice': return 'p.Price';
        }
    }
    const sqlQuery = `
    SELECT 
        p.productid AS id,
        p.Name AS name, 
        COALESCE(AVG(r.Rating), 0) AS avgrating, 
        p.Price AS price
    FROM 
        Products p
    LEFT JOIN 
        Reviews r ON p.ProductID = r.ProductID
    GROUP BY 
        p.ProductID
    ORDER BY ` + getOrder(order) + `
    LIMIT ` + offset + ", 5; ";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get items for search page by tags
app.get('/search/:order/:offset/tag/:str', (request, response) => {
    const order = request.params.order;
    const offset = request.params.offset;
    const str = request.params.str;
    const getOrder = function(o) {
        switch (o) {
            case 'rating': return 'avgrating DESC';
            case 'highestprice': return 'p.Price DESC';
            case 'lowestprice': return 'p.Price';
        }
    }
    const sqlQuery = `
    SELECT 
        p.productid AS id,
        p.Name AS name, 
        COALESCE(AVG(r.Rating), 0) AS avgrating, 
        p.Price AS price
    FROM 
        Products p
    LEFT JOIN 
        Reviews r ON p.ProductID = r.ProductID
    LEFT JOIN 
        ProductTags pt ON p.ProductID = pt.ProductID
    LEFT JOIN 
        Tags t ON pt.TagID = t.TagID
    WHERE 
        t.TagName LIKE CONCAT('%', '` + str + `', '%')
    GROUP BY 
        p.ProductID
    ORDER BY ` + getOrder(order) + `
    LIMIT ` + offset + ", 5; ";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get items for search page by name
app.get('/search/:order/:offset/name/:str', (request, response) => {
    const order = request.params.order;
    const offset = request.params.offset;
    const str = request.params.str;
    const getOrder = function(o) {
        switch (o) {
            case 'rating': return 'avgrating DESC';
            case 'highestprice': return 'p.Price DESC';
            case 'lowestprice': return 'p.Price';
        }
    }
    const sqlQuery = `
    SELECT 
        p.productid AS id,
        p.Name AS name, 
        COALESCE(AVG(r.Rating), 0) AS avgrating, 
        p.Price AS price
    FROM 
        Products p
    LEFT JOIN 
        Reviews r ON p.ProductID = r.ProductID
    WHERE 
        p.Name LIKE CONCAT('%', '` + str + `', '%')
    GROUP BY 
        p.ProductID
    ORDER BY ` + getOrder(order) + `
    LIMIT ` + offset + ", 5; ";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// search for single item by id
app.get('/search/:id', (request, response) => {
    const id = request.params.id;
    const sqlQuery = `
    SELECT 
        p.productid AS id,
        p.Image AS image, 
        p.Name AS name, 
        p.Price AS price,
        p.description AS description
    FROM 
        Products p
    WHERE 
        p.productid = ` + id + ";";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get reviews of item by id
app.get('/reviews/:id', (request, response) => {
    const id = request.params.id;
    const sqlQuery = `
    SELECT 
        rating, comment
    FROM 
        Reviews
    WHERE 
        productid = ` + id + ";";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get tags of item by id
app.get('/tags/:id', (request, response) => {
    const id = request.params.id;
    const sqlQuery = `
    SELECT 
        tagname AS tag
    FROM 
        ProductTags NATURAL JOIN Tags
    WHERE 
        productid = ` + id + ";";
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get top rated item
app.get('/top', (request, response) => {
    const sqlQuery = `
    SELECT 
        p.productid AS id,
        p.Image AS image,
        p.Name AS name, 
        COALESCE(AVG(r.Rating), 0) AS avgrating, 
        p.Price AS price
    FROM 
        Products p
    LEFT JOIN 
        Reviews r ON p.ProductID = r.ProductID
    GROUP BY 
        p.ProductID
    ORDER BY avgrating DESC
    LIMIT 0, 1;`;
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get top 10 selling products
app.get('/top10/bestselling', (request, response) => {
    const sqlQuery = `
    SELECT p.Name AS name, SUM(od.Quantity) AS value
    FROM OrderDetails od
    JOIN Products p ON od.ProductID = p.ProductID
    GROUP BY p.Name
    ORDER BY value DESC
    LIMIT 10;
    `;
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get top 10 products by revenue
app.get('/top10/mostrevenue', (request, response) => {
    const sqlQuery = `
    SELECT p.Name AS name, SUM(od.Quantity * od.Price) AS value
    FROM OrderDetails od
    JOIN Products p ON od.ProductID = p.ProductID
    GROUP BY p.Name
    ORDER BY value DESC
    LIMIT 10;
    `;
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});

// get top 10 customers by total spent
app.get('/top10/customerstotal', (request, response) => {
    const sqlQuery = `
    SELECT CONCAT(u.FirstName, ' ', u.LastName) AS name, SUM(o.TotalAmount) AS value
    FROM Users u
    JOIN Orders o ON u.UserID = o.UserID
    GROUP BY u.UserID
    ORDER BY value DESC
    LIMIT 10;
    `;
    dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
        return response.status(400).json({Error: "Error in the SQL statement. Please check."});
    }
    //response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
    return response.status(200).json(result);
    });
});



