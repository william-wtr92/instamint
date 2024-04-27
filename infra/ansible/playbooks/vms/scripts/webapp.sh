#!/bin/sh

set -e

USERNAME=$1
PASSWORD=$2
CONTAINER_IMAGE=$3
CONTAINER_NAME=$4
CONTAINER_PORT=$5

NEXT_PUBLIC_BLOB_URL=$6
NEXT_PUBLIC_BASE_URL=$7

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
      -p "${CONTAINER_PORT}":3000 \
      -e NEXT_PUBLIC_BLOB_URL="${NEXT_PUBLIC_BLOB_URL}" \
      -e NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
      --label "traefik.enable=true" \
      --label "traefik.http.routers.webapp.rule=HostRegexp(\`{host:.+}\`)" \
      --label "traefik.http.services.webapp.loadbalancer.server.port=${CONTAINER_PORT}" \
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
