FROM node:lts-alpine

WORKDIR /src

COPY ./package.json ./package-lock.json /

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]
