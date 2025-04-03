const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Разрешаем запросы с клиента (например, http://localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: 'some_secret_key', // замените на более надёжное значение
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

// Роут для получения общей статистики по серверам
app.get('/dashboard', isAuthenticated, (req, res) => {
    // Пример данных с новыми полями
    const servers = [
        {
            id: 1,
            username: 'root',
            threads: 13,
            last24: 123,
            points: 456,
            status: 'Running',
            ip: '192.168.1.1'
        },
        {
            id: 2,
            username: 'admin',
            threads: 17,
            last24: 150,
            points: 789,
            status: 'Stopped',
            ip: '192.168.1.2'
        }
    ];
    res.json({ servers });
});

// Роут для получения детальной информации по конкретному серверу
app.get('/server/:id', isAuthenticated, (req, res) => {
    const serverId = parseInt(req.params.id, 10);

    // Пример данных для одного сервера с дополнительной информацией
    const server = {
        id: serverId,
        username: serverId === 1 ? 'root' : 'admin',
        threads: serverId === 1 ? 13 : 17,
        last24: serverId === 1 ? 123 : 150,
        points: serverId === 1 ? 456 : 789,
        status: serverId === 1 ? 'Running' : 'Stopped',
        ip: serverId === 1 ? '192.168.1.1' : '192.168.1.2',
        // Дополнительная детальная статистика, если требуется
        memory: serverId === 1 ? '75%' : '60%',
        cores: serverId === 1 ? 8 : 4
    };

    res.json(server);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
