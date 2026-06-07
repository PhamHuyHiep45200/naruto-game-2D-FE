# KẾ HOẠCH TRIỂN KHAI PHASE 1: SHINOBI MERIDIAN RPG (DEMO PLAYABLE)
*(Cập nhật theo đóng góp ý kiến của người dùng - Đã tối ưu hóa 100% cho App Store và tích hợp các hiệu ứng Game Loop nâng cao)*

Tài liệu này đặc tả cấu trúc hệ thống và cung cấp 5 bộ Prompt chuyên dụng cho các AI Code Generator (như Cursor, Windsurf, Codex) để tự động sinh mã nguồn cho Giai đoạn 1 của game.

---

## 1. KIẾN TRÚC KỸ THUẬT TỐI ƯU (PHASER & HTML5 OVERLAY)

Để giao diện hiển thị sắc nét, co giãn (responsive) mượt màng trên mọi màn hình điện thoại mà không bị gián đoạn hiệu năng, game được chia làm 2 lớp:

1.  **Lớp Game Layer (Phaser.js):** Chạy bên dưới, chịu trách nhiệm render màn hình ngang 2D, nhân vật chạy nhảy vật lý, quái vật và các hiệu ứng chiến đấu. Lớp này chịu trách nhiệm hiển thị:
    *   **Nền động màn hình Đăng Nhập:** Lớp mây trôi lững lờ hoặc hạt phát sáng bay lơ lửng trôi nổi chậm ở cảnh nền phía sau form đăng nhập, màn đăng nhập và tạo sử dụng ảnh authen.jpg.
    *   **Hệ thống hiển thị Khóa mục tiêu:** Vẽ một **Mũi tên đỏ nhỏ phát sáng (glowing red arrow)** lơ lửng trên đầu quái vật hiện đang bị khóa mục tiêu (nhấp nhô nhẹ lên xuống).
    *   **Hiệu ứng Đánh trúng & Rơi Chackra:** Khi người chơi đấm hoặc chưởng trúng quái, từ quái vật sẽ văng ra các **hạt năng lượng màu xanh dương phát sáng (green Chackra particles)** tự động bay hút về phía nhân vật. Đồng thời, trên đầu nhân vật hiển thị chữ số **"+X"** màu xanh lá bay lên.
    *   **Hiệu ứng Tiêu diệt quái (Substitution Poof):** Khi quái hết máu, quái vật lập tức biến mất trong một làn khói trắng hình đám mây nhỏ đặc trưng của ninja.
    *   **Hồi sinh quái vật:** Quái vật sau khi bị tiêu diệt sẽ tự động hồi sinh tại vị trí ban đầu sau **6 giây**.
    *   **Sát thương nhảy số (Floating Damage Numbers):** Hiển thị số sát thương nhảy lên trên đầu quái vật khi bị trúng đòn (Màu trắng cho đấm thường, màu đỏ cam phát sáng cho chí mạng - tỷ lệ mặc định 5%).
    *   **Cơ chế Tự động áp sát (Auto-dash):** Khi người chơi bấm Đấm và đang focus vào quái khi đang cách quái từ 40px đến 150px, nhân vật tự động lướt nhanh áp sát quái dưới 40px rồi ra đòn.
2.  **Lớp UI Layer (HTML5/CSS3 Overlay):** Phủ lên phía trên Phaser Canvas, chịu trách nhiệm hiển thị form đăng nhập, bảng chọn nhân vật, bảng chỉ số/kỹ năng/nhiệm vụ/cài đặt và các nút điều khiển di động (Virtual Controls).

---

## 2. BẢNG PHÂN CHIA HỆ NHÂN VẬT AN TOÀN BẢN QUYỀN (3 NHÂN VẬT/GIA TỘC)

Khi đăng ký nhân vật mới, người chơi được lựa chọn 1 trong 3 Gia tộc với danh sách nhân vật đã được biến đổi tên và ngoại hình hợp pháp để tránh vi phạm bản quyền:

1.  **GIA TỘC SEN-JIN (Màu chủ đạo: Vàng Kim - Gold | Hệ Phong/Cân bằng):**
    *   *Tên nhân vật:* **Naru Uzumaka**, **Mina Namikaz**, **KKshi Senpai**.
    *   *Đặc trưng chưởng (Skill 2):* **Chưởng rasengan** (ảnh rasengan trong folder chuong).
