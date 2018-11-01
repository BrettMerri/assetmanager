FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
RUN cd client && npm install && npm run build
EXPOSE 3000
CMD [ "npm", "run", "serve" ]
