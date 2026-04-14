# 📦 Order Dashboard

Мини-панель управления заказами с интеграцией RetailCRM, Supabase и уведомлениями в Telegram.

## 🧰 Технический стек

| Уровень         | Технология             |
|-----------------|------------------------|
| Бэкенд          | Node.js + Express      |
| Фронтенд        | Next.js (React)        |
| База данных     | Supabase (PostgreSQL)  |
| Деплой          | Vercel                 |
| API             | RetailCRM, Telegram    |

---

## ⚙️ Установка

### 1. Клонировать репозиторий

```bash
git clone <your-repo-url>
cd order-dashboard
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
# Заполнить значения в файле .env
```

### 3. Установить зависимости бэкенда

```bash
cd backend
npm install
```

### 4. Установить зависимости фронтенда

```bash
cd ../frontend
npm install
```

---

## 🗄️ Инициализация Supabase

1. Создать проект на [supabase.com](https://supabase.com)
2. Перейти в **SQL Editor**
3. Вставить содержимое файла `supabase/schema.sql` и выполнить запрос

---

## 📤 Загрузка тестовых заказов в RetailCRM

```bash
cd backend
node scripts/upload-orders.js
```

---

## 🔄 Синхронизация RetailCRM → Supabase

```bash
cd backend
node scripts/sync-orders.js
```

---

## ▶️ Запуск проекта локально

### Бэкенд (порт 4000)

```bash
cd backend
node server.js
```

### Фронтенд (порт 3000)

```bash
cd frontend
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

---

## 🌐 Деплой на Vercel

1. Запушить на GitHub
2. Импортировать проект на [vercel.com](https://vercel.com)
3. Для **фронтенда**: указать папку `/frontend`
4. Добавить все переменные окружения в настройках Vercel

---

## 🤖 Telegram-бот

Бот автоматически отправляет уведомление, когда сумма заказа превышает **50 000 ₸**.

Для создания Telegram-бота:
1. Написать [@BotFather](https://t.me/BotFather) в Telegram
2. Создать бота командой `/newbot`
3. Скопировать токен в `.env`
4. Получить `CHAT_ID` через `https://api.telegram.org/bot<TOKEN>/getUpdates`

---

## 📁 Структура проекта

```
order-dashboard/
├── README.md
├── .env.example
├── backend/
│   ├── server.js          ← Основной сервер Express
│   ├── routes/orders.js   ← Маршруты API
│   ├── services/
│   │   ├── retailcrm.js   ← Клиент RetailCRM
│   │   ├── supabase.js    ← Клиент Supabase
│   │   └── telegram.js    ← Telegram-уведомления
│   └── scripts/
│       ├── mock_orders.json   ← 50 тестовых заказов
│       ├── upload-orders.js   ← Загрузка в RetailCRM
│       └── sync-orders.js     ← Синхронизация RetailCRM → Supabase
├── frontend/
│   ├── pages/index.js     ← Главная страница панели
│   ├── components/
│   │   ├── StatsCard.js   ← Карточка статистики
│   │   └── OrdersChart.js ← График заказов
│   └── styles/globals.css
└── supabase/
    └── schema.sql         ← Схема таблицы orders
```
