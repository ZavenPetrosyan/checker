# checker
domain checker with node.js and express

# there is an "common" package in API and checker_service, and this package should have been NPM package and had to be installed with NPM

# NPM install
run 'npm i' to install all dependencies in API, checker_service, migrations;

Running the app

    $ docker-compose up

Stop the app

    $ docker-compose down -v

Endpoints

    POST http://localhost:5001/domain/upload
        required parameters - file

    GET http://localhost:5001/domain/all

    GET http://localhost:5001/domain/files

    GET http://localhost:5001/domain/byName/${domain name}
        required parameters - name
