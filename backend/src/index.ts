import { get } from "http";
import { DatabaseMap, getStudentDatabase } from "./database";

const filePath = "data/Student_Database_2019.xlsm";

const studentDatabase: DatabaseMap = getStudentDatabase(filePath);

console.log(studentDatabase[2018232]);
