# 🕹️ ArcadeRank API

Backend robusto para uma plataforma de jogos distribuída com sistema de gamificação em tempo real.

## 🚀 Tecnologias

- **NestJS** (Arquitetura Modular)
- **Prisma ORM** (PostgreSQL)
- **Passport + JWT** (Autenticação Segura)
- **Argon2** (Hashing de Senha)
- **Docker** (Ambiente de Desenvolvimento)

## 🛠️ Funcionalidades

- [x] Cadastro e Login com JWT
- [x] Sistema de Níveis e XP (Level Up Engine)
- [x] Ranking Global (Leaderboard)
- [x] Validação de Dados (DTOs)
- [x] Tratamento de Erros Global

## 📦 Como Rodar

1. Clone o repo
2. Suba o banco: `docker-compose up -d`
3. Instale deps: `npm install`
4. Rode as migrations: `npx prisma migrate dev`
5. Inicie: `npm run start:dev`
