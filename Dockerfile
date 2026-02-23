# ===== Stage 1: Build (npm hoặc yarn tùy lock file) =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copy file mô tả dependencies trước để tận dụng cache
# Dùng package-lock.json (npm) hoặc yarn.lock (yarn) — đổi COPY và lệnh cài/build tương ứng
COPY package.json package-lock.json ./

# Cài dependencies
RUN npm ci

# Copy toàn bộ source vào
COPY . .

# Build static files
RUN npm run build

# ===== Stage 2: Runtime (nginx rất nhẹ) =====
FROM nginx:stable-alpine

# Xóa default config để tránh leak thông tin, giảm noise
RUN rm /etc/nginx/conf.d/default.conf

# Cấu hình nginx tối giản, tối ưu static
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy output sau khi build sang nginx
# Nếu thư mục build của bạn KHÔNG phải "dist" thì sửa lại chỗ này
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]