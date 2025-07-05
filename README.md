# Medium-like Blogging Platform (NestJS)

## Features
- User authentication (JWT)
- Article creation and management
- Comments system
- Following users
- Article favoriting
- Tagging system
- Bookmarks
- User profiles

## Technologies
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Class Validator
- Swagger (API Documentation)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/akhtarvahid/jobs-board-ms.git
cd jobs-board-ms
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```
4. Run database migrations:
```bash
npm run db:migrate
```
5. Start the development server:
```bash
npm start
```
## API Documentation
Swagger UI at:
`http://localhost:3000/api`

## Project Structure
```html
src/
├── auth/              # Authentication module
├── user/              # User profiles and following
├── article/           # Articles and tags
├── comment/           # Comments system
├── shared/            # Shared utilities and decorators
├── app.module.ts      # Root module
└── main.ts            # Application entry point
```

## License
