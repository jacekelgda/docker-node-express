FROM node:7

RUN npm install supervisor -g

RUN mkdir /src

WORKDIR /src
ADD app /src/app
ADD app/package.json /src/package.json
RUN npm install

EXPOSE 443

CMD supervisor -w app app/app.js
