const http = require("http");
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test",
  database: "webdev",
});

const server = http.createServer((req, res) => {
  // Parse the request URL
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Set response headers
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  // Define the response object
  const responseJson = JSON.stringify({ message: "Hello, World!" });

  // Send the JSON response
  // Check the request URL
  if (url.pathname === "/") {
    // Define the response object for the root endpoint
    const responseJson = JSON.stringify({ message: "Hello, World!" });
    res.end(responseJson);
  } else if (url.pathname === "/api/test") {
    // Define the response object for the /api/test endpoint
    const responseJson = JSON.stringify({
      message: "This is the test endpoint",
    });
    res.end(responseJson);
  } else if (req.method == "POST" && url.pathname === "/api/sendQuery") {
    let body = {};

    // Get all data
    req.on("data", (chunk) => {
      try {
        const data = JSON.parse(chunk);
        Object.assign(body, data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.end(JSON.stringify({ status: "Error", message: "Invalid JSON" }));
      }
    });

    // Handle request on data transfer end
    req.on("end", () => {
      // Send a database query
      const sendFailMessage = () => {
        res.end(JSON.stringify({ status: "Fail" }));
      };

      let { query } = body;

      con.query(query, (err, result) => {
        if (err) {
          console.log("fail to query:", err);
          sendFailMessage();
        } else {
          console.log("1 record inserted");
          res.end(JSON.stringify({ status: "Success", result: result }));
        }
      });
    });
  } else {
    // Handle unknown endpoints with a 404 response
    const responseJson = JSON.stringify({ error: "Endpoint not found" });
    res.end(responseJson);
  }
});

const port = 3000;

con.connect((err) => {
  if (err) {
    console.log("fail to connect:", err);
  } else {
    console.log("Connected to mysql.");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
