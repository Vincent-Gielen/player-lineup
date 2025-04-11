## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Back-end

### Opstarten

Maak een `.env` file aan op de volgende manier:
Vervolledig het bestand met jouw credentials, secret,...

```bash
NODE_ENV=development
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>
AUTH_JWT_SECRET=<YOUR-JWT-SECRET>
```

- Enable Corepack: `corepack enable`
- Installeer dependencies: `yarn`
- Voer de migraties uit: `yarn migrate:dev`
- Start de development server: `yarn start:dev`

### Productie

Idem als opstarten, met een aanpassing vanaf de migraties:

- Voer de migraties uit: `yarn prisma migrate deploy`
- Build het project: `yarn build`
- Start de productie server: `node build/src/index.js`

### Testen

Maak een `.env.test` file aan op de volgende manier:
Vervolledig het bestand met jouw credentials, secret,...

```bash
NODE_ENV=testing
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>_test
AUTH_JWT_SECRET=<YOUR-JWT-SECRET>
```

Indien alle stappen uit opstarten zijn gevolgd, voer dan volgende stappen uit:

- Voer de migraties uit: `yarn migrate:test`
- *Optioneel* - Voer de tests uit: `yarn test`
- Voer de tests uit met coverage: `yarn test:coverage`
  - Dit genereert een bestand in de \_\_tests\_\_/coverage folder.
  - Open `__tests__/coverage/lcov-report/index.html` in uw browser om het coverage report te bekijken.

## Front-end

### Opstarten

Maak een `.env` file aan op de volgende manier:

```bash
VITE_API_URL=http://localhost:9000/api
```

- Enable Corepack: `corepack enable`
- Installeer dependencies: `yarn install`
- Start de applicatie: `yarn dev`

### Productie

Idem als opstarten, met een aanpassing vóór het starten:

- Build de applicatie: `yarn build` Dit maakt een `dist` folder met de gecompileerde bestanden.

### Testen

Indien alle stappen uit opstarten zijn gevolgd, voer dan volgende stappen uit:

Zorg ervoor dat zowel de backend als frontend draaien (zie bovenstaand).

- Voer de testen uit:`yarn test`
- Kies `E2E testing` in het Cypress window, en kies in het nieuwe tablad welke testen je wilt uitvoeren.