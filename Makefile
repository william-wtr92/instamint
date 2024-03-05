DC = docker-compose
DC_PROD = docker-compose -f docker-compose.prod.yml

GREEN=\033[0;32m
LIGHT_BLUE=\033[0;36m
LIGHT_PURPLE=\033[0;95m
NC=\033[0m

default: help

help:
	@printf "\033[3m\033[4mList of available commands:\033[0m\n"
	@printf "\n"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-up" "# Start development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-down" "# Stop development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-start" "# Start development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-stop" "# Stop development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-restart" "# Restart development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-build" "# Build or rebuild development services"
	@printf "${LIGHT_BLUE}%-40s${NC} %s\n" "- make dev-no-cache" "# Build development services without using cache"
	@printf "\n"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-up" "# Start production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-down" "# Stop production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-start" "# Start production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-stop" "# Stop production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-restart" "# Restart production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-build" "# Build or rebuild production services"
	@printf "${LIGHT_PURPLE}%-40s${NC} %s\n" "- make prod-no-cache" "# Build production services without using cache"
	@printf "\n"
	@printf "${GREEN}%-40s${NC} %s\n" "- make help" "# Display this help message"

dev-up:
	$(DC) up -d
	@echo "Development server is up and running"

dev-down:
	$(DC) down
	@echo "Development server is down"

dev-start:
	$(DC) start
	@echo "Development server is started"

dev-stop:
	$(DC) stop
	@echo "Development server is stopped"

dev-restart:
	$(DC) restart
	@echo "Development server is restarted"

dev-build:
	$(DC) build
	@echo "Development server is built"

dev-no-cache:
	$(DC) build --no-cache
	@echo "Development server is built without cache"

prod-up:
	$(DC_PROD) up -d
	@echo "Production server is up and running"

prod-down:
	$(DC_PROD) down
	@echo "Production server is down"

prod-start:
	$(DC_PROD) start
	@echo "Production server is started"

prod-stop:
	$(DC_PROD) stop
	@echo "Production server is stopped"

prod-restart:
	$(DC_PROD) restart
	@echo "Production server is restarted"

prod-build:
	$(DC_PROD) build
	@echo "Production server is built"

prod-no-cache:
	$(DC_PROD) build --no-cache
	@echo "Production server is built without cache"