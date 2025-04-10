# 🚀 Setup Guide

## 📁 1. `.env` Datei erstellen

Erstelle eine `.env`-Datei im Root deines Projekts und füge Folgendes ein:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>

# Resend API (optional)
RESEND_API_KEY=<your_resend_api_key>
```

---

## 📦 2. Abhängigkeiten installieren

Installiere die benötigten Pakete für Supabase in einem Next.js-Projekt:

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install react-icons
npm install resend
npm install zod
npm install react-hook-form
```

---

## 🧪 3. Supabase CLI installieren (optional, für lokale Entwicklung und Migrations)

Falls du die Supabase CLI noch nicht installiert hast:

### 🛠 Homebrew installieren (falls noch nicht vorhanden)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew --version
```

### ✅ Shell-Konfiguration aktualisieren (Linux Beispiel)

```bash
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
```

---

## 🧰 4. Supabase CLI installieren

```bash
brew install supabase/tap/supabase
supabase --version
```

---

## 🔗 5. Supabase Projekt verlinken & initialisieren

```bash
supabase link
supabase init
```

---

## 🧱 6. Migration erstellen

```bash
supabase migration new add-posts-profile-fk
```

> ✍️ Öffne die erzeugte `.sql` Datei unter `supabase/migrations/` und **füge dort deine Änderungen hinzu** (z. B. `ALTER TABLE`, `FOREIGN KEY` etc.).

---

## ⬆️ 7. Migration anwenden (Push to DB)

```bash
supabase db push
```

---

## ✅ 8. Supabase Schema clone and copy pasta

```bash
PGPASSWORD="YOUR_PASSWORD" pg_dump --host=db.[DIRECT_CONNECTION_CODE].supabase.co --username=postgres --dbname=postgres --file=supabase_schema.sql --disable-triggers --schema-only
psql postgresql://postgres:[YOUR_PASSWORD]@db.newsupabasedb.supabase.co:5432/postgres --file=supabase_schema_only.sql --schema-only

```
