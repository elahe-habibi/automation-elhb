FROM nrs.sandpod.ir:8138/repository/applicationplatform-docker-hosted/playwright:v1.43.1-jammy

WORKDIR /app

COPY package.json package-lock.json* ./

RUN set -ex \
    #RUN npm config set registry https://registry.npmjs.org/ \
    npm config set registry https://nrs.sandpod.ir:8138/repository/nodejs-proxy/ \
    npm ci --force --frozen-lockfile --verbose --no-audit


COPY . .

CMD ["npx", "playwright", "test"]
