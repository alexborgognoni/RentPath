#!/bin/bash

# Run Caches

# After the deployment, it's highly recommended
# to re-run the caches for config, routes and views.

aws s3 cp s3://rentpath-prerelease-secret/.env .

sudo chmod 777 .env

php artisan key:generate

php artisan cache:clear

php artisan up
