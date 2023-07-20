FROM node:16.8.0

COPY . /notepad
WORKDIR /notepad

RUN npm install && npm run build

CMD ["npm", "start"]