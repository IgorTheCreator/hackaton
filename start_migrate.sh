git pull
npx prisma migrate dev --name init
docker build .
docker compose up -d