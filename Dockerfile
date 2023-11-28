FROM node:alpine

WORKDIR /usr/src/app

COPY . .
EXPOSE 3000 
RUN npm install --save-dev
CMD ["npm", "run", "dev"]