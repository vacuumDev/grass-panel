const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios'); // добавляем axios для выполнения HTTP-запросов

dotenv.config();

const app = express();

// Разрешаем запросы с клиента (например, http://localhost:3000)
app.use(cors({
    origin: process.env.FRONTEND_BASE,
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: process.env.SECRET, // замените на более надёжное значение
    resave: false,
    saveUninitialized: false
}));

// Логин-роут, проверка через данные из .env
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.LOGIN && password === process.env.PASSWORD) {
        req.session.user = username;
        return res.json({ success: true });
    }
    res.status(401).json({ success: false, message: 'Неверные учетные данные' });
});

// Мидлвар для проверки аутентификации
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ success: false, message: 'Unauthorized' });
}

// Функция для получения списка серверов из переменной окружения SERVERS
function getServersList() {
    if (!process.env.SERVERS) {
        return [];
    }
    return process.env.SERVERS.split(',')
        .map(ip => ip.trim())
        .filter(ip => ip.length > 0);
}

// Роут для получения общей статистики по всем серверам.
// Для каждого IP из SERVERS делаем запрос к http://IP/getStatistics
app.get('/dashboard', isAuthenticated, async (req, res) => {
    const serversList = getServersList();
    try {
        const serverRequests = serversList.map(ip => {
            console.log(ip)
            return axios.get(`http://${ip}/getStatistics`, {
                headers: {
                    'Authorization': process.env.SERVERS_AUTH_TOKEN
                }
            })
                .then(response => ({
                    ip,
                    data: response.data
                }))
                .catch(error => ({
                    ip,
                    error: error.message
                }));
        });
        const serversData = await Promise.all(serverRequests);
        res.json(serversData);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении данных с серверов" });
    }
});

app.get('/server/:ip', isAuthenticated, async (req, res) => {
    const ip = req.params.ip;
    try {
        const response = await axios.get(`http://${ip}/getStatistics`, {
            headers: {
                'Authorization': process.env.SERVERS_AUTH_TOKEN
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении данных с сервера", details: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));