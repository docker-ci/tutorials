FROM readytalk/nodejs
COPY ./src/ /home/src
COPY ./package.json /home/

RUN cd /home && npm install;

EXPOSE 3000

CMD ["node", "/home/src/app.js"]