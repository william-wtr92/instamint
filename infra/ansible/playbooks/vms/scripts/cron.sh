#!/bin/sh

set -e

USERNAME=$1
PASSWORD=$2
CONTAINER_IMAGE=$3
CONTAINER_NAME=$4
CONTAINER_PORT=$5

BUSINESS_SERVICE_URL=$6
REDIS_HOST=$7
REDIS_PORT=$8
REDIS_PASSWORD=$9
SECURITY_CRON_JWT_SECRET=${10}
SECURITY_CRON_JWT_SCOPE_DELETE_ACCOUNT=${11}

LOG_FILE="$HOME/docker-deployment.log"

{
    echo "Logging into Docker registry..."
    echo "$PASSWORD" | sudo docker login instamintACR.azurecr.io --username "$USERNAME" --password-stdin

    echo "Pulling the Docker image..."
    if sudo docker pull instamintACR.azurecr.io/instamint/"${CONTAINER_IMAGE}":latest; then
        echo "Docker image pulled successfully."
    fi

    echo "Running the Docker container..."
    if sudo docker run -d \
      --name "${CONTAINER_NAME}" \
      -p "${CONTAINER_PORT}":"${CONTAINER_PORT}" \
      -e BUSINESS_SERVICE_URL="${BUSINESS_SERVICE_URL}" \
      -e REDIS_HOST="${REDIS_HOST}" \
      -e REDIS_PORT="${REDIS_PORT}" \
      -e REDIS_PASSWORD="${REDIS_PASSWORD}" \
      -e SECURITY_CRON_JWT_SECRET="${SECURITY_CRON_JWT_SECRET}" \
      -e SECURITY_CRON_JWT_SCOPE_DELETE_ACCOUNT="${SECURITY_CRON_JWT_SCOPE_DELETE_ACCOUNT}" \
      instamintACR.azurecr.io/instamint/"${CONTAINER_IMAGE}":latest; then
        echo "Docker container started successfully."
    fi

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
