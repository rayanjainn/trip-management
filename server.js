import mysql from "mysql2";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to database: ", err);
  } else {
    console.log("Connected to database");
  }
});

app.use(express.json());

app.post("/api/user/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length === 0) {
        res.status(401).json({ message: "Invalid username or password" });
      } else {
        res.status(200).json({ message: "Login successful", data: results });
      }
    }
  );
});

app.post("/api/user/register", (req, res) => {
  const { username, password, email, phonenum } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length > 0) {
        res.status(401).json({ message: "Username already exists" });
      } else {
        db.query(
          "INSERT INTO users (email,password ,username ,phonenum) VALUES (?, ?, ?, ?)",
          [email, password, username, phonenum],
          (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Internal server error" });
            } else {
              res.status(200).json({
                message: "User registered successfully",
                data: results,
              });
            }
          }
        );
      }
    }
  );
});

//agent login
app.post("/api/agent/login", (req, res) => {
  const { name, password } = req.body;
  db.query(
    "SELECT * FROM agents WHERE name = ? AND password = ?",
    [name, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length === 0) {
        res.status(401).json({ message: "Invalid username or password" });
      } else {
        res.status(200).json({ message: "Login successful" });
      }
    }
  );
});

app.get("/api/trips", (req, res) => {
  db.query("SELECT * FROM trips", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ trips: results });
    }
  });
});

//get all agents
app.get("/api/agents", (req, res) => {
  db.query("SELECT * FROM agents", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ agents: results });
    }
  });
});

app.post("/api/book/:userid/:tripid", (req, res) => {
  const { userid, tripid } = req.params;
  const pay_status = true;
  db.query(
    "SELECT * FROM booking WHERE user_id = ? AND trip_id = ?",
    [userid, tripid],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else if (results.length > 0) {
        res.status(401).json({ message: "Booking already exists" });
      } else {
        db.query(
          "INSERT INTO booking (user_id,trip_id ,pay_status ) VALUES (?, ? , ?)",
          [userid, tripid, pay_status],
          (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "Internal server error" });
            } else {
              res.status(200).json({ message: "Booking successful" });
            }
          }
        );
      }
    }
  );
});

//get the trips a particular user has booked (use join and group by in sql query)
app.get("/api/trips/:userid", (req, res) => {
  const { userid } = req.params;
  db.query(
    `SELECT trips.*, COUNT(booking.trip_id) AS booking_count 
     FROM trips 
     JOIN booking ON trips.id = booking.trip_id 
     WHERE booking.user_id = ? 
     GROUP BY trips.id`,
    [userid],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ trips: results });
      }
    }
  );
});

app.post("/api/admin", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.DB_ADMIN_USERNAME;
  const adminPassword = process.env.DB_ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ message: "Admin logged in successfully" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

app.post("/api/admin/addtrip", (req, res) => {
  const { destination, price, startdate, enddate, desc, picture } = req.body;
  db.query(
    "INSERT INTO trips (destination,price,start_date,end_date ,descp,picture) VALUES (?, ?, ?, ?, ?,?)",
    [destination, price, startdate, enddate, desc, picture],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Trip added successfully" });
      }
    }
  );
});

app.delete("/api/admin/deletetrip/:tripid", (req, res) => {
  const { tripid } = req.params;
  db.query("DELETE FROM trips WHERE id = ?", [tripid], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ message: "Trip deleted successfully" });
    }
  });
});

app.put("/api/admin/updatetrip/:tripid", (req, res) => {
  const { destination, price, startdate, enddate, desc, picture } = req.body;
  const tripid = req.params.tripid;
  db.query(
    "UPDATE trips SET destination = ?, price = ?, start_date = ?, end_date = ?, descp = ? , picture = ? WHERE id = ?",
    [destination, price, startdate, enddate, desc, picture, tripid],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Trip updated successfully" });
      }
    }
  );
});

app.post("/api/admin/addagent", (req, res) => {
  const { username, password, email, phonenum, rating } = req.body;
  db.query(
    "INSERT INTO agents (name,email ,rating,phonenum ,password) VALUES (?, ?, ?, ?,?)",
    [username, email, rating, phonenum, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Agent registered successfully" });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
