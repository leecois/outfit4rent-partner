FROM node:18-alpine

WORKDIR /opt/app

RUN apk add git openssh-client

ENV NODE_ENV development

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . /opt/app

RUN npm run bootstrap -- --scope outfit4rent-panel -- --force
RUN npm run build -- --scope outfit4rent-panel

FROM node:18-alpine

COPY --from=0 /opt/app/examples/outfit4rent-panel/dist /opt/app
WORKDIR /opt/app/

ENV NODE_ENV=production

RUN npm install -g serve

CMD serve -l 5000