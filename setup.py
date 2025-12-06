#!/usr/bin/env python3
"""
TrueOrigins Setup Script
Run: python3 setup.py
"""
import os
import subprocess
import sys
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_DIR = os.path.join(BASE_DIR, "venv")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

def run(cmd, cwd=None):
    print(f">>> {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}")
        sys.exit(1)

def main():
    print("=" * 60)
    print("TrueOrigins Setup")
    print("=" * 60)

    # 1. Remove old venv if exists
    if os.path.exists(VENV_DIR):
        print("Removing old venv...")
        run(f"rm -rf {VENV_DIR}")

    # 2. Create venv
    print("\n[1/4] Creating virtual environment...")
    run(f"python3 -m venv {VENV_DIR}")

    # 3. Install requirements
    print("\n[2/4] Installing backend dependencies...")
    pip_path = os.path.join(VENV_DIR, "bin", "pip")
    run(f"{pip_path} install --upgrade pip")
    run(f"{pip_path} install -r {os.path.join(BACKEND_DIR, 'requirements.txt')}")

    # 4. Add __init__.py files (for proper Python imports)
    print("\n[3/4] Setting up Python package structure...")
    for d in ["api", "services", "utils"]:
        init_path = os.path.join(BACKEND_DIR, d, "__init__.py")
        if not os.path.exists(init_path):
            open(init_path, 'w').close()
            print(f"  Created {init_path}")

    # 5. Start servers
    print("\n[4/4] Starting servers...")
    uvicorn_path = os.path.join(VENV_DIR, "bin", "uvicorn")

    # Start backend
    print("  Starting backend (port 8000)...")
    backend_log = open(os.path.join(BASE_DIR, "backend.log"), "w")
    backend_proc = subprocess.Popen(
        [uvicorn_path, "backend.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=BASE_DIR,
        stdout=backend_log,
        stderr=subprocess.STDOUT
    )

    # Start frontend
    print("  Starting frontend (port 3000)...")
    frontend_log = open(os.path.join(FRONTEND_DIR, "frontend.log"), "w")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=FRONTEND_DIR,
        stdout=frontend_log,
        stderr=subprocess.STDOUT
    )

    print("\n" + "=" * 60)
    print("Servers started!")
    print("=" * 60)
    print("Backend:  http://localhost:8000")
    print("Frontend: http://localhost:3000")
    print("\nLogs:")
    print(f"  Backend:  {os.path.join(BASE_DIR, 'backend.log')}")
    print(f"  Frontend: {os.path.join(FRONTEND_DIR, 'frontend.log')}")
    print("\nPress Ctrl+C to stop servers.")
    print("=" * 60)

    try:
        while True:
            time.sleep(1)
            # Check if processes are still running
            if backend_proc.poll() is not None:
                print("Backend process exited!")
                break
            if frontend_proc.poll() is not None:
                print("Frontend process exited!")
                break
    except KeyboardInterrupt:
        print("\nShutting down...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main()
