# checker
domain checker with node.js and express

# there is an "common" package in API and checker_service, and this package should have been NPM package and had to be installed with NPM

Running the app
    $ docker-compose up

Stop the app
    $ docker-compose down -v

Endpoints
    POST http://localhost:5001/domain/upload

    GET http://localhost:5001/domain/all

    GET http://localhost:5001/domain/files

    GET http://localhost:5001/domain/byName/${domain name}
