# blogging platform

A blogging platform written in ExpressJS and Angular.

## Usage

1. Start mongodb (You can use the provided `docker-compose.yml`)

2. Build frontend and copy to public directory.

    ```sh
    cd frontend/
    npm install
    npm run build
    cp dist/frontend/* ../backend/public/
    ```

3. Edit backend configuration in `backend/.env`
4. Start backend

```sh
cd backend/
npm install
npm run start
```

## Default users

- admin / admin
- user / user
