# Game Requirements

Tài liệu này là quy chuẩn bắt buộc của dự án. AI hoặc lập trình viên phải đọc file này trước khi sửa code.

## Thứ tự đọc bắt buộc

1. `requirment.md`
2. `plan.md`
3. `README.md`
4. `src/README.md`
5. `README.md` trong thư mục đang chỉnh sửa

## Thiết bị và tỷ lệ màn hình

Game ưu tiên chơi ngang trên mobile.

### Mức ưu tiên

1. Mobile landscape `19.5:9` và `20:9`: thiết bị mục tiêu chính.
2. Mobile landscape `16:9`: phải hoạt động đầy đủ.
3. Tablet landscape `4:3`: phải hiển thị đầy đủ, không kéo giãn UI.
4. Portrait: hỗ trợ đăng nhập, chọn làng và modal; gameplay vẫn hoạt động nhưng không phải bố cục ưu tiên.

### Kích thước tham chiếu

- Thiết kế gameplay gốc: `1280x720`.
- Chiều cao mobile landscape thường gặp: `360px` đến `480px`.
- Touch target tối thiểu: `44x44px`.
- Nút hành động chính: khoảng `64px` đến `80px`.

## Quy tắc responsive

- Dùng `Phaser.Scale.RESIZE`; không kéo giãn canvas theo tỷ lệ cố định.
- Dùng media query kết hợp `orientation`, `aspect-ratio`, `width` và `height`.
- UI quan trọng phải nằm trong `env(safe-area-inset-*)`.
- Không đặt HUD, joystick hoặc nút hành động sát tai thỏ/camera/cạnh màn hình.
- Màn hình rộng `19.5:9–20:9` dùng thêm khoảng trống hai bên cho controls, không phóng to HUD quá mức.
- Tablet `4:3` giữ controls gần góc và giới hạn chiều rộng modal/HUD.
- Portrait phải cho phép cuộn ở màn auth/chọn nhân vật/modal khi cần.
- Không để modal, form hoặc nút chính vượt khỏi viewport.
- Form auth mobile phải giới hạn theo cả `vw` và `dvh`, tự giảm padding/font/input trên màn hình thấp.
- Khi bàn phím ảo mở, auth screen phải cuộn được và form không vượt quá chiều cao viewport còn lại.
- Trên thiết bị cảm ứng portrait, modal ưu tiên dạng bottom sheet và nút chính phải dễ chạm bằng ngón cái.
- Touch target chức năng không nhỏ hơn `44x44px`; ngoại lệ chỉ dành cho thành phần trang trí không tương tác.
- Các override mobile quan trọng phải nằm cuối `src/style.css` để tránh bị rule desktop ghi đè.

## Quy tắc UI và icon

- Icon chức năng dùng package `lucide`.
- Avatar, skill, projectile và Shuriken dùng asset riêng của game.
- DOM ID đang được `src/ui.js` sử dụng không được đổi nếu chưa cập nhật selector.
- Các nút cảm ứng phải có `aria-label`.

## Quy tắc gameplay

- Luật chiến đấu nằm trong `src/lang/LangLaScene.js` hoặc module gameplay được scene gọi.
- UI chỉ gửi lệnh và nghe event; không tự quyết định sát thương, tầm đánh hoặc cooldown.
- Cấu hình nhân vật nằm trong `src/nhan-vat/configs.js`.

## Kiểm tra bắt buộc sau thay đổi

```bash
npm run build
git diff --check
```

Khi thay đổi responsive, phải kiểm tra tối thiểu:

- `20:9` landscape.
- `19.5:9` landscape.
- `16:9` landscape.
- `4:3` tablet landscape.
- Mobile portrait.
