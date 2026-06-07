# Thư mục `src/ui`

Các module nhỏ hỗ trợ `src/ui.js`, không giữ profile hoặc scene toàn cục.

- `constants.js`: ánh xạ thư mục skill và metadata ba làng/gia tộc.
- `joystick.js`: bind Pointer Events, chuẩn hóa vector `x/y` từ `-1` đến `1`, gọi callback `onMove`.

Khi helper cần truy cập DOM, truyền element/callback vào hàm thay vì import trạng thái từ `ui.js`.

Màn chọn làng có nút `#character-settings` mở `#system-modal` ở chế độ `settings-only`.
Modal này dùng chung toggle BGM/SFX và nút đăng xuất với modal trong gameplay.

Icon giao diện dùng package `lucide`, được khởi tạo bằng `createIcons()` trong `startUI()`.
