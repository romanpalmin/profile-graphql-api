#!/bin/sh
# Подготовка базы и запуск приложения. set -e: любая ошибка останавливает контейнер (лучше упасть, чем стартовать с пустой базой).
set -e

echo "Применяю миграции..."
node_modules/.bin/prisma migrate deploy

echo "Заполняю базу (seed, идемпотентный)..."
node dist/seed/run-seed.js

echo "Запускаю приложение..."
# exec заменяет shell процессом node: сигналы остановки (docker stop) доходят до приложения напрямую.
exec node dist/main.js
