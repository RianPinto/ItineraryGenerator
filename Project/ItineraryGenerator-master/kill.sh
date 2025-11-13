#!/bin/bash

# List of ports
ports=(8080 8081 8082 8083 8084 8761 8090)

# Kill processes listening on the specified ports
for port in "${ports[@]}"; do
    # Get the PID(s) of the process listening on the port
    pids=$(lsof -t -i :"$port")

    if [ -n "$pids" ]; then
        echo "Killing process(es) on port $port with PID(s): $pids"
        kill -9 $pids
    else
        echo "No process found on port $port"
    fi
done

# Delete all .log files in the current directory
echo "Deleting all .log files in the current directory..."
rm -f ./*.log
echo "All .log files deleted (if any existed)."
