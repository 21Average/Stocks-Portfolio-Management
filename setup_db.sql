CREATE USER postgres WITH PASSWORD '1234';
ALTER USER postgres WITH SUPERUSER;
ALTER USER postgres CREATEDB;
CREATE DATABASE comp3900;
grant all privileges on database comp3900 to postgres;