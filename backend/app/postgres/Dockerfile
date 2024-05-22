FROM postgres
ENV POSTGRES_DB mydb
ENV POSTGRES_USER myuser
ENV POSTGRES_PASSWORD mysecretpassword
RUN set -eux; \
    echo "host all all all    (all) -rw-x" >> /etc/postgresql/pg_hba.conf; \
    echo "listen all" >> /etc/postgresql/postgresql.conf; \
    echo "pg_hba_file = '/etc/postgresql/pg_hba.conf'" >> /etc/postgresql/postgresql.conf; \
    echo "timezone = 'UTC-3'" >> /etc/postgresql/postgresql.conf
COPY init.sql /docker-entrypoint-initdb.d/