2.  **GIA TỘC UCHY-HA (Màu chủ đạo: Đỏ Crimson | Hệ Hỏa/Sát thương lớn):**
    *   *Tên nhân vật:* **Sasuk Uchyha**, **Itach Uchyha**, **Obyto Uchyha**.
    *   *Đặc trưng chưởng (Skill 2):* **Bắn Hỏa Cầu Rồng** (ảnh chuong-rong trong folder chuong).
3.  **GIA TỘC HYU-GA (Màu chủ đạo: Trắng/Tím Oải Hương | Hệ Nhu Quyền/Tốc độ cao):**
    *   *Tên nhân vật:* **Hinat Hyuga**, **Sakur Haron**, **Tsunad Tôn Giả**.
    *   *Đặc trưng chưởng (Skill 2):* **Chưởng khí đầu hổ** (ảnh chuong-ho trong folder chuong).

---

## 3. BẢNG THÔNG SỐ CÂN BẰNG CHIẾN ĐẤU & KHÓA MỤC TIÊU (PHASE 1)

Mặc định tỉ lệ chí mạng là **10%** cho cả đấm và chưởng ở mọi hệ phái (Sát thương chí mạng nhân 1.5 lần sát thương gốc, nhảy số màu đỏ cam phát sáng).

### A. Cơ chế Khóa & Chuyển Mục Tiêu (Target Lock-On)
*   **Tự động khóa**: Hệ thống tự động chọn quái vật gần nhân vật nhất làm mục tiêu bị khóa khi bắt đầu hoặc khi quái vật bị khóa trước đó bị tiêu diệt.
*   **Chọn thủ công**: Người chơi chạm trực tiếp vào bất kỳ quái vật nào trên màn hình để thay đổi mục tiêu khóa khi mục tiêu hiển thị trong mang hình.
*   **Chuyển đổi xoay vòng**: Sử dụng nút phụ Tâm ngắm ở cụm phím ảo bên phải để đổi khóa mục tiêu sang quái vật tiếp theo.
*   **Hiển thị**: Mũi tên đỏ nhỏ phát sáng trên đầu quái bị khóa. Đòn đánh ĐẤM (áp sát) và CHƯỞNG (bắn hướng) luôn ưu tiên tấn công quái vật đang bị khóa này.

### B. Chỉ số đòn ĐẤM (Kỹ năng 1 - Không tốn Mana)

*   **Cơ chế khoảng cách ĐẤM**:
    *   *Cự ly cận chiến hiệu quả*: **Dưới 40px** (tung đòn đấm tại chỗ hướng về phía quái bị khóa).
    *   *Cự ly tự động áp sát (Auto-dash)*: **Từ 40px đến 150px**. Khi nhấn ĐẤM nếu quái bị khóa nằm trong cự ly này, nhân vật chạy đến áp sát quái (< 40px) rồi mới thực hiện đấm.
    *   *Cự ly đấm gió*: **Trên 150px** hoặc không có quái (nhân vật đứng im và đấm không được thực hiện).

| Gia Tộc | Xếp hạng sát thương | Cooldown (Hồi chiêu) | Sát thương Cấp 1 | Sát thương Cấp 9 | Công thức sát thương |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HYU-GA** | Hạng 3 (Yếu nhất) | **0.25 giây** (Nhanh nhất) | **80** | **240** | `80 + (Cấp - 1) * 20` |
| **SEN-JIN** | Hạng 2 (Vừa) | **0.30 giây** (Trung bình) | **95** | **255** | `95 + (Cấp - 1) * 20` |
| **UCHY-HA** | Hạng 1 (Mạnh nhất) | **0.35 giây** (Chậm nhất) | **110** | **270** | `110 + (Cấp - 1) * 20` |

### C. Chỉ số CHƯỞNG (Kỹ năng 2 - 0 Mana ở Phase 1)

*   **Cơ chế khoảng cách CHƯỞNG**:
    *   *Cự ly bắn hiệu quả*: **Từ 40px đến 300px** (áp dụng giống nhau cho cả 3 gia tộc, bay thẳng nhắm vào quái bị khóa).
    *   *Vùng mù cận chiến (Dead Zone)*: **Dưới 40px**. Nếu đứng sát quái dưới 40px, thì buộc người chơi phải tự di chuyển lùi ra rồi mới chưởng.

