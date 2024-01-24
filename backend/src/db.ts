import mongoose from "mongoose";

const mongoDBUrl = "mongodb://localhost:27017/graduation";
mongoose.connect(mongoDBUrl);
export const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
