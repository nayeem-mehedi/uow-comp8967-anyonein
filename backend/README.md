# AnyOneIn BackEnd

### setup dev env

1. download podman desktop and install -> https://podman-desktop.io/
2. run the development stack using from `backend` folder using command -> `podman compose up -d` or `docker compose up -d`
   1. If you were using using my previous guide -> **Remove the previous containers**
3. Install DBeaver Community - https://dbeaver.io/
4. Install - REST Client - v0.25.1 - Huachao Mao from 'VScode marketplace"

### Running the Backend Server
0. add a `.env` file inside the backedn folder with the following:
```shell
DB_HOST=localhost
DB_PORT=3306
DB_USER=db_user
DB_PASS=db1234
DB_NAME=anyonein
PORT=9001

# REDIS
REDIS_HOST=localhost
REDIS_PORT=6379

# Login properties
JWT_SECRET=s&cnY#5bLUja@WpPm@ucoePnhgeGKA3
# in seconds
TOKEN_EXPIRE=3600
```
1. development mode - `npm run dev` or `npm run start` - server will start at 9001 port

### initial demo data loading
To load some demo data in the DB : `npm run load_demo_data`

### API endpoint test
Open the file `backend/api_test.http` and start testing the backend API



`npm remove mysql`
`npm install mssql`