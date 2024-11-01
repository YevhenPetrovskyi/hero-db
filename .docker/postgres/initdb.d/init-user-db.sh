#!/bin/bash
set -o errexit

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE $DB_DATABASE;
	GRANT ALL PRIVILEGES ON DATABASE $DB_DATABASE TO $DB_USERNAME;
EOSQL