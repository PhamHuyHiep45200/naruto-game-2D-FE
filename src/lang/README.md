# Thư mục `src/lang`

## `LangLaScene.js`

Scene gameplay chính có key `lang-la`.

### Vòng đời

- `preload()`: tải map, projectile, spritesheet nhân vật và Mộc Nhân.
- `create()`: tạo input, người chơi, quái, camera và khóa mục tiêu.
- `update()`: đọc input bàn phím/joystick, di chuyển và cập nhật mũi tên mục tiêu.

### API cho UI

- `applyProfile(profile)`: áp nhân vật và cấp kỹ năng từ hồ sơ.
- `setGameplayEnabled(enabled)`: khóa gameplay ngoài màn hình game.
- `setVirtualMove(x, y)`: nhận vector joystick.
- `punch()`, `castSkill()`, `nextTarget()`: lệnh hành động.

Chưởng được phép thi triển khi đang nhảy. Projectile chưởng dùng physics homing, tự cập nhật vận tốc để đuổi mục tiêu đã khóa cho tới khi trúng, mục tiêu chết hoặc hết thời gian tồn tại.

### Event phát ra

`character`, `enemyHp`, `notice`, `cooldown`, `hit`, `kill`.

Luật chiến đấu mới phải đặt tại scene hoặc module gameplay được scene gọi, không đặt trong `ui.js`.
