## Docker login / logout (to push images to your account)

        docker login

        docker logout

## [Optional] Install [goreman](https://github.com/mattn/goreman) to facilitate productivity in building and pushing images with single command

## Build and push images for all micro services using goreman `(Run command from the root workspace)`

        goreman -f Procfile-docker start

## In production like env we will mostly using a Cloud based Load balancer. However for this session I have been using Caddy as a LB and also as a reverse proxy

1. This version of Caddy needs to be installed machine wide and will be run on port 80.

2. This Caddy will be configured to forward trafic to the k8s NodePort services

3. There is another Caddy that runs inside K8s cluster whose job is to serve React application (So donot get confused)

## System level Caddy config

    ```
:80 {
  @post_postservice {
    method POST
    path /posts
  }
  reverse_proxy @post_postservice localhost:3xxxx

  @get_queryservice {
    method GET
    path /posts
  }
  reverse_proxy @get_queryservice localhost:3xxxx

  @post_commentservice {
    method POST
    path /posts/*
  }
 
 reverse_proxy @post_commentservice localhost:3xxxx

  @get_all {
    method GET
    path *
  }
  reverse_proxy @get_all localhost:3xxxx
}


    ```

## Kubernetes

### Using [K0s](https://docs.k0sproject.io/) distribution for this session.

### All k8s commands will be run inside the k8s directory