| Gia Tộc | Tên chiêu thức | Xếp hạng sát thương | Cooldown (Hồi chiêu) | Sát thương Cấp 1 | Sát thương Cấp 9 | Công thức sát thương |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HYU-GA** | **Chưởng Đầu Hổ** | Hạng 3 (Yếu nhất) | **1.5 giây** (Nhanh nhất) | **200** | **600** | `200 + (Cấp - 1) * 50` |
| **SEN-JIN** | **Shuriken Gió** | Hạng 2 (Vừa) | **2.0 giây** (Trung bình) | **250** | **730** | `250 + (Cấp - 1) * 60` |
| **UCHY-HA** | **Bắn Hỏa Cầu** | Hạng 1 (Mạnh nhất) | **2.5 giây** (Chậm nhất) | **350** | **990** | `350 + (Cấp - 1) * 80` |

---

## 4. 5 BỘ PROMPT CHI TIẾT DÀNH CHO AI CODE GENERATOR

### PROMPT 1: MÀN HÌNH ĐĂNG NHẬP & ĐĂNG KÝ (UI & GAME BACKGROUND LAYER)
```text
Hãy lập trình một giao diện Đăng nhập và Đăng ký (Login & Register) bằng HTML5, CSS3 và Javascript thuần (Vanilla JS) để phủ lên trên màn hình game di động, kết hợp với Phaser render nền động:
1. Thiết kế form đăng nhập theo phong cách tối giản, sang trọng (Glassmorphic) với nền mờ đục (backdrop-filter: blur(10px)), viền phát sáng nhẹ, tông màu đen-xám bóng đêm.
2. Nền động phía sau (được render bằng Phaser bên dưới overlay): Tạo hiệu ứng lớp mây trôi lững lờ chậm rãi ngang qua màn hình, kết hợp với các hạt phát sáng mờ ảo bay bổng nhẹ nhàng từ dưới lên trên để tạo chiều sâu thị giác cao cấp.
3. Có Form Đăng Nhập gồm: Tên tài khoản, Mật khẩu, nút "Đăng Nhập", và một nút link chuyển đổi "Đăng ký tài khoản mới".
4. Có Form Đăng Ký gồm: Tên tài khoản, Email, Mật khẩu, Xác nhận mật khẩu, nút "Đăng Ký", và một nút link chuyển đổi "Quay lại Đăng nhập".
5. Có hiệu ứng chuyển cảnh mượt mà giữa hai form (Fade-in/out). Có kiểm tra dữ liệu đầu vào cơ bản (Validation: Mật khẩu tối thiểu 6 ký tự, email đúng định dạng).
6. Khi người dùng nhấn nút Đăng Nhập hoặc Đăng Ký thành công, ẩn toàn bộ giao diện này đi bằng hiệu ứng mờ dần (opacity: 0) và gọi hàm Javascript callback: `onLoginSuccess(username)`.
7. Màn đăng nhập và tạo sử dụng ảnh authen.jpg
```

---

### PROMPT 2: MÀN HÌNH CHỌN NHÂN VẬT (CHARACTER SELECTION)
```text
Hãy lập trình một màn hình Chọn Nhân Vật bằng HTML5/CSS3 và Javascript để người chơi lựa chọn Hệ phái (Gia tộc) và 1 trong 3 Avatar tương ứng trước khi vào game.
1. Giao diện được chia thành 3 Cột lớn đại diện cho 3 Gia tộc, mỗi cột có màu sắc chủ đạo phát sáng (glow) riêng biệt:
   - Cột 1: GIA TỘC HYU-GA (Màu chủ đạo: Trắng/Tím Oải Hương). Danh sách 3 nhân vật lựa chọn: Hinat Hyuga, Sakur Haron, NeyJiii tương đương với ảnh ở trong folder public/imgs/avatar/select-actor(hinata, sakura, neyji).
   - Cột 2: GIA TỘC SEN-JIN (Màu chủ đạo: Vàng Kim - Gold). Danh sách 3 nhân vật lựa chọn: Naru Uzumaka, Mina Namikaz, KKshi Senpai tương đương với ảnh ở trong folder public/imgs/avatar/select-actor(naruto, minato, kakashi).
   - Cột 3: GIA TỘC UCHY-HA (Màu chủ đạo: Đỏ Crimson). Danh sách 3 nhân vật lựa chọn: Sasuk Uchyha, Itach Uchyha, Obyto Uchyha tương đương với ảnh ở trong folder public/imgs/avatar/select-actor(sasuke, itachi, obito).
2. Dưới mỗi cột có danh sách 3 ảnh đại diện hình tròn (Avatar) của các nhân vật tương ứng. Khi người chơi click vào ảnh nhân vật nào, ảnh đó sẽ phát sáng viền và hiển thị mô tả ngắn về đặc tính gia tộc (Hyu-ga: Tấn công tốc độ cao; Sen-jin: Cân bằng công thủ; Uchy-ha: Sát thương bộc phát cực lớn).
3. Phía dưới cùng là nút "BẮT ĐẦU VÀO LÀNG". Khi nhấn nút, lưu thông tin nhân vật đã chọn (Gia tộc và tên nhân vật) vào biến `selectedCharacter` và gọi hàm `startGame(selectedCharacter)`.
4. Thiết kế responsive tự động chuyển thành dạng thanh cuộn ngang (Swipeable Cards) nếu mở trên màn hình điện thoại đứng.
```

