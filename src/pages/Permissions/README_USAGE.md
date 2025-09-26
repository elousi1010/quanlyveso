# 🎯 Hướng dẫn sử dụng API `/api/v1/permissions/set-for-user/{id}`

## 📋 Tổng quan

Chúng ta đã tạo 4 tính năng chính để sử dụng API gán quyền cho user:

1. **User Permission Assignment** - Gán quyền cho 1 user
2. **Bulk Permission Assignment** - Gán quyền hàng loạt cho nhiều user
3. **Permission Matrix** - Ma trận quyền hạn dạng bảng
4. **Permission Templates** - Template quyền theo role

## 🚀 Cách sử dụng

### 1. **User Permission Assignment**

```typescript
// Trong component của bạn
import { UserPermissionAssignment } from '@/pages/Permissions/components';

const [userAssignmentOpen, setUserAssignmentOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

// Mở dialog gán quyền cho user
const handleAssignToUser = (user) => {
  setSelectedUser(user);
  setUserAssignmentOpen(true);
};

// Sử dụng component
<UserPermissionAssignment
  open={userAssignmentOpen}
  onClose={() => setUserAssignmentOpen(false)}
  user={selectedUser}
  onSuccess={() => {
    console.log('Gán quyền thành công!');
    // Refresh data hoặc hiển thị thông báo
  }}
/>
```

### 2. **Bulk Permission Assignment**

```typescript
// Trong component của bạn
import { BulkPermissionAssignment } from '@/pages/Permissions/components';

const [bulkAssignmentOpen, setBulkAssignmentOpen] = useState(false);
const [selectedUsers, setSelectedUsers] = useState([]);

// Mở dialog gán quyền hàng loạt
const handleBulkAssign = () => {
  setBulkAssignmentOpen(true);
};

// Sử dụng component
<BulkPermissionAssignment
  open={bulkAssignmentOpen}
  onClose={() => setBulkAssignmentOpen(false)}
  selectedUsers={selectedUsers}
  onSuccess={() => {
    console.log('Gán quyền hàng loạt thành công!');
    // Refresh data hoặc hiển thị thông báo
  }}
/>
```

### 3. **Permission Matrix**

```typescript
// Trong component của bạn
import { PermissionMatrix } from '@/pages/Permissions/components';

const [users, setUsers] = useState([]);

// Sử dụng component
<PermissionMatrix
  users={users}
  onSuccess={() => {
    console.log('Cập nhật ma trận quyền hạn thành công!');
    // Refresh data hoặc hiển thị thông báo
  }}
/>
```

### 4. **Permission Templates**

```typescript
// Trong component của bạn
import { PermissionTemplates } from '@/pages/Permissions/components';

// Sử dụng component
<PermissionTemplates />
```

## 🔧 API Endpoints được sử dụng

### 1. **Assign permission to user** ✅ **CÓ THẬT**
```typescript
PUT /api/v1/permissions/set-for-user/{permission_id}
Body: { user_id: string }
```
**Lưu ý:** `{permission_id}` là ID của quyền hạn, body chứa `user_id` để gán quyền cho user đó.

### 2. **Bulk assign permissions** ❌ **MOCK DATA**
```typescript
POST /api/v1/permissions/bulk-assign
Body: {
  user_ids: string[],
  permission_ids: string[],
  operation: 'assign' | 'remove' | 'replace'
}
```
**Lưu ý:** API này chưa tồn tại, hiện đang sử dụng mock implementation.

### 3. **Get user permissions** ❌ **MOCK DATA**
```typescript
GET /api/v1/users/{id}/permissions
Response: Permission[]
```
**Lưu ý:** API này chưa tồn tại, hiện đang sử dụng mock implementation.

### 4. **Permission templates** ❌ **MOCK DATA**
```typescript
GET /api/v1/permissions/templates
POST /api/v1/permissions/templates
PUT /api/v1/permissions/templates/{id}
DELETE /api/v1/permissions/templates/{id}
POST /api/v1/permissions/apply-template/{userId}/{templateId}
```
**Lưu ý:** Các API này chưa tồn tại, hiện đang sử dụng mock implementation.

## 📱 Giao diện người dùng

