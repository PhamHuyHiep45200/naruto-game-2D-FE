# Thư mục `src/quai-vat`

## `MocNhan.js`

Entity quái Phase 1, kế thừa `Phaser.Physics.Arcade.Sprite`.

- Lưu vị trí spawn, HP hiện tại và HP tối đa.
- `damage(amount)` trừ HP, chạy animation trúng đòn và trả về trạng thái chết.
- `respawn()` phục hồi HP và bật lại physics/body.

Scene chịu trách nhiệm hiệu ứng chết, bộ đếm 6 giây và chọn mục tiêu kế tiếp.
