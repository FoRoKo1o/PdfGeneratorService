# 1. Bazowy obraz z Node
FROM node:18-slim

# 2. Instalujemy LibreOffice i zależności
RUN apt-get update && apt-get install -y libreoffice && rm -rf /var/lib/apt/lists/*

# 3. Ustawiamy katalog roboczy
WORKDIR /app

# 4. Kopiujemy package.json i instalujemy zależności
COPY package.json ./
RUN npm install

# 5. Kopiujemy resztę plików
COPY . .

# 6. Otwieramy port
EXPOSE 3000

# 7. Startujemy serwer
CMD ["npm", "start"]
