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
    SERVERS=127.0.0.1:3000,133.33.33.133:3001 # список серверов через запятую
    SERVERS_AUTH_TOKEN=fea5143d18395eeed87f7b124ce0efe4 # секретный токен для авторизации на серверах
   ```

3. Запуск сервера
   ```bash
   node app.js
   ```
## Фронтенд
1. Установка зависимостей:
   ```bash
   cd client
   npm install
   ```
2. Создайте .env
   ```dotenv
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8080 # базовый урл сервера
   ```
3. Запуск клиента
   ```bash
   npm run build
   npm run start
   ```

# Настройка домена и HTTPS для приложения на сервере с Nginx

Этот гайд поможет привязать домен к вашему приложению, запущенному на сервере, с настройкой HTTPS через Certbot. 
Перед использованием данного мануала вам надо привязать домен к серверу. Также надо создать поддомен api и его тоже привязать к серверу

---

## Шаг 1: Установка и настройка Nginx

1. Обновите индекс пакетов:

   ```bash
   sudo apt update
   ```

2. Установите Nginx:

   ```bash
   sudo apt install nginx
   ```

3. Запустите сервис Nginx:

   ```bash
   sudo systemctl start nginx
   ```

4. Проверьте статус работы Nginx и включите автозапуск:

   ```bash
   sudo systemctl status nginx
   sudo systemctl enable nginx
   ```

---

## Шаг 2: Настройка конфигурации Nginx для вашего домена

1. Создайте новый файл конфигурации для домена:

   ```bash
   sudo nano /etc/nginx/sites-available/<ваш-домен>
   ```

   Пример:

   ```bash
   sudo nano /etc/nginx/sites-available/example.com
   ```

2. Добавьте следующую конфигурацию в файл, заменив `<ваш-домен>` на свой домен:

   ```nginx
   server {
       client_max_body_size 64M;
       listen 80;
       server_name <ваш-домен>;

       location / {
           proxy_pass             http://127.0.0.1:<ваш-порт>;
           proxy_read_timeout     60;
           proxy_connect_timeout  60;
           proxy_redirect         off;

           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto https;
       }
   }
   ```

замените <ваш-домен> и <ваш-порт> на ваши значения

3. Создайте новый файл конфигурации для api поддомена:

   ```bash
   sudo nano /etc/nginx/sites-available/api.<ваш-домен>
   ```

   Пример:

   ```bash
   sudo nano /etc/nginx/sites-available/api.example.com
   ```

4. Добавьте следующую конфигурацию в файл, заменив `<ваш-домен>` на свой домен:

   ```nginx
   server {
       client_max_body_size 64M;
       listen 80;
       server_name api.<ваш-домен>;

       location / {
           proxy_pass             http://127.0.0.1:<ваш-порт-бекенд>;
           proxy_read_timeout     60;
           proxy_connect_timeout  60;
           proxy_redirect         off;

           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto https;
       }
   }
   ```

замените <ваш-домен> и <ваш-порт-бекенд> на ваши значения

5. Активируйте файл конфигурации:

   ```bash
   sudo ln -s /etc/nginx/sites-available/<ваш-домен> /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/api.<ваш-домен> /etc/nginx/sites-enabled/
   ```

6. Проверьте корректность конфигурации:

   ```bash
   sudo nginx -t
   ```

   Вы должны увидеть:

   ```
   nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
   nginx: configuration file /etc/nginx/nginx.conf test is successful
   ```

7. Перезапустите Nginx:

   ```bash
   sudo systemctl restart nginx
   ```

---

## Шаг 3: Настройка HTTPS с помощью Certbot

1. Установите Certbot и плагин для Nginx:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Получите SSL-сертификат для вашего домена:

   ```bash
   sudo certbot --nginx -d <ваш-домен>
   ```

   Пример:

   ```bash
   sudo certbot --nginx -d example.com
   ```

3. Следуйте инструкциям Certbot: укажите email.

4. Сделайте все тоже самое для api.example.com и проверьте работу автоматического обновления сертификатов:

   ```bash
   sudo systemctl status certbot.timer
   ```

   Ожидаемый результат:

   ```
   certbot.timer - Run certbot twice daily
        Loaded: loaded (/lib/systemd/system/certbot.timer; enabled; vendor preset: enabled)
        Active: active (waiting) since ...
        Trigger: ...
       Triggers: ● certbot.service
   ```

---

Теперь ваш домен настроен, и приложение доступно по защищённому HTTPS-протоколу! 🚀
