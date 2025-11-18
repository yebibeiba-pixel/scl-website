#!/bin/bash
# Keep-alive script to prevent hibernation
while true; do
    curl -s http://localhost:3001/ > /dev/null
    sleep 300  # Every 5 minutes
done
