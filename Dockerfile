FROM node:alpine

WORKDIR /app

# Copy only package.json and package-lock.json to take advantage of Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

COPY .next ./.next

EXPOSE 3000

CMD ["npm", "run", "dev"]
