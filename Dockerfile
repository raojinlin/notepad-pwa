FROM node:21.3.0

COPY . /notepad
WORKDIR /notepad

RUN npm install && npm run build

CMD ["npm", "start"]
