import { updateStudentDatabase } from './database';
import * as fs from 'fs';

// Path to the Excel file containing student data
const filePath = 'path/to/your/student_data.xlsx'; // Update this path accordingly

// Read the file and repopulate the database
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  
  updateStudentDatabase(data)
    .then(result => {
      console.log('Database repopulated successfully:', result);
    })
    .catch(error => {
      console.error('Error repopulating the database:', error);
    });
});
