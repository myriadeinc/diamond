
T = $(TAG)

dev:
	docker build -f Dockerfile.dev -t myriadeinc/diamond:dev .

up:
	docker-compose up

build: 
	docker build -f Dockerfile -t myriadeinc/diamond:${T} .