---

### PROMPT 3: MODAL NHÂN VẬT HỢP NHẤT DẠNG TAB (SYSTEM TABBED MODAL)
```text
Hãy lập trình một hệ thống bảng điều khiển hợp nhất dạng Tab (Tabbed Modal) bằng HTML5, CSS3 và Javascript:
1. Thiết kế duy nhất 1 Nút bấm tròn nhỏ ở góc trái màn hình (dưới phần HUD nhân vật) để làm nút "Bảng Menu". Khi click vào nút này, mở một Modal lớn ở chính giữa màn hình.
2. Giao diện Modal lớn được chia làm 3 Tab ở trên cùng để người dùng click chuyển đổi qua lại:
   - TAB 1: NHIỆM VỤ (Quest Tab):
     * Hiển thị Tên Nhiệm Vụ hiện tại (Ví dụ: "Nhiệm vụ 2: Bạo Loạn Thực Vật Biến Dị").
     * Dòng mô tả nhiệm vụ: "Tiêu diệt 10 Mộc Nhân tại bìa rừng".
     * Thanh tiến trình (Progress Bar) hiển thị số lượng đạt được: Đã diệt 4 / 10.
   - TAB 2: KỸ NĂNG (Skill Tab):
     * Ở góc trên hiển thị điểm tiềm năng nâng cấp: "Điểm Chackra tích lũy: 500" (Điểm này được cộng dồn từ các hạt năng lượng màu xanh rơi ra khi đánh trúng quái trên bản đồ).
     * Hiển thị danh sách chỉ 2 kỹ năng cơ bản đang có:
       1. ĐẤM (Thể thuật cận chiến): Hiển thị cấp độ hiện tại (Cấp X) và nút "Nâng cấp" tiêu tốn Điểm Chackra. Sát thương tăng theo cấp độ (Cấp 1-9) tương ứng từng phái.
       2. CHƯỞNG (Chiêu năng lượng đặc trưng của từng gia tộc - Ví dụ: Chưởng Đầu Hổ cho Hyu-ga, Shuriken gió cho Sen-jin, Bắn Hỏa Cầu cho Uchy-ha): Hiển thị cấp độ hiện tại (Cấp Y) và nút "Nâng cấp" tiêu tốn Điểm Chackra.
   - TAB 3: CÀI ĐÀT (Settings Tab):
     * Cung cấp hai nút gạt bật/tắt (Toggle switches) trực quan:
       1. Âm thanh nền (BGM): Bật/Tắt nhạc nền của game.
       2. Hiệu ứng âm thanh (SFX): Bật/Tắt âm thanh khi nhấn nút, ra đòn, trúng quái.
       3. Hiển thị nút đăng xuất game và có confirm khi chọn đăng xuất.
     * Thiết kế dạng thanh trượt công tắc tròn mượt mà (Toggle Switch), phát sáng màu xanh lá khi "ON" và màu xám khi "OFF".
3. Quy tắc Đóng Modal: Chỉ có duy nhất hành động click vào nút dấu "X" ở góc trên bên phải của Modal mới được đóng bảng. Khóa hoàn toàn tính năng click ra ngoài khoảng trống hoặc phím ESC để đóng (bắt buộc phải click nút X).
4. Thiết kế Modal tông màu tối mờ kính (dark glassmorphism), có hiệu ứng phóng to dần khi mở (scale-up transition).
```

