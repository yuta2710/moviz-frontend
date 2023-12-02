FROM node:alpine

WORKDIR /app

# Copy only package.json and package-lock.json to take advantage of Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --save-dev

RUN ls -d .next || npm run dev

# Copy the entire project
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

