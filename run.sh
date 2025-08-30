#!/bin/bash

cd ~/projekty/rogalLibrarby
source venv/bin/activate
cd backend
python3 main.py > output.log 2>&1 &
cd ../
cd frontend
npm run dev -- --host > output.log 2>&1 &
