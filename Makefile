.PHONY: check-docker-daemon-mac build-account-app stop-account-app nuke-account-app restart-account-app clean-restart-account-app seed-db


check-docker-daemon-mac:
	# Check if the Docker daemon is running using docker info
	@if ! docker info > /dev/null 2>&1; then \
		echo "Docker daemon is not running. Starting Docker Desktop..."; \
		open -a Docker; \
		while ! docker info > /dev/null 2>&1; do \
			echo "Waiting for Docker to launch..."; \
			sleep 2; \
		done; \
		echo "Docker daemon is now running."; \
	else \
		echo "Docker daemon is already running."; \
	fi

start-account-app:
	make check-docker-daemon-mac
	docker-compose build
	docker-compose up

stop-account-app:
	make check-docker-daemon-mac
	docker-compose down

nuke-account-app:
	make check-docker-daemon-mac
	@echo "removing volumes"
	docker-compose down -v

restart-account-app:
	make check-docker-daemon-mac
	docker-compose down
	docker-compose up --build

clean-restart-account-app:
	make check-docker-daemon-mac
	@echo "removing volumes"
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up

seed-db:
	make check-docker-daemon-mac
	docker-compose exec flask python seed_scripts/init_seed_db.py
