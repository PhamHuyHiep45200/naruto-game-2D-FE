# Thư mục `src/nhan-vat`

## Cấu trúc

- `configs.js`: nguồn dữ liệu nhân vật, frame animation, tốc độ, sát thương và cooldown.
- `BaseNinja.js`: hành vi chung: animation, chạy, nhảy, đánh và chưởng.
- `registry.js`: ánh xạ `config.key` sang lớp nhân vật.
- `Naruto.js`, `Sasuke.js`, ...: lớp cụ thể kế thừa `BaseNinja`.

## Thêm nhân vật

1. Thêm spritesheet vào `public/imgs/nhan-vat`.
2. Thêm avatar chọn và HUD.
3. Khai báo frame và config trong `configs.js`.
4. Tạo lớp kế thừa `BaseNinja`.
5. Đăng ký lớp trong `registry.js`.

`key` phải trùng tên asset và khóa registry. `name` là tên lưu trong profile.

`skillAnimation()` cho phép chạy khi nhân vật đang nhảy; `attackAnimation()` vẫn yêu cầu nhân vật đứng dưới đất.