---

### PROMPT 4: HIỂN THỊ CHỈ SỐ NHÂN VẬT (HUD DISPLAY)
```text
Hãy lập trình thanh trạng thái nhân vật (HUD - Heads Up Display) nằm cố định ở góc trên bên trái màn hình bằng HTML5 và CSS3:
1. HUD gồm:
   - Một khung hình đại diện (Avatar) hình tròn của nhân vật đang chơi, viền phát sáng theo màu sắc gia tộc (Hyu-ga: Tím/Trắng; Sen-jin: Vàng; Uchy-ha: Đỏ). với avatar trong folder public/imgs/avatar/hud
   - Bên phải Avatar là Tên Nhân Vật và Nhẫn Cấp (Ví dụ: "Naru Uzumaka [Hạ Nhẫn]").
   - Bên dưới tên là 2 thanh trạng thái chạy ngang xếp chồng lên nhau:
     * Thanh HP (Máu): Màu đỏ thẫm rực rỡ, hiển thị số "HP: 2500 / 2500".
     * Thanh Mana (Năng lượng): Màu xanh dương/lam nhạt phát sáng, hiển thị số "Mana: 1200 / 1200". (Lưu ý: Mặc dù chưởng tạm thời 0 mana ở phase này, HUD vẫn hiển thị chính xác chỉ số).
2. Thanh máu và mana phải có hiệu ứng co giãn mượt mà khi tăng/giảm (CSS transition: width 0.3s ease-out).
3. Thiết kế cố định (position: fixed; top: 10px; left: 10px; z-index: 100). Tự động thu nhỏ 20% khi chạy trên màn hình điện thoại di động có bề ngang hẹp để tránh che tầm nhìn game.
```

---

