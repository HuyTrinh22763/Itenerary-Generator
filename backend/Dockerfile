FROM node:20-alpine
WORKDIR /app
# ./ in copy points to the current working directory which is /app
# COPY package*.json ./ == COPY package*.json /app/
COPY package*.json ./ 
RUN npm install --include=dev
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
# npm run dev for development
# npm start for production build