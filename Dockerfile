FROM node:alpine
WORKDIR /github/workspace
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]