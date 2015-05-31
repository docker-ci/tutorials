# Launching node application that serves static files through nginx with docker-ci

At some point you want to use nginx. It's fast, reliable. In this example i will show how to build a nodejs application with nginx as a frontend server. To make a bit more complicated - let's say, we want our static files served though nginx.

Let's see the whole file
```python
@cleanup
@run
	image 	: mongo:2.6.9
	name  	: mymongo
	command	: mongod
	wait  	: logs_match -> '.*waiting for connections on port 27017.*'

@volume
	name 	: shared
	mount : ${dir}/src/public						        -> /data/public
	mount : ${dir}/shared/nginx/sites-enabled 	-> /etc/nginx/conf.d
	mount : ${dir}/shared/nginx/logs 				    -> /var/log/nginx

@build
	tag 	: testapp
	path 	: .
	cache 	: true

@rm-f testapp

@run
	env-file 	: ${dir}/env/${env|test}
	name   		: testapp
	image  		: testapp
	link   		: mymongo -> mongo
	daemon  		: true
	volume 		: shared


@rm-f nginx

@run
	image	: nginx
	name 	: nginx
	ports 	: 80 -> 80
	volume 	: shared
	link    : testapp -> testapp
```

As i mentioned before - we want to start off with cleaning up old containers

```python
@cleanup
```

Next, let's add some database to our application

```python
@run
	image 	: mongo:2.6.9
	name  	: mymongo
	command	: mongod
	wait  	: logs_match -> '.*waiting for connections on port 27017.*'
```

Check the previous tutorial, where this process is explained in more details


## Mounting main volume
Let's mount a volume that contains all the necessary nginx configuration
```python
@volume
	name 	: shared
	mount : ${dir}/src/public			-> /data/public
	mount : ${dir}/shared/nginx/sites-enabled	-> /etc/nginx/conf.d
	mount : ${dir}/shared/nginx/logs		-> /var/log/nginx
```

Our default nginx configuration looks like this:
```
server {
	listen   80;
	server_name localhost;
    location / {
        proxy_pass http://testapp:3000;
    }
    location /public {
    	root /data/;
    }
}
```

Docker updates /etc/hosts with linked containers, which makes it incredebly easy to proxy. Say, our future app will be called "testapp".

```
proxy_pass http://testapp:3000;
```

And our public data is available in /data/ folder (which is mounted in the volume 'shared')
*@copy directiv is coming soon* !

```
location /public {
    root /data/;
}
```

