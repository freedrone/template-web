FROM node:12 AS builder-node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM golang:1.14 AS builder-go
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -v -o server

FROM alpine:3
RUN apk add --no-cache ca-certificates
COPY --from=builder-go /app/server /
COPY --from=builder-node /app/dist /public
CMD ["/server"]
