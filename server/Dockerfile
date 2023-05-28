FROM node:lts-alpine

WORKDIR /src

COPY ./package.json ./package-lock.json /src/

RUN npm install --force

COPY . /src/

EXPOSE 3000

CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]
