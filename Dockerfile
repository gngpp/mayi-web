FROM node:14-alpine3.13
COPY ./ ./
RUN npm install -g nrm && nrm use taobao
RUN npm install
RUN npm run dev
