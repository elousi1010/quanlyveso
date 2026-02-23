# ===== Stage 1: Build với Yarn =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copy file mô tả dependencies trước để tận dụng cache
COPY package.json yarn.lock ./

# Cài dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ source vào
COPY . .

# Build static files (chỉnh lại lệnh nếu khác)
RUN yarn build

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