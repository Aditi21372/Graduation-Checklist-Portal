#!/bin/bash

# Activate the Conda environment
conda activate GraduationChecklist

# Start the backend
cd backend
nvm use 18.17
npm run server &

# Start the frontend
cd ../frontend
ng serve --port 40002 &

echo "Graduation Checklist Portal is starting..."
echo "Backend should be available at http://localhost:3002"
echo "Frontend should be available at http://localhost:40002"
echo "Press Ctrl+C to stop the servers"

# Wait for user input to keep the script running
read -p "Press Enter to stop the servers..."

# Kill the processes
kill $(lsof -t -i:3000)
kill $(lsof -t -i:40000)

echo "Servers stopped."