FROM node

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV=production

ENV SERVER_PORT=3002

EXPOSE 3002

CMD [ "npm", "run", "start" ]