### PROMPT 5: HỆ THỐNG ĐIỀU KHIỂN CẢM ỨNG DI ĐỘNG (JOYSTICK, SKILLS & COMBAT EVENT)
```text
Hãy lập trình hệ thống điều khiển ảo di động (Virtual Controls) bằng HTML5, CSS3 và Javascript để điều khiển nhân vật game:
1. Giao diện được chia làm 3 cụm chính nằm cố định ở phần dưới cùng của màn hình di động:
   - Cụm di chuyển bên trái (Circular Joystick): Thiết kế một phím Joystick dạng hình tròn. Người chơi nhấn ngón tay vào tâm hình tròn và kéo (drag) để di chuyển nhân vật chạy sang Trái/Phải hoặc hướng chéo để Nhảy. Joystick tự động hồi về tâm khi thả tay.
   - Cụm ô phím tắt kỹ năng ở giữa (Skill Shortcuts Bar): 
     * Gồm một hàng ngang chứa 4 ô vuông nhỏ đại diện cho phím tắt dùng chiêu (ô 1 mặc định gán chiêu ĐẤM, ô 2 mặc định gán chiêu CHƯỞNG, ô 3 và 4 tạm khóa). Khi người dùng nhấn vào một ô kỹ năng, ô đó sẽ được chọn (phát sáng viền thể hiện trạng thái "đang chọn").
     * Trạng thái hồi chiêu (Cooldown Shadow Overlay): Khi một kỹ năng được kích hoạt thành công, ô kỹ năng đó sẽ hiển thị một lớp bóng tối đè lên trên và xoay thu nhỏ theo vòng tròn (radial cooldown sweep) để biểu thị thời gian hồi chiêu. Thời gian hồi chiêu phụ thuộc vào nhân vật hệ phái nào được chọn:
       - HYU-GA: Đấm hồi 0.25 giây, Chưởng hồi 1.5 giây.
       - SEN-JIN: Đấm hồi 0.30 giây, Chưởng hồi 2.0 giây.
       - UCHY-HA: Đấm hồi 0.35 giây, Chưởng hồi 2.5 giây.
     * Cảnh báo hết Mana (Out of Mana/Disabled state): Mặc dù chưởng ở Phase 1 là 0 Mana, lập trình sẵn cơ chế kiểm tra: nếu lượng mana hiện tại nhỏ hơn lượng tiêu hao lý thuyết, ô kỹ năng tương ứng tự động mờ đi (opacity: 0.4) và áp dụng bộ lọc xám (grayscale) để người chơi nhận biết.
   - Cụm nút hành động bên phải (Nút kích hoạt & Khóa mục tiêu):
     * Nút Hành Động chính: 1 nút tròn lớn nhất ở góc phải, hiển thị hình ảnh biểu tượng phi tiêu Shuriken phát sáng ở giữa (Không dùng chữ viết). Nút này dùng để kích hoạt kỹ năng hiện đang được chọn từ cụm ô phím tắt ở giữa.
     * Nút Chuyển Mục Tiêu phụ: Thiết kế 1 nút tròn nhỏ phụ (đường kính khoảng 40px) nằm ngay cạnh nút Shuriken lớn. Nút phụ này hiển thị biểu tượng tâm ngắm (crosshair/target). Khi click vào nút phụ này, phát tín hiệu chuyển đổi khóa mục tiêu sang quái vật tiếp theo (xoay vòng theo cự ly từ gần đến xa).
     * Logic đòn đánh theo mục tiêu đang khóa:
       - Logic thi triển ĐẤM: Khi ô Đấm được chọn, nhấn nút Shuriken sẽ ưu tiên kiểm tra cự ly đến quái vật đang bị khóa. Nếu quái đang cách [40px đến 150px], nhân vật tự động chạy lại (auto-dash) áp sát quái dưới 40px rồi tung đấm.
       - Logic thi triển CHƯỞNG: Khi ô Chưởng được chọn, nhấn nút Shuriken sẽ phóng chưởng hướng thẳng về phía quái vật đang bị khóa. Chỉ kích hoạt bắn chưởng vào quái nằm trong khoảng cách hiệu quả [40px đến 300px].
       - Cơ chế Rơi Chackra khi Đánh Trúng: Khi Đấm hoặc Chưởng trúng quái vật đang bị khóa, game sẽ sinh ra các hạt năng lượng màu xanh lá cây phát sáng từ vị trí quái vật tự bay hút về phía nhân vật. Đồng thời, trên đầu nhân vật hiển thị chữ số "+X" là chakra màu xanh lá bay lên.
       - Cơ chế Tiêu diệt & Hồi sinh quái: Khi quái vật hết HP, quái biến mất trong làn khói trắng (Substitution Poof). Quái vật này tự động hồi sinh tại tọa độ gốc sau đúng 6 giây.
2. Các nút bấm phải được thiết kế tối ưu cho ngón tay cái di động (đường kính nút từ 50px đến 80px), có hiệu ứng co giãn (scale) nhẹ và đổi màu khi được nhấn giữ (active state).
3. Sử dụng các sự kiện cảm ứng di động (`touchstart`, `touchend`, `touchmove`) để đảm bảo không bị trễ (zero input lag).
```

---

## 5. KẾ HOẠCH XÁC MINH & CHẠY THỬ (VERIFICATION PLAN)

*   **Xác minh cảnh nền động Đăng nhập:** Kiểm tra Phaser Canvas bên dưới form đăng nhập hiển thị mây bay hoặc hạt phát sáng di chuyển mượt mà.
*   **Xác minh chuyển Tab:** Click chuyển đổi giữa Tab Nhiệm Vụ, Tab Kỹ Năng và Tab Cài Đặt.
*   **Xác minh đóng Modal:** Bắt buộc click nút X mới đóng được modal.
*   **Xác minh Hệ thống Khóa & Chuyển Mục Tiêu:** Mũi tên đỏ nhỏ phát sáng nhấp nhô lơ lửng trên đầu quái bị khóa.
*   **Xác minh cự ly bắn chưởng (40px - 300px) & Đấm áp sát (40px - 150px):** Đúng khoảng cách, đúng logic lướt nhanh áp sát quái.
*   **Xác minh Hiệu ứng Khói & Rơi Hạt Chackra:**
    *   Đấm hoặc Chưởng trúng quái vật: Hạt năng lượng xanh bay về phía nhân vật, trên đầu nhân vật bay chữ số "+X" màu xanh lá.
    *   Tiêu diệt quái: Quái biến mất trong làn khói trắng.
*   **Xác minh Hồi sinh quái 6 giây:** Bấm đồng hồ đếm ngược, sau đúng 6 giây kể từ khi khói "Bùm" xuất hiện, quái vật phải hồi sinh nguyên vẹn tại vị trí cũ.
