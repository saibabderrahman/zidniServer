# Use the official Node.js 18 image as the base
FROM node:18
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN  npm install 
COPY . ./

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "run","dev"]
