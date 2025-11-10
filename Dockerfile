FROM node:slim

ENV NODE_ENV production
WORKDIR /src
COPY . .

RUN npm install --include dev

EXPOSE 4000

CMD ["npm", "start"]