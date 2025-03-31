#!/bin/bash

# Kill any existing processes on ports
kill $(lsof -t -i:3002) 2>/dev/null
kill $(lsof -t -i:40002) 2>/dev/null

# Activate Conda environment
conda activate GraduationChecklist

# Start backend with PM2
cd backend
nvm use 18.17
pm2 start npm --name "backend" -- run server

# Start frontend with PM2
cd ../frontend
pm2 start ng --name "frontend" -- serve --port 40002

# Save the PM2 process list
pm2 save

echo "Graduation Checklist Portal is starting..."
echo "Backend is available at http://localhost:3002"
echo "Frontend is available at http://localhost:40002"

# Keep script running
read -p "Press Enter to stop the servers..."
pm2 stop all
pm2 delete all
echo "Servers stopped."
