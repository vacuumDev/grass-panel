# Backend API

Это серверное приложение предоставляет API для фронтенда и использует переменные окружения для аутентификации, настройки портов и связи с другими сервисами.

## Требования

- Node.js v18+
- npm

## Установка

**Клонирование репозитория и переход в каталог проекта:**

   ```bash
   git clone https://github.com/vacuumDev/grass-panel.git
   ```
   
## Бекенд
1. Установка зависимостей:
   ```bash
   cd backend
   npm install
   ```
2. Создайте .env
   ```dotenv
    LOGIN=admin
    PASSWORD=482905316
    PORT=8080
    FRONTEND_BASE=http://127.0.0.1:3001 # фронтенд базовый урл
    SECRET=123312123123123123123123 # секретный ключ для подписи
    SERVERS=127.0.0.1,133.33.33.133 # список серверов через запятую
    TARGET_PORT=3000 # какой порт у серверов
    SERVERS_AUTH_TOKEN=fea5143d18395eeed87f7b124ce0efe4 # секретный токен для авторизации на серверах
   ```

3. Запуск сервера
   ```bash
   node app.js
   ```
## Фронтенд
1. Установка зависимостей:
   ```bash
   cd app
   npm install
   ```
2. Создайте .env.local
   ```dotenv
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8080 # базовый урл сервера
   ```
3. Запуск клиента
   ```bash
   npm run build
   npm run start
   ```
