# How to launch simple node application with mongodb using Docker-ci

Probably the best way to get along with docker-ci is to try this example. More comrehensive tutorial with more details is coming very soon.

## Try it

Let's check out tutorials repository and run the application!

```bash
git checkout git@github.com:docker-ci/tutorials.git
cd tutorials/mongo_node
docker-ci run
```

## Docker.ci file

```python
@cleanup

@run
	name		: mymongo
	image    : mongo:2.6.9
	cmd      : mongod --smallfiles
	wait     : logs_match -> '.*waiting for connections on port 27017.*'

@build
	tag   :  mongo_node_test
	path  : ./.

# Launching our test application

@rm-f mongo_node_test
@run
	image  	: mongo_node_test
	name 		: mongo_node_test
	cmd  		: node app.js
	link   	: mymongo -> mongo
	ports 	: 8080 -> 3000
	daemon  	: false
```

## Cleaning up
You always want to clean up dead containers before staring off a new app. Usage of @clean up is self explanatory.

## Running mongo

For some reason, i chose mongo 2.6.9 - feel free to use any version you like. What i really recommend it using "wait" option, to ensure mongo is launched before proceeding further.

## Building our application

Application is really simple. It uses express.js and prints some hello world message. Each request prints out some text as well.


## Killing existing application

We want to make sure that no application with the same name is running. So, we are using @rm-f directive, which equals to "docker rm -f" command. If it does not suite you for some reason, you can first kill and then soft remove.

## Running the app

Let's specify image and tag. These options are required. Following with command (cmd:), link to mongo and public ports. 

```
# Cleaning up
# Remove all stopped containers
  docker ps -a -q
  docker rm f2b86fa89b58
  docker rm c4b38c8d98df
  docker rm 14b600f19baa
  docker rm eb2e4a80acf5
  docker rm
# Checking status of 'mymongo' container 
  docker ps -a
  Container mymongo is already running (mongo:2.6.9)
  docker ps -a
# Build image mongo_node_test on path ./. 
  docker build -t mongo_node_test ./.
Sending build context to Docker daemon 1.256 MB kB
   Sending build context to Docker daemon
   Step 0 : FROM readytalk/nodejs
   ---> 885019ee50a5
   Step 1 : WORKDIR /app
   ---> Using cache
   ---> 145801dd9d02
   Step 2 : COPY ./src/ ./
   ---> Using cache
   ---> 265bc10a11b1
   Step 3 : RUN npm install
   ---> Using cache
   ---> 8416911d3e4b
   Step 4 : EXPOSE 3000
   ---> Using cache
   ---> 6e93851856f4
   Successfully built 6e93851856f4
   
# Removing container with name 'mongo_node_test'
  docker ps -a
  'mongo_node_test' is not running
# Checking status of 'mongo_node_test' container 
  docker ps -a
  Container mongo_node_test is not running
# Launching mongo_node_test from mongo_node_test 
  docker run --link mymongo:mongo --name mongo_node_test -p 8080:3000 mongo_node_test node app.js
   Example app listening at http://0.0.0.0:3000
```

Application is up and running. You can notice that docker-ci printed each command it executed. Let's hit the ip address (in my case it's http://192.168.59.103:8080/ )

```
   Example app listening at http://0.0.0.0:3000
   Request to root.. 1432664157940
   Request to root.. 1432664165446
```

Nice and easy!


