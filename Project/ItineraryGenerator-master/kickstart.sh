#!/bin/bash

# Directory where the script is located
BASE_DIR=$(pwd)

# Log files will be named after service directories
LOG_SUFFIX=".log"

# Function to start all microservices
start_services() {
    for dir in */ ; do
        if [ -f "$dir/mvnw" ]; then
            echo "Starting Spring Boot in $dir in the background..."
            (cd "$dir" && ./mvnw spring-boot:run > "../${dir%/}${LOG_SUFFIX}" 2>&1 &)
        else
            echo "Skipping $dir (no mvnw found)"
        fi
    done
    echo "All microservices are running. Logs are in ${BASE_DIR}/*.log"
}

# Function to stop all microservices
stop_services() {
    echo "Stopping all microservices..."
    for pidfile in *.pid; do
        [ -f "$pidfile" ] || continue
        pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Killing process $pid from $pidfile"
            kill "$pid"
        fi
        rm -f "$pidfile"
    done
    echo "All microservices stopped."
}

# Parse command line flag
if [[ "$1" == "-c" ]]; then
    stop_services
else
    start_services
fi
