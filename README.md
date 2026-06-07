# Shinobi Meridian - Frontend

Demo game 2D dùng Phaser và HTML/CSS overlay.

## Đọc code theo thứ tự

1. `requirment.md`: quy chuẩn bắt buộc về thiết bị, responsive, UI và kiến trúc.
2. `plan.md`: yêu cầu sản phẩm và thông số chiến đấu.
3. `src/README.md`: bản đồ mã nguồn.
4. `src/main.js`: khởi tạo game và UI.
5. `src/lang/LangLaScene.js`: vòng lặp gameplay.
6. `src/ui.js`: luồng đăng nhập, chọn làng/nhân vật và HUD.
7. `public/README.md`: quy ước asset.

## Chạy dự án

```bash
npm install
npm run dev
npm run build
```

Không khai báo `VITE_API_URL` thì game dùng tài khoản demo trong `localStorage`.
Khai báo biến này theo `.env.example` để dùng backend thật.

## Quy tắc refactor

- Không đổi DOM ID trong `index.html` nếu chưa cập nhật selector tại `src/ui.js`.
- Không đặt luật chiến đấu trong UI; luật chiến đấu thuộc `LangLaScene`.
- Cấu hình nhân vật nằm tại `src/nhan-vat/configs.js`.
- Mỗi thư mục có `README.md`; cập nhật tài liệu khi thêm hoặc đổi trách nhiệm file.
