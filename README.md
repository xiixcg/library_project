# Setup Instructions
<code></code>

## Database
1. Run <code>docker pull postgres</code>.
2. Run <code>docker run --rm --name pg-library -e POSTGRES_PASSWORD=docker -d -p 8008:5432 -v \<project root directory\>/postgres:/var/lib/postgresql/data postgres</code>.
3. Create the database <code>library-books</code> in your postgres container. You may need to use quotation marks in generating the database.

## Server
1. Run <code>docker build -t server-library .</code>.
2. Run <code>docker run -d -p 3030:3030 --network="host" --rm --name=server-library server-library</code>.