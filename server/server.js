const http = require("http");
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webdev",
});

const server = http.createServer((req, res) => {
  // Parse the request URL
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Set response headers
  res.writeHead(200, { "Content-Type": "application/json" });

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
  } else if (url.pathname === "/api/sendQuery") {
    // Send a database query
    const sendFailMessage = () => {
      res.end(JSON.stringify({ status: "Fail" }));
    };
    con.connect((err) => {
      if (err) {
        sendFailMessage();
        return;
      }
      console.log("Connected to mysql.");
      let sql = "INSERT INTO score(name, score) values ('elon musk', 2900)";

      con.query(sql, (err, result) => {
        if (err) {
          sendFailMessage();
          return;
        }
        console.log("1 record inserted");
        res.end(JSON.stringify({ status: "Success", result: result }));
      });
    });
  } else {
    // Handle unknown endpoints with a 404 response
    const responseJson = JSON.stringify({ error: "Endpoint not found" });
    res.end(responseJson);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
