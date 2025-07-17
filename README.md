# APP Booking
Приложение для панелей бронирования, отображающее статус помещения и позволяющее совершать быстрые бронирования.
## Работа с исходным кодом
1. Выполните команду `npm install` для установки всех зависимостей.
2. Для запуска проекта в режиме разработки выполните команду `npm start`
## Сборка проекта
Есть два варианта сборки apk приложения:
1. Сборка через облако с помощью expo:  
`npx eas build --platform android --profile preview`  
2. На локальной машине (быстрее):  
`npx eas build --platform android --local --profile preview`  
При успешной сборке apk, в корне проекта окажется файл.

# Настройка CI/CD через GitHub

## 1. Подготовка сервера (VDS)

**Выполните на сервере под root:**

```sh
apt update
apt install -y docker.io nginx

useradd -m -s /bin/bash deploy
usermod -aG docker deploy

mkdir -p /var/www/app-booking
chown deploy:deploy /var/www/app-booking
```

---

## 2. Настройка SSH-доступа для пользователя deploy

**На сервере под root:**

```sh
cd /home/deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chown deploy:deploy /home/deploy/.ssh
```

**На вашей локальной машине:**

1. Сгенерируйте SSH-ключ:
   ```sh
   ssh-keygen -t ed25519 -C "github-cicd"
   ```
2. Скопируйте содержимое `id_ed25519.pub`.

**На сервере под root:**

```sh
echo "ВАШ_ПУБЛИЧНЫЙ_КЛЮЧ" >> /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

---

## 3. Добавьте секреты в GitHub

В репозитории:  
`Settings` → `Secrets and variables` → `Actions`:

- `VDS_HOST` — IP или домен сервера
- `VDS_USER` — deploy
- `VDS_KEY` — приватный SSH-ключ (содержимое файла `id_ed25519`)
- `VDS_PATH` — `/var/www/app-booking`

---

## 4. Dockerfile и nginx.conf в проекте

**В корне проекта:**

### Dockerfile

```Dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8085
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {}

http {
    server {
        listen 8085;
        server_name _;

        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

---

## 5. Внешний nginx на сервере (reverse proxy + SSL)

**На сервере под root:**

```sh
apt install -y certbot python3-certbot-nginx
```

Создайте конфиг для nginx:

```sh
cat > /etc/nginx/sites-available/app-booking <<EOF
server {
    listen 80;
    server_name your-domain.ru;
    location / {
        proxy_pass http://localhost:8085;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/app-booking /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Получите и настройте SSL:

```sh
certbot --nginx -d your-domain.ru
```

---

## 6. GitHub Actions workflow

**Создайте файл `.github/workflows/cicd.yml`:**

```yaml
name: CI/CD

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    env:
      APP_NAME: ${{ github.event.repository.name }}

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - run: |
          npm version patch --no-git-tag-version
          git config --global user.email "ci@example.com"
          git config --global user.name "CI Bot"
          git add package.json package-lock.json
          git commit -m "chore: bump version [skip ci]" || echo "No changes to commit"
          git push

      - run: |
          npm install -g expo-cli
          expo build:android --non-interactive --no-wait

      - run: tar czf source.tar.gz .

      - uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VDS_HOST }}
          username: ${{ secrets.VDS_USER }}
          key: ${{ secrets.VDS_KEY }}
          source: "source.tar.gz"
          target: ${{ secrets.VDS_PATH }}

      - uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.VDS_HOST }}
          username: ${{ secrets.VDS_USER }}
          key: ${{ secrets.VDS_KEY }}
          script: |
            cd ${{ secrets.VDS_PATH }}
            tar xzf source.tar.gz
            docker build -t $APP_NAME:latest .
            docker stop $APP_NAME || true
            docker rm $APP_NAME || true
            docker run -d --name $APP_NAME -p 8085:8085 $APP_NAME:latest
```

---

## 7. Как это работает

- **Пуш в master** → GitHub Actions:
  - Увеличивает версию.
  - Собирает APK.
  - Архивирует проект и отправляет на сервер.
  - На сервере: собирает Docker-образ с именем и контейнером, совпадающим с названием репозитория (`app-booking`), перезапускает контейнер.
- **nginx** на сервере проксирует 80/443 на 8085, SSL автоматически обновляется.

---