FROM node:16.9.0-alpine

WORKDIR /app

# COPY package.json /app
COPY . /app

RUN npm install

EXPOSE 3000

ENV TZ=Brazil/East
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["npm", "run", "dev"]