# Instruçoes pra rodar o back-end Ng

### 1-Instale o banco de dados PostgreSQL
### 2-Clone o projeto 
   git clone https://github.com/fabio460/api-transacoes-monetarias.git
   cd api-transacoes-monetarias
### 3-Crie um arquivo .env na raiz do projeto contendo:
   DATABASE_URL="postgresql://postgres:Senha@localhost:5432/nomeDoBanco", Obs: credenciais do seu banco!
   SECRETKEY="ffffaaaaabbbbbiiiioooooo" 
### 4- Instale as dependências
   npm install
### 5- Digite o comando
   npx prisma generate
### 6- Rode o projeto
   nodemon index.ts

### 7- Rode o front-end no link https://github.com/fabio460/transacoes-monetarias-2.0.git   