# Graduation Checklist API Documentation

## Get Student Checklist Data
Retrieves complete graduation checklist data for a student, including student information, course data, and requirement statuses.

### Endpoint
```
GET /api/checklist-data/{rollNumber}/{branch}
```

### Parameters
- `rollNumber` (path parameter): Student's roll number (e.g., 2021001)
- `branch` (path parameter): Student's branch (e.g., CSE, CSD, CSAI)

### Example Request
```bash
curl http://localhost:3002/api/checklist-data/2021001/CSE
```

### Response Format
```json
{
  "studentInfo": {
    "name": "Student Name",
    "rollNumber": "2021001",
    "program": "CSE",
    "batch": 2021
  },
  "dataSourceTwo": [
    {
      "index": 1,
      "rule": "Core Courses",
      "status": "Complete/Incomplete",
      "statusBool": true/false,
      "credits": 76,
      "button_text": "View Core Courses"
    },
    // ... other requirements
  ],
  "courseData": {
    "Core_Courses": [...],
    "Bucket_Courses": [...],
    "SSH_Courses": [...],
    "CW_Details": [...],
    "SG_Details": [...],
    // ... other course categories
  },
  "completedBuckets": [true, true, false, ...],
  "bucketCredits": 14,
  "bucketStatus": true
}
```

### Response Fields
- `studentInfo`: Basic student information
- `dataSourceTwo`: Array of all graduation requirements with their status
- `courseData`: Detailed course information organized by category
- `completedBuckets`: Status of each bucket requirement
- `bucketCredits`: Total credits from bucket courses
- `bucketStatus`: Overall bucket completion status

### Example Usage

#### Python
```python
import requests

response = requests.get('http://localhost:3002/api/checklist-data/2021001/CSE')
data = response.json()
```

#### JavaScript
```javascript
fetch('http://localhost:3002/api/checklist-data/2021001/CSE')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### cURL
```bash
curl http://localhost:3002/api/checklist-data/2021001/CSE
```

### Notes
- All data processing is done on the server side
- Response includes all necessary data for displaying the graduation checklist
- No additional API calls needed
- Replace `localhost:3002` with your actual server URL in production
