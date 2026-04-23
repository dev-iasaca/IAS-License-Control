# syntax=docker/dockerfile:1.7

# --- Build stage ------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (cached layer)
COPY package.json package-lock.json ./
RUN npm ci

# Vite needs VITE_* env vars at build time (baked into the bundle)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Copy the rest of the source and build
COPY . .
RUN npm run build

# --- Runtime stage ----------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Replace the default site config with our SPA-aware one
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Basic container healthcheck (Easypanel picks this up)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
