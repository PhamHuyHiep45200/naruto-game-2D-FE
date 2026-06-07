# Thư mục `src`

## Luồng khởi động

`main.js` tạo Phaser từ `gameConfig.js`, chờ scene sẵn sàng rồi gọi `startUI()` từ `ui.js`.

## File

- `main.js`: entrypoint mỏng, chỉ khởi tạo và nối Phaser với UI.
- `gameConfig.js`: cấu hình renderer, physics, scale và danh sách scene.
- `api.js`: adapter dữ liệu. Dùng REST API khi có `VITE_API_URL`, nếu không dùng `localStorage`.
- `ui.js`: điều phối màn hình auth, chọn làng/nhân vật, HUD, modal, cooldown và lưu tiến trình.
- `style.css`: toàn bộ giao diện HTML overlay và responsive.

## Thư mục con

- `lang/`: scene và gameplay map.
- `nhan-vat/`: cấu hình, registry và lớp nhân vật.
- `quai-vat/`: entity quái vật.
- `ui/`: helper và cấu hình UI không phụ thuộc trạng thái toàn cục.

## Ranh giới trách nhiệm

UI chỉ gửi lệnh như `scene.punch()` và nghe event từ scene. Scene quyết định khoảng cách, sát thương, cooldown, mục tiêu và hồi sinh.
