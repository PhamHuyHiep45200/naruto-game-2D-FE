# Shinobi Làng Lá

Playable demo 2D dùng Phaser 3 và Vite.

## Chạy dự án

```bash
npm install
npm run dev
```

## Điều khiển

- `A/D` hoặc phím trái/phải: di chuyển.
- `W` hoặc phím lên: nhảy.
- `Space`: đấm; tự áp sát khi mục tiêu cách 40-150px.
- `E`: dùng chưởng trong tầm 40-300px.
- `Q`: đổi Mộc Nhân đang khóa.
- Có thể bấm trực tiếp Mộc Nhân hoặc các nút hành động trên màn hình.

Mỗi nhân vật có tốc độ, sát thương đấm, sát thương chưởng và kỹ năng riêng trong `src/nhan-vat/configs.js`. Logic Mộc Nhân, nhận sát thương và hồi sinh nằm trong `src/quai-vat/MocNhan.js`.

Toàn bộ hình ảnh nằm trong `public/imgs` và được truy cập từ mã nguồn bằng đường dẫn `/imgs/...`.
