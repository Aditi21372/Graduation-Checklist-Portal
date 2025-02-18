# import requests
# import json

# def get_student_checklist(roll_number, branch):
#     """
#     Get student checklist data from the API
    
#     Args:
#         roll_number (str): Student's roll number
#         branch (str): Student's branch (e.g., 'CSE', 'CSD', etc.)
    
#     Returns:
#         dict: API response containing student info and checklist data
#     """
#     url = f"http://localhost:3002/api/checklist-data/{roll_number}/{branch}"
#     try:
#         response = requests.get(url)
#         response.raise_for_status()  # Raise exception for bad status codes
#         data = response.json()
        
#         # Print student info
#         student = data['studentInfo']
#         print("\nStudent Information:")
#         print(f"Name: {student['name']}")
#         print(f"Roll Number: {student['rollNumber']}")
#         print(f"Program: {student['program']}")
#         print(f"Batch: {student['batch']}")
        
#         # Print checklist summary
#         print("\nChecklist Summary:")
#         for item in data['dataSourceTwo']:
#             print(f"{item['rule']}: {item['status']} ({item['credits']} credits)")
        
#         return data
        
#     except requests.exceptions.RequestException as e:
#         print(f"Error accessing API: {e}")
#         return None

# if __name__ == "__main__":
#     # Example usage
#     roll_number = "2021001"
#     branch = "CSE"
    
#     print(f"Fetching data for roll number {roll_number}, branch {branch}...")
#     data = get_student_checklist(roll_number, branch)
    
#     if data:
#         # Access specific data if needed
#         course_data = data['courseData']
#         bucket_status = data['bucketStatus']
#         bucket_credits = data['bucketCredits']
