# ---- Build Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# si ton build standard génère dist/<projet>/browser
RUN npm run build -- --configuration production

# ---- Nginx
FROM nginx:alpine
# 1) vider la racine nginx pour supprimer l'index par défaut
RUN rm -rf /usr/share/nginx/html/*
# 2) copier le CONTENU du dossier browser à la racine
#    le slash à la fin est important pour copier le contenu, pas le dossier
COPY --from=build /app/dist/*/browser/ /usr/share/nginx/html/
# 3) config SPA (fallback /index.html et proxy /api facultatif)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
