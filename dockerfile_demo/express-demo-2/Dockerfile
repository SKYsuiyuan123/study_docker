FROM node

WORKDIR /app

COPY ./demo .

RUN npm install

ENV NODE_ENV=production

ENV TestA=TestA_value

ENV SERVER_PORT=3002

EXPOSE 3002

CMD [ "npm", "run", "start" ]
