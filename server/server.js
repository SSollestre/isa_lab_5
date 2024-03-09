const http = require("http");
const mysql = require("mysql");

// Server port
const port = 3000;

// Set up connection with credentials
const con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test",
  database: "webdev",
});

// Post Query Handler
const postQuery = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  let body = {};

  // Parse incoming data
  req.on("data", (chunk) => {
    try {
      const data = JSON.parse(chunk);
      Object.assign(body, data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.end(JSON.stringify({ status: "Error", message: "Invalid JSON" }));
    }
  });

  // Handle on incoming end
  req.on("end", () => {
    const sendFailMessage = () => {
      res.end(JSON.stringify({ status: "Fail" }));
    };

    let { query } = body;

    con.query(query, (err, result) => {
      if (err) {
        console.log("Fail to query:", err);
        sendFailMessage();
      } else {
        console.log("Query Success");
        res.end(JSON.stringify({ status: "Success", result: result }));
      }
    });
  });
};

// Define Server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method == "POST" && url.pathname === "/api/sendQuery") {
    postQuery(req, res);
  } else {
    // Handle unknown endpoints with a 404 response
    const responseJson = JSON.stringify({ error: "Endpoint not found" });
    res.end(responseJson);
  }
});

// Start database
con.connect((err) => {
  if (err) {
    console.log("fail to connect:", err);
  } else {
    console.log("Connected to mysql.");
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
