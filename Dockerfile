FROM node:23.11.0-slim AS frontend

# RUN apt update && apt install protobuf-compiler -y 

WORKDIR /opt/auth/frontend

# Install webapp source dependancies
COPY ./frontend/*.json ./
RUN npm install

# Build webapp
COPY ./frontend/public ./public
COPY ./frontend/lib ./lib
COPY ./frontend/src ./src
# COPY ./protocol ../protocol

# RUN npm run proto:generate
RUN npm run build

FROM node:23.11.0-slim AS backend
ENV TZ="Europe/Berlin"

# RUN apt update && apt install protobuf-compiler -y

WORKDIR /opt/auth/backend

# Install server source dependancies
COPY ./backend/*.json ./
RUN npm install

# Build server
COPY ./backend/src ./src
# COPY ./backend/lib ./lib
# COPY ./protocol ../protocol

# RUN npm run proto:generate

# Get webapp artifact
COPY --from=frontend /opt/auth/frontend/dist/phobos-auth/browser ./public

# Run startscript
CMD npm run start