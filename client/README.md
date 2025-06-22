# Env
Copy env.test to .env
config your host file for pick subdomain to local host 
domain include REACT_APP_HEAD_QUATER_PREFIX : headquater app
domain include REACT_APP_BRANCH_PREFIX : admin app

BE: 
 - https://heart-ribbon-meal-api.egs-dev.site/
FE:
 - https://branch-heart-ribbon-meal.egs-dev.site/
 - https://admin-heart-ribbon-meal.egs-dev.site/
Enduser-FE:
 - https://heart-ribbon-meal.egs-dev.site/

develop mode:
 - RUN: npm install
 - RUN: npm start
build mode: 
  npm run build

Project use each page share cookies by subdomain

