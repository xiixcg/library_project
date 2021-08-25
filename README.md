# Setup Instructions
<code></code>

## Server
1. Run <code>docker pull postgres</code>.
2. Run <code>docker run --rm --name pg-library -e POSTGRES_PASSWORD=docker -d -p 8008:5432 -v \<project root directory\>/postgres:/var/lib/postgresql/data postgres</code>.
3. Create the database <code>library-books</code> in your postgres container. You may need to use quotation marks in generating the database.