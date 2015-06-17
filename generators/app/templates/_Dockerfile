FROM library/node
MAINTAINER bobby@levelmoney.com

RUN mkdir /app
WORKDIR /app

ADD package.json /app/package.json
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN cp -a /tmp/node_modules /app/

ADD src /app/src
ADD server /app/server
ADD webpack.dist.config.js /app/webpack.dist.config.js
RUN npm run build

COPY server /app/server

EXPOSE 8080
CMD PORT=8080 node --harmony server/server.js
