FROM node:lts-alpine

WORKDIR /app

COPY ./package.json /app/

RUN npm install --force

COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]
