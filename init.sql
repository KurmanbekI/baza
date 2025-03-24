-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  login TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Задачи
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  is_running BOOLEAN DEFAULT false,
  is_paused BOOLEAN DEFAULT false,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  employee_id INTEGER REFERENCES users(id)
);

-- Инструменты
CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Личные карточки (инструменты)
CREATE TABLE user_tools (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  tool_id INTEGER REFERENCES tools(id),
  issued_at TIMESTAMP DEFAULT NOW()
);

-- Табель
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  time_in TIME,
  time_out TIME
);

-- Склад
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name TEXT,
  unit TEXT,
  quantity REAL
);

-- Заявки снабженцу
CREATE TABLE purchase_requests (
  id SERIAL PRIMARY KEY,
  material TEXT,
  unit TEXT,
  quantity REAL,
  remaining REAL,
  status TEXT DEFAULT 'pending',
  requested_by INTEGER REFERENCES users(id),
  approved BOOLEAN DEFAULT false
);

-- Купленные материалы
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES purchase_requests(id),
  quantity REAL,
  confirmed BOOLEAN DEFAULT false
);

-- Выполненные проекты
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT,
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);

-- Задания от директора
CREATE TABLE director_tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  attachment TEXT,
  status TEXT DEFAULT 'new',
  progress TEXT,
  assigned_to INTEGER REFERENCES users(id)
);
