#!/bin/bash

mkdir -p secrets

openssl genpkey -algorithm RSA -out secrets/private_key.pem
openssl rsa -pubout -in secrets/private_key.pem -out secrets/public_key.pem