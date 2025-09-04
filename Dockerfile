FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --no-optional --frozen-lockfile

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:24-alpine AS runner
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production --no-optional --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated


CMD [ "node","dist/main" ]