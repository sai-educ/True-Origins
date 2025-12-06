#!/bin/bash
echo "Starting setup..." > setup.log
/usr/bin/python3 -m venv venv
if [ -d "venv" ]; then
    echo "Venv created" >> setup.log
    ./venv/bin/pip install -r backend/requirements.txt >> setup.log 2>&1
    echo "Pip install done" >> setup.log
    nohup ./venv/bin/uvicorn backend.main:app --port 8000 > backend.log 2>&1 &
    echo "Backend started" >> setup.log
else
    echo "Venv creation failed" >> setup.log
fi

cd frontend
nohup npm run dev > frontend.log 2>&1 &
echo "Frontend started" >> ../setup.log
