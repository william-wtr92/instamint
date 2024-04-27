#!/bin/sh

set -e

USERNAME=$1
PASSWORD=$2
CONTAINER_IMAGE=$3
CONTAINER_NAME=$4
CONTAINER_PORT=$5

CORS_ORIGIN_BUSINESS=$6
AZURE_ACCOUNT_NAME=$7
AZURE_ACCOUNT_KEY=$8
AZURE_BLOB_CONTAINER=$9
AZURE_BLOB_CONNECTION=${10}

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
      --network web \
      -p "${CONTAINER_PORT}":"${CONTAINER_PORT}" \
      -e CORS_ORIGIN_BUSINESS="${CORS_ORIGIN_BUSINESS}" \
      -e AZURE_ACCOUNT_NAME="${AZURE_ACCOUNT_NAME}" \
      -e AZURE_ACCOUNT_KEY="${AZURE_ACCOUNT_KEY}" \
      -e AZURE_BLOB_CONTAINER="${AZURE_BLOB_CONTAINER}" \
      -e AZURE_BLOB_CONNECTION="${AZURE_BLOB_CONNECTION}" \
      --label "traefik.enable=true" \
      --label "traefik.http.routers.files.rule=HostRegexp(\`{host:.+}\`)" \
      --label "traefik.http.services.files.loadbalancer.server.port=${CONTAINER_PORT}" \
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
