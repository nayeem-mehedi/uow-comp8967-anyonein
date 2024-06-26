# AnyOneIn BackEnd

### setup dev env

1. download podman desktop and install - https://podman-desktop.io/
2. create folder `data` and inside that create `db`
3. pull `MariaDB` image from docker `podman pull library/mariadb:10`
4. run using the following command (change passwords and username)
```bash
podman run --name='maria_db' -v ./data/db:/var/lib/mysql:Z -e MARIADB_ROOT_PASSWORD=<db_root_password> -e MARIADB_DATABASE=anyonein -e MARIADB_USER=<user> -e MARIADB_PASSWORD=<password>> -p 3306:3306 -d mariadb:10
```
5. Install DBeaver Community - https://dbeaver.io/
6. Install - REST Client - v0.25.1 - Huachao Mao from 'VScode marketplace"
7. pull `redis` `podman pull library/redis:7.0-alpine`
8. run using `podman run --name redis -p 6379:6379 -d  redis:7.0-alpine`

### Running the Backend
1. development mode - `npm run dev` - server will start at 9001 port
