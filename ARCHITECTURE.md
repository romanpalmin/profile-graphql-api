# Архитектура

> Здесь описана схема базы данных. Слои приложения, обработку запроса, решение проблемы N+1 и запуск см. в [README.md](README.md), разделы «Архитектура» и «Решения».

## ER-диаграмма

Одна «визитка» (`profile`) и связанные с ней данные. Два уровня вложенности: `profile → experience → achievement`. Внешние ключи имеют индексы (Postgres не создаёт их сам), `ON DELETE CASCADE` удаляет дочерние записи вместе с профилем.

![ER-диаграмма схемы БД](diagrams/er-diagram.png)

<details>
<summary>Исходник диаграммы (Mermaid)</summary>

```mermaid
erDiagram
    profile ||--o{ link : "profile_id"
    profile ||--o{ skill : "profile_id"
    profile ||--o{ experience : "profile_id"
    profile ||--o{ project : "profile_id"
    experience ||--o{ achievement : "experience_id"

    profile {
        int id PK
        string slug UK
        string name
        string title
        string description
        string location "nullable"
    }
    link {
        int id PK
        int profile_id FK
        string label
        string url
        int sort_order
    }
    skill {
        int id PK
        int profile_id FK
        string name
        string category
        skill_level level "nullable"
        string note "nullable"
        int sort_order
    }
    experience {
        int id PK
        int profile_id FK
        string company
        string position
        date start_date
        date end_date "nullable"
        int sort_order
    }
    achievement {
        int id PK
        int experience_id FK
        string text
        int sort_order
    }
    project {
        int id PK
        int profile_id FK
        string name
        string url
        string description
        string_array technologies
        int sort_order
    }
```

</details>

Схема описана в [`prisma/schema.prisma`](prisma/schema.prisma), миграции лежат в [`prisma/migrations`](prisma/migrations).
