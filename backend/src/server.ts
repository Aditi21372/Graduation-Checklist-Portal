import express from "express";
import { DatabaseMap, getStudentDatabase, StudentInfo } from "./database";

const studentRecordsFilePath = "src/data/Student_Database_2019.xlsm";
const rollNumber = 2019032;
const studentDatabase: DatabaseMap = getStudentDatabase(studentRecordsFilePath);

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.get("/api/student/:rollNumber", (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;
  // Check if the roll number exists in the database.
  if (studentDatabase.hasOwnProperty(rollNumber)) {
    const studentData = {
      rollNumber: rollNumber,
      studentName: studentDatabase[Number(rollNumber)].studentName,
    };

    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
