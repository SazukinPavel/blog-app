FROM node:lts-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install --force

COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "dev"]