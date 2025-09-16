# Hệ thống quản lý đại lý vé số

Một ứng dụng web quản lý đại lý vé số được xây dựng với React, TypeScript và Material-UI.

## Tính năng chính

### 🔐 Hệ thống phân quyền
- **Chủ cửa hàng**: Toàn quyền truy cập tất cả tính năng
- **Nhân viên quầy**: Chỉ thao tác nhập liệu buôn bán
- **Người bán vé dạo**: Quản lý vé số cơ bản
- Đăng nhập với vai trò khác nhau để trải nghiệm

### 📊 Dashboard tổng quan
- Thống kê tổng quan về doanh thu, chi phí, lợi nhuận
- Biểu đồ trực quan theo thời gian
- Thống kê bán vé theo tỉnh
- Hiển thị khác nhau theo vai trò người dùng

### 💰 Tính toán lợi nhuận
- Tính toán lợi nhuận theo ngày, tuần, tháng, năm
- Bộ lọc theo tỉnh và khoảng thời gian
- Biểu đồ chi tiết về doanh thu, chi phí và lợi nhuận
- Bảng chi tiết giao dịch
- **Chỉ chủ mới xem được**

### 🎫 Quản lý vé số
- Quản lý vé số theo trạng thái (có sẵn, đã bán, trả lại)
- Nhập vé mới, cập nhật thông tin vé
- Theo dõi số lượng vé tồn kho
- Quản lý người bán vé dạo

### 💳 Quản lý công nợ
- Theo dõi công nợ của đại lý và người bán
- Quản lý trạng thái thanh toán
- Cảnh báo nợ quá hạn
- Thống kê tổng nợ và có
- **Chỉ chủ mới xem được**

### 🏢 Quản lý tỉnh
- Quản lý danh sách tỉnh
- Thiết lập giá vé theo tỉnh
- Cấu hình hoa hồng cho từng tỉnh
- **Chỉ chủ mới xem được**

### 👥 Quản lý người bán vé dạo
- Quản lý thông tin người bán
- Theo dõi năng suất bán vé
- Quản lý nợ của người bán
- Thống kê hiệu suất

### 🔄 Trao đổi vé giữa các đại lý
- Tạo giao dịch trao đổi vé
- Theo dõi trạng thái giao dịch
- Quản lý lịch sử trao đổi
- **Chỉ chủ mới xem được**

### 📋 Quản lý giao dịch
- Quản lý tất cả giao dịch (mua vào, bán ra, trả lại, trao đổi)
- Theo dõi trạng thái giao dịch
- Báo cáo chi tiết giao dịch
- Biểu đồ phân tích giao dịch

### 👨‍💼 Quản lý nhân viên đứng quầy
- Quản lý thông tin nhân viên (thu ngân, quản lý, giám sát)
- Theo dõi lương, hoa hồng
- Quản lý trạng thái hoạt động
- **Chỉ chủ mới xem được**

### 🤝 Quản lý đại lý đối tác
- Quản lý thông tin đối tác (đại lý, nhà phân phối, bán buôn)
- Theo dõi hợp đồng và hạn mức tín dụng
- Quản lý nợ và thanh toán
- Quản lý tỉnh hoạt động
- **Chỉ chủ mới xem được**

### ⏰ Quản lý ca làm việc và hiệu suất
- Quản lý ca làm việc (ca sáng, ca chiều, ca đêm)
- Theo dõi hiệu suất bán vé theo ca
- So sánh hiệu suất với ca cùng kỳ
- Thống kê lời lỗ theo ca
- Biểu đồ hiệu suất 7 ngày qua
- **Chỉ chủ mới xem được**

## Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **Charts**: Recharts
- **Date Picker**: MUI X Date Pickers
- **Data Grid**: MUI X Data Grid
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Cài đặt và chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

3. **Mở trình duyệt:**
   Truy cập `http://localhost:5173`

## Cấu trúc dự án

```
src/
├── components/
│   └── Layout/
│       └── DashboardLayout.tsx    # Layout chính với sidebar
├── pages/
│   ├── Dashboard.tsx              # Trang tổng quan
│   ├── ProfitCalculation.tsx      # Tính toán lợi nhuận
│   ├── TicketManagement.tsx       # Quản lý vé số
│   ├── DebtManagement.tsx         # Quản lý công nợ
│   ├── ProvinceManagement.tsx     # Quản lý tỉnh
│   ├── SellerManagement.tsx       # Quản lý người bán
│   ├── ExchangeManagement.tsx     # Trao đổi vé
│   └── TransactionManagement.tsx  # Quản lý giao dịch
├── types/
│   └── index.ts                   # Định nghĩa types
├── data/
│   └── mockData.ts                # Dữ liệu mẫu
└── App.tsx                        # Component chính
```

## Tính năng nổi bật

### 🎨 Giao diện hiện đại
- Thiết kế responsive, tương thích mobile
- Dark/Light theme support
- Material Design 3
- Animations mượt mà

### 📊 Biểu đồ trực quan
- Line charts cho xu hướng thời gian
- Bar charts cho so sánh
- Pie charts cho phân bố
- Responsive charts

### 🔍 Tìm kiếm và lọc
- Tìm kiếm nhanh trong tất cả bảng
- Bộ lọc nâng cao
- Sắp xếp theo nhiều tiêu chí
- Pagination thông minh

### 📱 Responsive Design
- Tối ưu cho mọi kích thước màn hình
- Mobile-first approach
- Touch-friendly interface

## Hướng dẫn sử dụng

### 1. Dashboard
- Xem tổng quan về tình hình kinh doanh
- Theo dõi các chỉ số quan trọng
- Phân tích xu hướng qua biểu đồ

### 2. Quản lý vé số
- **Thêm vé mới**: Click "Thêm vé mới" và điền thông tin
- **Cập nhật vé**: Click icon "Sửa" trong bảng
- **Bán vé**: Click icon "Bán" để đánh dấu vé đã bán
- **Lọc vé**: Sử dụng các tab để xem vé theo trạng thái

### 3. Tính toán lợi nhuận
- Chọn khoảng thời gian (ngày/tuần/tháng/năm)
- Lọc theo tỉnh cụ thể
- Xem biểu đồ chi tiết
- Xuất báo cáo

### 4. Quản lý công nợ
- Thêm công nợ mới
- Cập nhật trạng thái thanh toán
- Theo dõi nợ quá hạn
- Xem báo cáo tổng hợp

## Phát triển thêm

### Thêm tính năng mới
1. Tạo component mới trong `src/pages/`
2. Thêm route trong `App.tsx`
3. Thêm menu item trong `DashboardLayout.tsx`

### Tùy chỉnh giao diện
- Chỉnh sửa theme trong `App.tsx`
- Thay đổi màu sắc và font chữ
- Thêm animations

### Tích hợp API
- Thay thế mock data bằng API calls
- Thêm error handling
- Implement loading states

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.