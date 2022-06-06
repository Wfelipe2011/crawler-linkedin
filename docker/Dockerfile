FROM node:16.9.0-alpine

WORKDIR /src

COPY package.json .

RUN yarn

COPY . ./

EXPOSE 3000

ENV TZ=Brazil/East
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["yarn", "dev"]