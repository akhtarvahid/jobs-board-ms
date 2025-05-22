#!/bin/sh
# npm run db:drop
npm run db:migrate
npm run db:seed
exec npm start