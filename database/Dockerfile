FROM postgres:16-alpine

ENV POSTGRES_DB=Thesis-Management-System
ENV POSTGRES_USER=${DB_USER}
ENV POSTGRES_PASSWORD=${DB_PASSWORD}

COPY ./Thesis-Management-System.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432

CMD ["postgres"]
