#!/bin/sh

set -e

USERNAME=$1
PASSWORD=$2
CONTAINER_IMAGE=$3
CONTAINER_NAME=$4
CONTAINER_PORT=$5

NEXT_PUBLIC_BASE_URL=$6

LOG_FILE="$HOME/docker-deployment.log"

{
    echo "Logging into Docker registry..."
    echo "$PASSWORD" | sudo docker login instamintACR.azurecr.io --username "$USERNAME" --password-stdin

    echo "Pulling the Docker image..."
    sudo docker pull instamintACR.azurecr.io/instamint/"${CONTAINER_IMAGE}":latest

    echo "Running the Docker container..."
    sudo docker run -d \
     --name "${CONTAINER_NAME}" \
     -p "${CONTAINER_PORT}":"${CONTAINER_PORT}" \
      -e  NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
      instamintACR.azurecr.io/instamint/"${CONTAINER_IMAGE}":latest

    echo "Setting up Watchtower..."
    sudo docker run -d \
      --name watchtower \
      -v /var/run/docker.sock:/var/run/docker.sock \
      containrrr/watchtower \
      --interval 30 \
      --cleanup \
      --scope "${CONTAINER_NAME}"
} >> "$LOG_FILE" 2>&1

echo "Script execution completed."