### **Menu Permission trong Sidebar:**
- **📋 Danh sách quyền hạn** (`/permissions`) - Quản lý quyền hạn cơ bản
- **🔲 Ma trận quyền hạn** (`/permissions/matrix`) - Quản lý quyền dạng bảng
- **📋 Template quyền hạn** (`/permissions/templates`) - Quản lý template theo role

### **Trang Danh sách quyền hạn:**
- Hiển thị danh sách tất cả quyền hạn
- Có nút "Gán quyền hàng loạt" khi chọn nhiều quyền
- Có thể tạo, sửa, xóa quyền hạn

### **Trang Ma trận quyền hạn:**
- Hiển thị dạng bảng: User x Permission
- Có thể tick/untick quyền cho từng user
- Có thể chọn tất cả quyền cho 1 user
- Có thể chọn tất cả user cho 1 quyền

### **Trang Template quyền hạn:**
- Hiển thị danh sách template theo role
- Có thể tạo, sửa, xóa template
- Có thể áp dụng template cho user

## 🎨 Tính năng nổi bật

### **Responsive Design**
- Tối ưu cho màn hình 13-inch laptop
- Sử dụng horizontal scroll cho bảng lớn
- Compact layout và spacing

### **User Experience**
- Search và filter real-time
- Loading states và error handling
- Confirmation dialogs
- Success/error notifications

### **Performance**
- Lazy loading cho các component lớn
- Memoization cho expensive calculations
- Optimized re-renders

## 🔄 Workflow sử dụng

1. **Gán quyền cho 1 user:**
   - Vào menu "Permission" → "Danh sách quyền hạn"
   - Chọn user từ danh sách
   - Click "Gán quyền"
   - Chọn quyền cần gán
   - Click "Lưu thay đổi"

2. **Gán quyền hàng loạt:**
   - Vào menu "Permission" → "Danh sách quyền hạn"
   - Chọn nhiều user
   - Click "Gán quyền hàng loạt"
   - Chọn quyền và thao tác (gán/xóa/thay thế)
   - Click "Thực hiện"

3. **Sử dụng ma trận:**
   - Vào menu "Permission" → "Ma trận quyền hạn"
   - Tick/untick quyền cho các user
   - Click "Lưu thay đổi"

4. **Sử dụng template:**
   - Vào menu "Permission" → "Template quyền hạn"
   - Tạo template mới hoặc sử dụng template có sẵn
   - Áp dụng template cho user

## 🚨 Lưu ý quan trọng

1. **API Integration:** Chỉ có API `set-for-user` là thật, các API khác đang sử dụng mock data
2. **Error Handling:** Tất cả component đều có error handling
3. **Loading States:** Hiển thị loading khi đang xử lý
4. **Validation:** Kiểm tra dữ liệu trước khi gửi API
5. **Responsive:** Tối ưu cho màn hình nhỏ
6. **Mock Data:** Các tính năng template, bulk assign, matrix đang sử dụng mock data

## 🔄 Mock Data Implementation

### **Tính năng sử dụng Mock Data:**
- ❌ **Bulk Permission Assignment** - Sử dụng mock implementation
- ❌ **Permission Matrix** - Sử dụng mock implementation  
- ❌ **Permission Templates** - Sử dụng mock implementation
- ❌ **Get User Permissions** - Sử dụng mock implementation

### **Tính năng sử dụng API thật:**
- ✅ **Set permissions for user** - Sử dụng API thật
- ✅ **Permission Management** - Sử dụng API thật

### **Cách thay thế Mock Data:**
Khi API thật được implement, chỉ cần thay thế các function trong `permissionApi.ts`:

```typescript
// Thay thế mock implementation bằng API thật
getTemplates: async (): Promise<PermissionTemplate[]> => {
  const response = await api.get(`${API_BASE}/permissions/templates`);
  const apiResponse = response as ApiResponse<PermissionTemplate[]>;
  return apiResponse.data;
},
```

## 🎯 Kết quả

Với 4 tính năng này, bạn có thể:
- ✅ Gán quyền cho 1 user dễ dàng
- ✅ Gán quyền hàng loạt cho nhiều user
- ✅ Quản lý quyền dạng ma trận trực quan
- ✅ Sử dụng template để gán quyền nhanh
- ✅ Tối ưu cho màn hình 13-inch laptop
- ✅ Responsive và user-friendly
