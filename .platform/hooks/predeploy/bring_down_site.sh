#!/bin/bash

# Run Caches

# Before the deployment, bring down the site

php artisan down

npm install

npm run build
