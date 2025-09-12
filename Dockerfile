FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx playwright install --with-deps

RUN npm install -g serve

COPY . .

CMD sh -c "serve -s . -l 5500 & npx playwright test"