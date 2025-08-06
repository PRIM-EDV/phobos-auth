#!/bin/bash

# Create the destination directory if it doesn't exist
mkdir -p /run/secrets

# Copy and rename the secrets
cp /workspace/secrets/private_key.pem /run/secrets/jwt_private_key
cp /workspace/secrets/public_key.pem /run/secrets/jwt_public_key

chmod 600 /run/secrets/jwt_private_key
chmod 644 /run/secrets/jwt_public_key
