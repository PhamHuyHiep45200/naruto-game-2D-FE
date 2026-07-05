# KẾ HOẠCH TRIỂN KHAI PHASE 2: SHINOBI MERIDIAN RPG (NÂNG CẤP HỆ THỐNG CHIẾN ĐẤU & TIẾN TRÌNH)

Tài liệu này đặc tả kiến trúc kỹ thuật, thiết kế chuỗi 15 nhiệm vụ chính tuyến tương ứng với 12 bản đồ liên thông (chỉ các nhiệm vụ đánh quái mới mở khóa bản đồ mới, các nhiệm vụ không đánh quái tái sử dụng bản đồ cũ), hệ thống Hồn Linh Thú nâng cấp trang bị, cơ chế Triệu Hồi Cây Thần Ảo Mộng, hệ thống Phó bản Tổ đội Co-op Gauntlet Raid (ít nhất 2 người, tối đa 8 người), hệ thống Quái Tinh Anh (dự kiến cho Phase 3), cấu trúc cơ sở dữ liệu Back-End và các bộ prompt chuyên dụng cho Phase 2 của game.

---

## 1. MỤC TIÊU & CẤU TRÚC PHASE 2
Phase 2 nâng cấp bản demo từ các tương tác giao diện cơ bản lên một game cày cuốc nhập vai (ARPG) có chiều sâu với các trọng tâm chính:
1.  **Hệ thống 12 Bản đồ & 15 Nhiệm vụ**: Tối ưu hóa số lượng tài nguyên bản đồ xuống còn 12 bản đồ chính thức. 3 nhiệm vụ đầu tiên đều diễn ra trên cùng một bản đồ làng nhập môn (Map 1: Làng Mộc) chứa cả trung tâm làng, mái nhà và sân tập thể thuật. Các nhiệm vụ đánh quái (combat) tiếp theo sẽ mở ra các bản đồ mới tinh. Các nhiệm vụ phi chiến đấu khác tái sử dụng bản đồ đã có.
2.  **Cơ chế di chuyển địa hình đặc biệt**:
    *   **Khinh Công (Bay)**: Bật tính năng bay. Trên PC: nhấn phím Lên (W / Mũi tên lên) để bay lên, phím Sang Ngang (A/D / Mũi tên trái/phải) để di chuyển hướng bay. Trên Mobile: kéo Joystick hướng lên trên để bay lên và di chuyển. Trạng thái bay sẽ tiêu tốn Mana liên tục (tiêu hao 3 Mana/giây).
    *   **Vật lý Rơi Tự Do (Freefall)**: Nếu Mana tụt xuống dưới 40% khi đang bay, nhân vật lập tức thoát trạng thái bay và rơi tự do. 
        *   *Vật lý*: Hãm phanh ngang (chỉ giữ tối đa 15% quán tính di chuyển ngang), rơi thẳng đứng với gia tốc trọng trường tăng dần ($g = 800 \text{ px/s}^2$).
        *   *Khóa điều khiển*: Khóa phím di chuyển ngang (A/D, Joystick trái/phải), khóa phím Nhảy (Jump), Bay (Fly), Đi trên nước. Khóa toàn bộ kỹ năng Đấm (Punch) và Chưởng (Blast) trong suốt quá trình rơi để tránh lơ lửng vô hạn do hoạt ảnh chiêu thức.
        *   *Tiếp đất (Landing)*: Nếu chạm đất, nhân vật bị khựng nhẹ (Landing Stun) trong 0.5 giây với hiệu ứng khói bụi đất (landing dust) dưới chân trước khi hồi phục quyền kiểm soát. Nếu rơi xuống nước, nhân vật chuyển sang trạng thái Rơi Nước dưới đây.
    *   **Chạy trên nước & Rơi nước**: Chạy trên nước khi Mana $\ge$ 40% (tiêu hao 2 Mana/giây), có vòng gợn nước lan tỏa dưới chân. Khi Mana < 40%, nhân vật tự động rơi xuống nước. Khi ở dưới nước, nhân vật vẫn di chuyển bình thường (không có hoạt ảnh bơi lội), nhưng tốc độ tấn công (đấm) và tốc độ hồi chiêu/thi triển (chưởng) bị chậm lại 30% so với bình thường. Khi đang ở dưới nước mà Mana < 40%, người chơi bị khóa hoàn toàn tính năng kích hoạt Bay. Để kích hoạt lại bay hoặc đi trên nước, người chơi bắt buộc phải đứng yên hồi phục Mana lên trên 40% hoặc di chuyển lên bờ.
3.  **Hệ thống Hồn Linh Thú (Thay thế cho Ngọc Hồn Thú)**: Thay vì chỉ là nguyên liệu đập đồ thông thường, khi khảm Hồn Linh Thú vào trang bị sẽ kích hoạt các dòng thuộc tính ẩn hoặc hiệu ứng hình ảnh đặc trưng (Ví dụ: Thạch Yêu Hồn Linh tăng thủ vật lý và tạo giáp đá mỏng bao bọc quanh người; Lôi Tộc Hồn Linh tăng tỷ lệ chí mạng và tạo hiệu ứng tia sét nhỏ xẹt phát sáng quanh nhân vật).
4.  **Cơ chế Triệu Hồi Cây Thần Ảo Mộng**: Thu thập đủ 9 viên Thần Thú Ngọc để triệu hồi Cây Thần, đưa toàn bộ thế giới game từ ban ngày sang đêm Trăng Máu (Vô Hạn Huyết Nguyệt). Trong thời gian Ảo mộng, **sức đánh (sát thương) của tất cả quái vật trên toàn bản đồ tăng thêm 30%** (HP giữ nguyên) cho đến khi Ảo mộng kết thúc và người chơi chọn mộng ước.
5.  **Cơ chế Thanh Nộ Tối Thượng (Ultimate Rage Awakening)**: Tích nộ trong chiến đấu. Khi đạt 100% nộ sẽ **khóa giữ nộ** (không giảm ngoài giao tranh). Khi sử dụng, người chơi **ngẫu nhiên nhận 1 trong 4 trạng thái cực phẩm** trong 15 giây (Bát Môn Cấm Thuật, Phân Thân Chi Thuật, Tiên Nhân Thể, Triệu Hồi Thần Thú). Sau khi dùng, thanh nộ reset về 0%.
6.  **Hệ thống Quái Tinh Anh (Elite Monsters) - Dự kiến cho Phase 3**: Không xuất hiện ở các Map 1 đến 12 hiện tại của Phase 2, mà được chuyển sang các Map mới ở Phase 3. Có HP trâu hơn nhiều (+150% HP) và sát thương (cắn) tính theo % Máu tối đa của nhân vật (10% - 15% Max HP mỗi phát cắn). Gồm 3 loại đặc trưng cơ chế: Tinh Anh Phân Thân (nhiễu loạn mục tiêu), Tinh Anh Địa Lôi (khóa bay nhảy), và Tinh Anh Hộ Thuẫn (kháng Đấm/Chưởng xoay tua).
7.  **Hệ thống Phó bản Tổ đội Co-op Gauntlet Raid (Doanh Trại U Ám Lâm)**: Dành cho tổ đội từ 2-8 người (tối đa 8 người tương đương bang phái, tối thiểu phải có 2 người trở lên cùng đi). Bản đồ gồm 4 map lớn liên thông, mỗi map lớn chia thành 3-4 map nhỏ (khu vực nhỏ). Vượt qua các map nhỏ sẽ đến map cuối chứa Boss gác cổng. Tiêu diệt Boss mới mở cổng sang map lớn tiếp theo. Tích hợp cơ chế tự động cân bằng động quái vật (Scale HP/ATK theo chỉ số người mạnh nhất) và các thử thách phối hợp đồng đội.
8.  **UX Polish (Chỉ dẫn NPC Quest)**: Các NPC có dấu hỏi chấm màu vàng `!` trên đầu khi có nhiệm vụ mới sẵn sàng giao, và dấu hỏi chấm màu xanh `?` khi người chơi đã làm xong nhiệm vụ cần trả.
9.  **Cấu trúc dữ liệu Back-End**: Lưu trữ thông tin nhiệm vụ tĩnh, tiến trình động của người chơi và trạng thái túi đồ chứa ngọc/thần thú ngọc.

---

## 2. HỆ THỐNG PHÂN CẤP NHÂN VẬT & NHẪN CẤP (90 LEVELS - 9 NHẪN CẤP)

Hệ thống tiến trình nhân vật được xây dựng gồm **90 cấp độ (Level)** chia đều cho **9 cấp bậc Nhẫn Cấp**, mỗi Nhẫn cấp tương ứng với 10 cấp độ và có mối liên kết tượng trưng với sức mạnh của **9 Thần Thú**:

1.  **Nhẫn Cấp 1: Học Viên Nhẫn Giả (Academy Student)** - *Level 1 đến 10*
    *   *Biểu tượng liên kết*: Nhất Vĩ Sa Thú (1★)
    *   *Mô tả*: Học viên học tại Học viện Nhẫn giả Làng Mộc, chỉ làm nhiệm vụ phi chiến đấu.
2.  **Nhẫn Cấp 2: Hạ Nhẫn (Genin)** - *Level 11 đến 20*
    *   *Biểu tượng liên kết*: Nhị Vĩ Hỏa Miêu (2★)
    *   *Mô tả*: Đã tốt nghiệp học viện, thực hiện nhiệm vụ tuần tra rừng biên giới (Map 2).
3.  **Nhẫn Cấp 3: Trung Nhẫn (Chunin)** - *Level 21 đến 30*
    *   *Biểu tượng liên kết*: Tam Vĩ Thủy Quy (3★)
    *   *Mô tả*: Đủ năng lực dẫn dắt đội nhóm. Mốc thăng cấp sau khi hoàn thành Đại Chiến Cầu Hỏa Tuyến (Map 12). Mở khóa **Doanh Trại Co-op Gauntlet Raid**.
4.  **Nhẫn Cấp 4: Thượng Nhẫn (Jonin)** - *Level 31 đến 40*
    *   *Biểu tượng liên kết*: Tứ Vĩ Hỏa Hầu (4★)
    *   *Mô tả*: Nhẫn giả ưu tú của Làng, có thể tự học các nhẫn thuật cấp cao A-rank.
5.  **Nhẫn Cấp 5: Ám Bộ (Anbu)** - *Level 41 đến 50*
    *   *Biểu tượng liên kết*: Ngũ Vĩ Mã Linh (5★)
    *   *Mô tả*: Lực lượng ninja đặc nhiệm trực thuộc quyền quản lý của các Thủ Lĩnh Nhẫn Giả (Nhẫn Ảnh).
6.  **Nhẫn Cấp 6: Nhẫn Giả Huyền Thoại (Legendary Shinobi)** - *Level 51 đến 60*
    *   *Biểu tượng liên kết*: Lục Vĩ Độc Sên (6★)
    *   *Mô tả*: Sức mạnh đạt cấp độ huyền thoại tương đương Tam Đại Tông Sư Làng Mộc.
7.  **Nhẫn Cấp 7: Nhẫn Ảnh (Kage)** - *Level 61 đến 70*
    *   *Biểu tượng liên kết*: Thất Vĩ Dực Sí (7★)
    *   *Mô tả*: Người đứng đầu một làng nhẫn giả, sức mạnh tối cao của hệ thống nhẫn giả thông thường.
8.  **Nhẫn Cấp 8: Tiên Nhân (Sennin / Sage)** - *Level 71 đến 80*
    *   *Biểu tượng liên kết*: Bát Vĩ Ngưu Xà (8★)
    *   *Mô tả*: Nhẫn giả đã làm chủ được năng lượng tự nhiên (Tiên thuật), vượt lên trên giới hạn phàm trần.
9.  **Nhẫn Cấp 9: Nhẫn Thần Lục Đạo (Six Paths Sage)** - *Level 81 đến 90*
    *   *Biểu tượng liên kết*: Cửu Vĩ Thiên Hồ (9★)
    *   *Mô tả*: Cấp bậc thần thoại tối thượng, sở hữu sức mạnh tiệm cận Nhẫn Thần và các kỹ năng thay thiên đổi địa.

### A. Cơ chế Phân bổ & Tiêu thụ Chakra (Số liệu Cân bằng Tạm thời)
Tất cả các số liệu về lượng Chakra nhận từ quái, chi phí nâng cấp dưới đây là **dự kiến tạm thời phục vụ cho việc lập trình Phase 2**:
*   **Tiêu dùng nâng cấp**: Người chơi sử dụng Chakra để nâng cấp **HP (Máu)**, **Mana (Năng lượng)**, và các kỹ năng **Đấm/Chưởng**.
*   **Mốc nâng MAX chỉ số cơ bản**: Thiết lập chi phí nâng cấp sao cho đến khoảng **Level 70**, người chơi đã có thể nâng cấp **đạt cấp tối đa (Level 90) cho cả HP và Mana**.
*   **Quỹ tích lũy dư thừa học bí thuật**: Toàn bộ lượng Chakra tích lũy dư thừa thu được từ Level 70 đến 90 sẽ được dùng tự học các bí thuật tối thượng (như Bát Môn Cấm Thuật, Phân Thân Chi Thuật, Tiên Nhân Thuật, Triệu Hồi Chi Thuật) nếu họ không muốn chi tiêu **Ngọc (Gems - Hard Currency)**.

### B. Mô Hình Toán Học Cày Cuốc & Thời Gian Tích Lũy (Ước Tính 2 Năm)
Nhằm đảm bảo đạt mốc thời gian **2 năm** cày cuốc thực tế (mỗi ngày chơi trung bình **6-8 tiếng** cày cuốc liên tục, không tính các sự kiện x2 hoặc giftcode bổ trợ) để đạt cấp 90 và max chỉ số, hệ thống sử dụng mô hình toán học sau:

#### 1. Ước tính Quỹ thời gian cày cuốc nhẫn giả
*   **Tổng số ngày cày trong 2 năm**: 730 ngày.
*   **Thời gian chơi trung bình**: 7 tiếng/ngày.
*   **Tổng số giờ cày thực tế (chiếm 80% tổng thời gian chơi)**:
    $$\text{Tổng số giờ cày} \approx 4,100 \text{ giờ}.$$
*   **Tốc độ diệt quái trung bình**: 20 quái/phút (tương đương 1,200 quái/giờ).
*   **Chakra rơi trung bình toàn game**: 250 Chakra/quái (tính trung bình có trọng số qua các map từ 2 đến 500 Chakra/quái).
*   **Tốc độ cày Chakra trung bình**: 300,000 Chakra/giờ.
*   **Tổng lượng Chakra cày được sau 2 năm**:
    $$\text{Tổng Chakra} = 4,100 \text{ giờ} \times 300,000 \text{ Chakra/giờ} = 1,230,000,000 \text{ Chakra (1.23 Tỷ)}.$$

#### 2. Phân bổ tiêu thụ Chakra lên Cấp 90 (Level Cap)
Người dùng sử dụng 1.23 Tỷ Chakra này để nâng cấp cho 3 hạng mục chính là HP (Máu), Kỹ năng Đấm (Thể thuật) và Kỹ năng Chưởng (Nhẫn thuật). Level nhân vật hiển thị sẽ là trung bình cộng cấp độ của 3 hạng mục này:
$$\text{Level Nhân Vật} = \text{Làm Tròn}\left(\frac{\text{Cấp HP} + \text{Cấp ĐẤM} + \text{Cấp CHƯỞNG}}{3}\right)$$

Mỗi hạng mục tiêu tốn trung bình **410,000,000 Chakra** để nâng cấp từ 1 lên 90. Công thức tính chi phí nâng từ cấp $x-1$ lên cấp $x$ của mỗi hạng mục là:
$$\text{Chi phí nâng}(x) = 0.83 \times x^{3.8} + (x \times 1,000) + 100$$

*   *Lên cấp 2*: Tốn **2,111 Chakra** ($\approx$ Đạt được qua các phần thưởng nhiệm vụ ở Map 1).
*   *Lên cấp 30*: Tốn **340,921 Chakra** ($\approx$ 28 tiếng cày ở Map 3 / Map 4).
*   *Lên cấp 70*: Tốn **7,680,000 Chakra** (đạt mốc MAX chỉ số cơ bản HP và Mana).
*   *Lên cấp 90 (cấp cuối)*: Tốn **20,780,000 Chakra** ($\approx$ 34 ngày cày ở các Map từ 9 đến 12).

#### 3. Cơ chế nâng HP & Mana đạt mốc tối đa ở Level 70
Để người chơi đạt mốc MAX cấp 90 cho chỉ số HP và Mana trước khi nhân vật đạt Level 70:
*   Tổng chi phí nâng cấp HP và Mana lên cấp 90 sẽ đạt được khi nhân vật tích lũy đủ **60% tổng lượng Chakra** (tương đương khoảng Level 70).
*   Từ Level 70 đến 90, lượng Chakra dư thừa ước tính khoảng **400 Triệu Chakra** sẽ được dôi ra làm quỹ để người chơi tự học các bí thuật tối thượng (như Bát Môn Cấm Thuật, Phân Thân Chi Thuật, v.v.) mà không cần mua bằng Ngọc (Gems).

---

## 3. KIẾN TRÚC CƠ SỞ DỮ LIỆU BACK-END (DB SCHEMA)

Để đảm bảo lưu trữ vĩnh viễn tiến trình của người chơi và tránh gian lận, BE sẽ triển khai 4 bảng dữ liệu sau:

### A. Bảng `Quests` (Danh mục nhiệm vụ tĩnh)
```sql
CREATE TABLE Quests (
    quest_id VARCHAR(50) PRIMARY KEY, -- Ví dụ: 'Q001', 'Q002'
    title VARCHAR(100) NOT NULL,       -- Tiêu đề nhiệm vụ
    type VARCHAR(20) NOT NULL,        -- 'main' (chính tuyến) hoặc 'daily' (hằng ngày)
    required_level INT DEFAULT 1,      -- Cấp độ tối thiểu để nhận
    rewards JSON,                      -- Phần thưởng dạng JSON: {"gold": 500, "chakra": 200, "gems": 10}
    next_quest_id VARCHAR(50)          -- ID nhiệm vụ tiếp theo
);
```

### B. Bảng `SubQuests` (Yêu cầu nhiệm vụ con)
```sql
CREATE TABLE SubQuests (
    sub_quest_id VARCHAR(50) PRIMARY KEY,
    quest_id VARCHAR(50),
    description TEXT NOT NULL,
    target_type VARCHAR(30),           -- 'kill_monster', 'collect_item', 'talk_npc', 'reach_location'
    target_id VARCHAR(50),             -- ID của quái/vật phẩm/NPC tương ứng
    target_count INT DEFAULT 1,        -- Số lượng yêu cầu
    FOREIGN KEY (quest_id) REFERENCES Quests(quest_id)
);
```

### C. Bảng `PlayerQuestProgress` (Tiến trình thực tế của người chơi - Động)
```sql
CREATE TABLE PlayerQuestProgress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quest_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active' (đang làm), 'completed' (chờ nhận thưởng), 'claimed' (đã nhận)
    sub_quest_progress JSON,             -- Tiến trình thực tế dạng JSON: {"SQ001": 3, "SQ002": 0}
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES Quests(quest_id)
);
```

### D. Bảng `PlayerStats` (Chỉ số, Kỹ năng và Cấp độ người chơi - Động)
```sql
CREATE TABLE PlayerStats (
    user_id INT PRIMARY KEY,              -- Khóa ngoại liên kết tới bảng Users
    hp_level INT DEFAULT 1,               -- Cấp độ nâng cấp chỉ số Máu (HP) - Tối đa 90
    mana_level INT DEFAULT 1,             -- Cấp độ nâng cấp chỉ số Năng lượng (Mana) - Tối đa 90
    punch_level INT DEFAULT 1,            -- Cấp độ nâng cấp kỹ năng Đấm thường - Tối đa 90
    blast_level INT DEFAULT 1,            -- Cấp độ nâng cấp kỹ năng Chưởng lực - Tối đa 90
    current_chakra INT DEFAULT 0,         -- Số Chakra khả dụng hiện có (dùng để tiêu xài nâng cấp)
    total_chakra_spent INT DEFAULT 0,     -- Tổng số Chakra đã tiêu xài từ đầu game đến nay
    total_chakra_accumulated INT DEFAULT 0, -- Tổng số Chakra tích lũy (EXP để tự động thăng cấp)
    character_level INT DEFAULT 1,        -- Level hiển thị của nhẫn giả (Trung bình cộng của HP + Đấm + Chưởng)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 4. CHUỒI 15 NHIỆM VỤ CHÍNH TUYẾN TƯƠNG ỨNG 12 BẢN ĐỒ CHI TIẾT (MAP PROGRESSION)

Dưới đây là thiết kế chuỗi 15 nhiệm vụ chính tuyến. Chỉ những nhiệm vụ đánh quái mới sử dụng bản đồ mới. Bản đồ 1 chứa toàn bộ các khu vực luyện tập ban đầu của làng.

### PHẦN I: GIAI ĐOẠN HỌC VIỆN (Làng Mộc yên bình - Map 1)

*   **Nhiệm vụ 1: Chú Mèo Tinh Nghịch của Trưởng Thôn (Phi chiến đấu)**
    *   **Bản đồ**: *Map 1: Làng Mộc* (Khu vực trung tâm làng, nhà cửa san sát).
    *   *NPC*: Trưởng thôn Làng Mộc (Có dấu `!` trên đầu, chuyển thành `?` khi xong).
    *   *Nhiệm vụ con*: Nhận nhiệm vụ $\rightarrow$ Nhảy leo lên các mái nhà gỗ của Map 1 để tìm chú mèo mất tích $\rightarrow$ Tiếp cận và bắt đem về báo cáo.
    *   *Thưởng*: +100 Chakra, +20 Vàng.
*   **Nhiệm vụ 2: Huấn Luyện Khinh Công (Phi chiến đấu)**
    *   **Bản đồ**: *Tái sử dụng Map 1: Làng Mộc* (Bay lượn trên khu vực mái nhà cao hơn).
    *   *NPC*: Sư phụ Cóc Tiên Nhân (Có dấu `!` trên đầu).
    *   *Nhiệm vụ con*: Học bí thuật khinh công $\rightarrow$ Sử dụng phím điều khiển (PC: W/Up; Mobile: Joystick lên) $\rightarrow$ Bay lướt thu thập 5 hạt Chakra tự nhiên lơ lửng trên không trung của Map 1 (bay tiêu tốn 3 Mana/giây).
    *   *Thưởng*: +150 Chakra, Mở khóa vĩnh viễn tính năng Bay.
*   **Nhiệm vụ 3: Bài Tập Cận Chiến Thể Thuật (ĐẤM MỘC NHÂN - Phi chiến đấu)**
    *   **Bản đồ**: *Tái sử dụng Map 1: Làng Mộc* (Khu vực sân tập thể thuật ở rìa làng).
    *   *NPC*: Huấn Luyện Viên Thể Thuật.
    *   *Nhiệm vụ con*: Đấm phá hủy 5 Mộc Nhân gỗ luyện tập đặt tại sân tập Map 1 $\rightarrow$ Thực hành kỹ năng đấm áp sát (Auto-dash) cự ly ngắn dưới 150px.
    *   *Thưởng*: +250 Chakra, +10 Ngọc (Gems).

---

### PHẦN II: CHIẾN TRANH BÙNG NỔ (Biên giới Làng Mộc & Làng Phong - Map 2 đến Map 4)

*   **Nhiệm vụ 4: Tuần Tra Biên Giới (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 2: Rừng Biên Giới Làng Mộc* (Bìa rừng lá phong đỏ, bắt đầu có địch).
    *   *Nhiệm vụ con*: Di chuyển sang Map 2 $\rightarrow$ Tiêu diệt 6 Nhẫn giả tuần tra của **Sa Cát Thôn** đang do thám biên giới. Chakra nhận được sẽ tự động cộng thẳng vào ví nhân vật khi quái chết.
    *   *Thưởng*: +350 Chakra, +100 Vàng, **Nhận Thần Thú Ngọc 1★ (Thưởng cốt truyện)**.
*   **Nhiệm vụ 5: Hộ Tống Xe Tiếp Tế Tiền Tuyến (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 3: Thung Lũng Làng Mộc* (Hẻm núi đất chật hẹp, dễ phục kích).
    *   *Nhiệm vụ con*: Sang Map 3 tìm xe hàng tiếp tế $\rightarrow$ Chiến đấu tiêu diệt 3 đợt Nhẫn giả Sa Cát Thôn phục kích từ hai bên sườn dốc để bảo vệ xe đi hết map.
    *   *Thưởng*: +400 Chakra, +120 Vàng.
*   **Nhiệm vụ 6: Đoạt Mật Thư Hành Quân Làng Phong (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 4: Đồi Cát Làng Phong* (Sa mạc cát vàng, hoang vắng).
    *   *Nhiệm vụ con*: Xâm nhập vào vùng đồi cát Map 4 $\rightarrow$ Tiêu diệt 8 Nhẫn giả do thám Sa Cát Thôn và thu thập đủ 3 Bản đồ hành quân của chúng.
    *   *Thưởng*: +500 Chakra, +20 Ngọc, **Nhận Thần Thú Ngọc 2★ (Thưởng cốt truyện)**.
*   **Nhiệm vụ 7: Đột Nhập Khe Núi Biên Giới (Phi chiến đấu - Vượt cạm bẫy)**
    *   **Bản đồ**: *Tái sử dụng Map 4: Đồi Cát Làng Phong* (Khu vực hốc đá hiểm trở đầy bẫy).
    *   *Nhiệm vụ con*: Tại khu vực hẻm đá Map 4 $\rightarrow$ Sử dụng Khinh công bay né tránh các chông nhọn gài dưới hố cát lún và các tảng đá lăn từ vách núi xuống để tiến sâu vào biên giới của địch.
    *   *Thưởng*: +600 Chakra, +150 Vàng.

---

### PHẦN III: THÂM NHẬP HỎA TUYẾN (Biên cảnh Làng Mộc & Làng Thổ - Map 5 đến Map 8)

*   **Nhiệm vụ 8: Bí Thuật Thủy Hành (HỌC ĐI TRÊN NƯỚC - Phi chiến đấu đặc biệt)**
    *   **Bản đồ**: *Map 5: Bờ Sông Cầu Hỏa Tuyến* (Bờ sông đá cuội dưới chân cầu treo khổng lồ).
    *   *Nhiệm vụ con*: Gặp Sư phụ tại Map 5 $\rightarrow$ Vận mana đi trên mặt nước sông nhặt 3 Thùng tiếp tế thuốc nổ (Mana $\ge$ 40%, tiêu hao 2 Mana/giây). Nếu Mana < 40%, nhân vật rơi xuống nước, tốc độ đánh và chưởng giảm 30%.
    *   *Thưởng*: +700 Chakra, +200 Vàng.
*   **Nhiệm vụ 9: Giải Cứu Đồng Đội Bị Giam (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 6: Gầm Cầu Hỏa Tuyến* (Khu vực ẩm ướt dưới kết cấu cầu treo, có lồng giam).
    *   *Nhiệm vụ con*: Tiến vào Map 6 $\rightarrow$ Tiêu diệt 6 Nhẫn giả Hắc Thạch Thôn đang trông giữ khóa ngục $\rightarrow$ Giải phóng các ninja Làng Mộc đang bị nhốt trong lồng.
    *   *Thưởng*: +800 Chakra, +250 Vàng, **Nhận Thần Thú Ngọc 3★ (Thưởng cốt truyện)**.
*   **Nhiệm vụ 10: Khai Phá Nhẫn Thuật (MỞ KHÓA CHƯỞNG - ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 7: Mặt Cầu Hỏa Tuyến* (Mặt cầu gỗ treo dài, hai bên vách núi gió lớn).
    *   *Nhiệm vụ con*: Di chuyển lên mặt cầu Map 7 $\rightarrow$ Kích hoạt mở khóa kỹ năng CHƯỞNG (Phi Tiêu Phong Lực / Hỏa Cầu Thuật / Mãnh Hổ Chưởng) $\rightarrow$ Dùng chưởng tầm xa (40px - 300px) tiêu diệt 10 Nhẫn giả Hắc Thạch Thôn tràn qua cầu.
    *   *Thưởng*: +900 Chakra, mở khóa kỹ năng Chưởng Cấp 1.
*   **Nhiệm vụ 11: Thủy Chiến Dưới Lòng Sông (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 8: Vực Nước Sông Hỏa Tuyến* (Lòng sông sâu, nước xiết dữ dội).
    *   *Nhiệm vụ con*: Nhảy xuống Map 8 $\rightarrow$ Đứng trên mặt nước chiến đấu tiêu diệt **15 Thủy Quái** do địch triệu hồi (nếu rơi nước sẽ bị giảm 30% tốc đánh/thi triển) $\rightarrow$ Kích hoạt Thức Tỉnh Hóa Thú Khổng Lồ tạm thời quét sạch quái vật.
    *   *Thưởng*: +1000 Chakra, mở khóa nút Thức Tỉnh.

---

### PHẦN IV: ĐỘT KÍCH VÀO SÀO HUYỆT ĐỊCH (Lãnh địa Làng Thổ - Map 9 đến Map 12)

*   **Nhiệm vụ 12: Tấn Công Tiền Đồn Phòng Thủ (Cày cuốc 1 - ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 9: Tiền Đồn Làng Thổ* (Trại lính bằng đá thô, chòi gác cao).
    *   *Nhiệm vụ con*: Xâm nhập Map 9 $\rightarrow$ Tiêu diệt **10 Nhẫn giả Thiết Giáp Hắc Thạch Thôn** (máu cực dày, thủ cao).
    *   *Thưởng*: +1000 Chakra, +200 Vàng.

---
#### 🚨 [MỐC TẬP LUYỆN 1: KHÓA CẤP ĐỘ 4]
*   **Yêu cầu**: Nhân vật phải đạt **Level 4** và nâng kỹ năng **ĐẤM lên Cấp 3** mới được nhận Nhiệm vụ 13.
*   **Mục đích**: Người chơi cày Chakra nâng cấp lực đấm và phòng thủ để chuẩn bị xâm nhập vào sào huyệt hiểm trở của địch tại Map 10.
---

*   **Nhiệm vụ 13: Vượt Vách Đá Đột Kích (ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 10: Vách Đá Làng Thổ* (Dốc đá đứng obsidian trơn trượt đầy hốc đá bí ẩn).
    *   *Nhiệm vụ con*: Xâm nhập Map 10 $\rightarrow$ Đánh bại **15 Vệ Binh Đất Đá Hắc Thạch Thôn** cản đường lên đỉnh.
    *   *Thưởng*: +1500 Chakra, +30 Ngọc (Gems).
*   **Nhiệm vụ 14: Thu Thập Tinh Thể Nổ (Cày cuốc 2 - ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 11: Hang Đá Làng Thổ* (Hang ngầm tối tăm, nhiều tinh thể thạch anh đỏ phát sáng).
    *   *Nhiệm vụ con*: Đi sâu vào Map 11 $\rightarrow$ Tiêu diệt quái hang động để nhặt đủ **20 Tinh Thể Phát Nổ** phục vụ cho kế hoạch đánh sập cầu.
    *   *Thưởng*: +2000 Chakra, +300 Vàng.

---
#### 🚨 [MỐC TẬP LUYỆN 2: KHÓA CẤP ĐỘ 6]
*   **Yêu cầu**: Nhân vật phải đạt **Level 6** và nâng kỹ năng **CHƯỞNG lên Cấp 4** mới được nhận Nhiệm vụ 15.
*   **Mục đích**: Nâng cao chưởng lực và tầm đánh để đủ sức tham gia vào đại chiến chiến dịch lớn nhất tại Cầu Hỏa Tuyến.
---

*   **Nhiệm vụ 15: Đại Chiến Cầu Hỏa Tuyến (Trận Chiến Cuối Cùng - ĐÁNH QUÁI - MỞ MAP MỚI)**
    *   **Bản đồ**: *Map 12: Trận Địa Cầu Hỏa Tuyến* (Toàn cảnh cầu treo bốc cháy, bầu trời đỏ rực lửa chiến tranh).
    *   *Nhiệm vụ con*: Quay lại Map 12 hỗ trợ **Tia Chớp Vàng Phong Vũ** $\rightarrow$ Tiêu diệt **20 Nhẫn giả Tinh Nhuệ Hắc Thạch Thôn**.
    *   *Thưởng*: +5000 Chakra, +100 Ngọc,
---

<!-- ## 5. HỆ THỐNG QUÁI TINH ANH (ELITE MONSTERS) - LÊN KẾ HOẠCH CHO PHASE 3

Để chuẩn bị cho Phase 3, hệ thống **Quái Tinh Anh (Siêu Quái)** với hào quang nguyên tố phát sáng và cơ chế chiến đấu độc đáo sẽ được thiết kế sẵn và xuất hiện tại các bản đồ của Phase 3 (không xuất hiện tại các bản đồ Map 1 đến 12 của Phase 2):

*   **Chỉ số Tinh Anh**:
    *   **HP tối đa tăng 150%** (Máu cực kỳ trâu bò, gấp 2.5 lần quái thường cùng cấp).
    *   **Sức đánh (Sát thương)**: Gây sát thương trực tiếp tính theo **% Máu tối đa của nhân vật** (cắn siêu đau, mất từ **10% đến 15% HP tối đa** cho mỗi đòn đánh trúng, bỏ qua phòng thủ vật lý/nhẫn thuật thông thường) để luôn giữ độ thử thách cho dù người chơi có cấp độ hay trang bị cao.
*   **3 Loại Cơ Chế Tinh Anh đặc trưng (Sẽ xuất hiện ở các Map thuộc Phase 3)**:
    1.  **Tinh Anh Phân Thân (Màu Xanh Lá - Nhiễu loạn)**
        *   *Cơ chế*: Khi HP dưới 50%, quái tự động tạo ra **2 phân thân ảo ảnh** giống hệt bản thể để làm nhiễu loạn nút khóa mục tiêu. Phân thân có HP rất thấp (1 đấm là chết) nhưng có lực đánh như thật. Bản thể thật vẫn giữ mũi tên đỏ khóa mục tiêu trên đầu.
    2.  **Tinh Anh Địa Lôi (Màu Tím - Khống chế)**
        *   *Cơ chế*: Định kỳ mỗi 6 giây, quái đập mạnh xuống đất tạo vùng năng lượng tím dưới chân người chơi. Đứng trong vùng này sẽ bị dính hiệu ứng **Trọng Lực (Khóa Bay và Nhảy)** trong 3 giây.
    3.  **Tinh Anh Hộ Thuẫn (Màu Vàng Kim - Kháng chiêu)**
        *   *Cơ chế*: Cứ mỗi 5 giây, quái xoay tua đổi lá chắn bảo vệ:
            *   *Lá chắn Vật Lý (Cam)*: Miễn nhiễm hoàn toàn sát thương từ đòn **ĐẤM** (Đấm vào hiện chữ "BLOCK!").
            *   *Lá chắn Nhẫn Thuật (Lam)*: Miễn nhiễm hoàn toàn sát thương từ đòn **CHƯỞNG**.
*   **Phần thưởng**: Diệt quái Tinh Anh có tỷ lệ rớt Thần Thú Ngọc 4★, 5★, 6★ cao gấp 5 lần và cơ hội nhận mảnh Hồn Linh Thú hiếm. -->

---

## 6. CƠ CHẾ TRIỆU HỒI CÂY THẦN ẢO MỘNG & QUY TRÌNH SỞ HỮU NGỌC

*   **Quy trình sở hữu 9 viên Thần Thú Ngọc**:
    *   **Ngọc 1★, 2★, 3★ (Nhận từ nhiệm vụ chính)**: Được trao thưởng trực tiếp khi hoàn thành các nhiệm vụ chính tuyến tương ứng (Nhiệm vụ 4, Nhiệm vụ 6, Nhiệm vụ 9).
    *   **Ngọc 4★, 5★, 6★ (Nhận từ cày cuốc & sự kiện)**: Có tỷ lệ rơi ngẫu nhiên khi cày quái tại các Map chiến đấu (từ Map 2 đến Map 12) hoặc mở rương thưởng từ Nhiệm Vụ Hằng Ngày (Daily Quest Chest).
    *   **Ngọc 7★, 8★, 9★ (Chỉ có thể sở hữu thông qua GHÉP NGỌC)**: Không rơi trực tiếp từ bất kỳ nguồn nào. Người chơi phải vào giao diện nâng cấp/lò rèn để tiến hành ghép từ các viên cấp dưới:
        *   **Ghép Ngọc 7★**: Tiêu tốn **9 viên Ngọc 4★**.
        *   **Ghép Ngọc 8★**: Tiêu tốn **9 viên Ngọc 5★**.
        *   **Ghép Ngọc 9★**: Tiêu tốn **9 viên Ngọc 6★**.

*   **Cơ chế Kích hoạt (Vô Hạn Huyết Nguyệt)**:
    1.  Đặt đủ 9 viên ngọc (từ 1★ đến 9★) lên Tế đàn cổ đại tại Làng Mộc (Map 1).
    2.  Nhấn nút "Triệu Hồi":
        *   Màn hình rung chuyển (Camera shake 2 giây).
        *   Một nhánh **Cây Thần (Divine Tree)** khổng lồ phát sáng đỏ tím trồi lên từ mặt đất.
        *   Nền trời game lập tức chuyển dần từ **Ban ngày sang Đêm Tối** (Day-to-night tint transition). Một **Vầng Trăng Máu khổng lồ (Blood Moon)** xuất hiện trên bầu trời đêm.
        *   Các NPC xung quanh rơi vào trạng thái đứng yên bất động (ảo thuật).
        *   **Thay đổi trạng thái Quái vật**: Sức đánh (sát thương gây ra cho nhân vật) của tất cả quái vật trên mọi bản đồ lập tức **tăng thêm 30%** (HP giữ nguyên) cho đến khi Ảo mộng kết thúc.
    3.  Hiển thị Modal **"ẢO MỘNG ĐIỀU ƯỚC"** ở giữa màn hình.
*   **Danh sách Mộng Ước**:
    *   *Mộng ước Giàu Sang (Wealth)*: Nhận ngay 100 Ngọc (Gems) và 10,000 Vàng.
    *   *Mộng ước Luân Hồi (Rebirth)*: Tẩy tủy hoàn trả 100% điểm Chakra kỹ năng.
    *   *Mộng ước Chuyển Kiếp (Metempsychosis)*: Cho phép thay đổi Gia tộc của nhân vật (giữ nguyên Level).
    *   *Mộng ước Ảo ảnh Ngoại trang (Cosmetics)*: Nhận ngay bộ cải trang độc quyền (**Áo Choàng Huyết Nguyệt** phát sáng hào quang đỏ nhấp nháy chuyển động chậm) chỉ có thể sở hữu duy nhất qua triệu hồi Cây Thần.
*   **Kết thúc Ảo mộng**: Màn hình nháy sáng trắng (Flash white), Cây Thần biến mất, bầu trời **trở lại ban ngày mượt mà**, sức đánh của quái vật trở lại bình thường, phần thưởng được trao.

---

## 7. CƠ CHẾ THANH NỘ TỐI THƯỢNG (ULTIMATE RAGE AWAKENING)

Cơ chế cho phép người chơi tích lũy điểm Nộ trong giao tranh. Khi đầy nộ sẽ mở khóa ngẫu nhiên một trong bốn nhẫn thuật tối thượng cực kỳ bá đạo.

*   **Tích Nộ**: Tấn công ĐẤM trúng đích nhận **+1.5 điểm**, CHƯỞNG trúng đích nhận **+4.0 điểm**, đòn chí mạng nhận **+2.0 điểm**. Bị quái đánh trúng nhận **+2.0 điểm mỗi 5% HP tối đa bị mất**.
*   **Khóa Nộ 100%**: Khi thanh nộ đạt mức tối đa 100 điểm, cơ chế tụt giảm nộ ngoài giao tranh bằng 0 (người chơi có thể trữ nộ lâu dài để dành đánh Boss).
*   **Kích Hoạt Ngẫu Nhiên**: Khi nhấn phím Thức Tỉnh, hệ thống quay ngẫu nhiên nhận 1 trong 4 trạng thái bá đạo trong **15 giây**:
    1.  **BÁT MÔN CẤM THUẬT (8 Gates Release)**: Tốc độ đánh tăng 100%, sát thương Đấm thường **nhân 3 lần (X3)**. Hiệu ứng hào quang xanh lá bốc cháy dữ dội.
    2.  **PHÂN THÂN CHI THUẬT (Multi-Clone)**: Triệu hồi **2 phân thân** giống hệt chạy song hành, tự động bắt chước 100% đòn đánh Đấm/Chưởng của bản thể gốc (gây 50% sát thương).
    3.  **TIÊN NHÂN THỂ (Sage Mode)**: Tăng **50% hút máu (Lifesteal)** trên mỗi đòn đánh/chưởng, nhân đôi cự ly đánh của mọi kỹ năng. Có đường vân đỏ hiền giả ở hai khóe mắt.
    4.  **TRIỆU HỒI THẦN THÚ (Beast Summoning)**: Đập tay xuống đất triệu hồi một Thần Thú Khổng Lồ độc lập chiến đấu tự động (AI tự đánh) with sát thương bằng 150% nhân vật:
        *   *Mộc Linh Tộc*: Triệu hồi **Thần Cóc Khổng Lồ (Toad)** giậm nhảy sát thương diện rộng.
        *   *Huyết Nhãn Tộc*: Triệu hồi **Cự Xà Thần (Serpent)** cắn quét đuôi sát thương đơn mục tiêu cực lớn.
        *   *Bạch Nhãn Tộc*: Triệu hồi **Bạch Hổ Chiến Thần (Tiger)** vồ xé cào quái tốc độ cực nhanh.

---

## 8. HỆ THỐNG HỒN LINH THÚ (SPIRIT SOULS)

Hệ thống Hồn Linh Thú (thay thế cho Ngọc Hồn Thú cũ) cung cấp chiều sâu cày cuốc trang bị thông qua các thuộc tính ẩn và hiệu ứng hình ảnh riêng biệt khi khảm nạp:

### A. Phân Loại Hồn Linh Thú & Thuộc Tính Khảm Nạp
Mỗi loại Hồn Linh Thú khi được khảm vào trang bị (Vũ khí, Giáp, Trang sức) sẽ kích hoạt một thuộc tính ẩn bổ trợ và một hiệu ứng hình ảnh phát sáng đặc thù xung quanh nhân vật:

| Tên Hồn Linh Thú | Thuộc Tính Kích Hoạt | Hiệu Ứng Hình Ảnh Đặc Trưng |
| :--- | :--- | :--- |
| **Thạch Yêu Hồn Linh** | +15% Phòng thủ Vật lý & +10% Max HP | Tạo một lớp giáp đá mỏng, nhấp nhô mờ bao bọc quanh thân nhân vật khi chiến đấu. |
| **Lôi Tộc Hồn Linh** | +10% Tỷ lệ Chí mạng & +15% Dame Chí mạng | Tạo ra các tia sét điện nhỏ màu xanh lam thỉnh thoảng xẹt phát sáng chạy dọc quanh người. |
| **Hỏa Hồ Hồn Linh** | +12% Sức Đánh (ATK) & +5% Tốc chạy | Tạo hiệu ứng hào quang lửa cháy âm ỉ màu đỏ cam dưới chân nhân vật. |
| **Băng Quy Hồn Linh** | +10% Kháng sát thương & 15% cơ hội đóng băng mục tiêu (giảm 20% tốc chạy của quái trong 2s) | Tạo các bông tuyết nhỏ rơi nhẹ xung quanh nhân vật và để lại dấu chân băng mờ. |

### B. Cuộn Thư Nhiệm Vụ Hằng Ngày (Daily Quest Scrolls)
Để thu thập Hồn Linh Thú, người chơi cần tham gia làm nhiệm vụ từ các Cuộn Thư Nhập Vai:
*   **Phân Cấp Cuộn Thư**: Gồm 5 cấp độ D, C, B, A, S. Cấp càng cao, phần thưởng mảnh Hồn Linh Thú càng hiếm.
*   **Cơ chế Nhận Nhiệm Vụ**: Mở cuộn thư sẽ ngẫu nhiên nhận một nhiệm vụ có điều kiện khắc nghiệt nhằm kích thích tư duy nhẫn giả:
    *   *Nhiệm vụ cấp D/C*: Tiêu diệt quái thường bằng các đòn cận chiến (Đấm) hoặc Chưởng.
    *   *Nhiệm vụ cấp B/A*: Tiêu diệt quái dưới nước (rơi nước làm giảm 30% tốc đánh/thi triển) hoặc tiêu diệt quái chỉ bằng 1 kỹ năng duy nhất.
    *   *Nhiệm vụ cấp S*: Vượt qua phó bản trong thời gian giới hạn dưới 3 phút mà không được phép dùng bình hồi phục HP/Mana.

---

## 9. CHIẾN DỊCH TỔ ĐỘI: DOANH TRẠI U ÁM LÂM (CO-OP GAUNTLET RAID)

Tính năng phó bản tổ đội cày cuốc Chakra và săn Thần Thú Ngọc trung cấp (4★, 5★, 6★), có thời gian giới hạn **60 phút**, yêu cầu tổ đội **2-8 người** (tối đa 8 người tương đương với bang phái, tối thiểu phải từ 2 người trở lên cùng đi, không thể đi solo). Bản đồ gồm **4 bản đồ lớn liên thông**, mỗi bản đồ lớn chia thành **3-4 bản đồ nhỏ**.

### A. Công thức Cân Bằng Động (Dynamic Stat Scaling)
Để đảm bảo phó bản luôn giữ nguyên độ khó thử thách tương xứng với số lượng và chỉ số của người chơi trong tổ đội:
*   **HP tối đa của Quái vật** tỷ lệ thuận theo **Sát thương lớn nhất trong tổ đội**:
    $$\text{Quái\_HP} = \text{Base\_HP} + (\text{Max\_Damage\_in\_Party} \times 15) \times \text{Party\_Size}$$
*   **Sức đánh (Sát thương) của Quái vật** tỷ lệ thuận theo **HP lớn nhất trong tổ đội**:
    $$\text{Quái\_ATK} = \text{Base\_ATK} + (\text{Max\_HP\_in\_Party} \times 0.05) \times (1 + (\text{Party\_Size} - 1) \times 0.1)$$

### B. Lộ trình Vượt Ải (4 Map lớn và các Map nhỏ phụ bản)

Người chơi phải dọn dẹp quái vật và hoàn thành thử thách ở mỗi map nhỏ (3-4 map nhỏ mỗi vùng) mới mở portal sang map nhỏ tiếp theo. Map nhỏ cuối cùng của mỗi vùng lớn sẽ chứa Boss gác cổng. Tiêu diệt Boss này mới mở lối đi sang Map lớn tiếp theo.

1.  **MAP LỚN 1: BIÊN GIỚI LÀNG MỘC (Gồm 3 map nhỏ)**
    *   *Các map nhỏ 1A, 1B*: Tiêu diệt lính gác tuần tra Sa Cát Thôn và bảo vệ xe hàng qua cạm bẫy.
    *   *Map nhỏ 1C (Boss phụ)*: Cổng ra bị khóa bởi kết giới nối với 2 Trụ Phép trên vách đá cao. Tổ đội phải có ít nhất 1 người dùng kỹ năng **Bay** lên phá hủy trụ phép (tiêu tốn mana liên tục), trong khi những người còn lại ở dưới đất chiến đấu thu hút quái vật và hạ gục Thượng Nhẫn Sa Cát Thôn (Boss phụ).
2.  **MAP LỚN 2: THUNG LŨNG CÁT LÀNG PHONG (Gồm 3 map nhỏ)**
    *   *Các map nhỏ 2A, 2B*: Vượt địa hình hoang mạc/đầm lầy cát lún độc hại (nếu rơi xuống nước cát lún mất 10% HP/giây). Đòn đấm của quái vật có hiệu ứng đẩy lùi.
    *   *Map nhỏ 2C (Boss phụ)*: Trận chiến với Thượng Nhẫn Sa Mạc trên các bục đá di động. Người chơi phải liên tục nhảy bục và giữ cự ly để tránh bị đấm rơi xuống vùng cát lún độc.
3.  **MAP LỚN 3: DÒNG SÔNG CẦU HỎA TUYẾN (Gồm 4 map nhỏ)**
    *   *Các map nhỏ 3A, 3B, 3C*: Sử dụng kỹ năng **Đi Trên Nước** chiến đấu trực diện với thủy quái do Hắc Thạch Thôn triệu hồi. Nếu Mana < 40%, bị rơi xuống nước thì tốc độ đánh/thi triển chiêu bị giảm 30% so với bình thường.
    *   *Map nhỏ 3D (Boss phụ)*: Tổ đội phải chia làm 2 ngả độc lập: Ngả trên không (người bay kích hoạt cần gạt) và Ngả mặt nước (người đi trên nước chiến đấu). Cả hai ngả phải hạ Boss Thủy Quái cùng lúc để mở cổng sang Tế Đàn Làng Thổ.
4.  **MAP LỚN 4: TẾ ĐÀN LÀNG THỔ (Gồm 3 map nhỏ)**
    *   *Các map nhỏ 4A, 4B*: Vượt qua các Vệ Binh Đất Đá tuần tra với sát thương cực lớn.
    *   *Map nhỏ 4C (BOSS ĐẠI CHIẾN)*: Tiêu diệt **Boss Thần Tướng Sa Đọa (Dạng Cực Hạn)** của Hắc Thạch Thôn. Khi HP Boss xuống dưới 50%, Boss phân thân thành 3 bản thể (Lửa, Gió, Linh Hồn). Tổ đội phải phối hợp hạ cả 3 bản thể trong vòng 10 giây cùng lúc để giành chiến thắng.

### C. Phần thưởng chiến dịch
*   Nhân **300% lượng Chakra** nhận được (tự động cộng thẳng vào ví khi diệt quái).
*   Nhận **Rương Linh Thú Tối Cao**:
    *   Đảm bảo mở ra nhận ngẫu nhiên **Thần Thú Ngọc 4★, 5★ hoặc 6★**.
    *   Có tỷ lệ rơi mảnh Hồn Linh Thú cao cấp để dùng kích hoạt dòng thuộc tính ẩn và hiệu ứng hào quang nhẫn giả đặc trưng.

---

## 10. KẾ HOẠCH XÁC MINH & CHẠY THỬ (VERIFICATION PLAN)

*   **Xác minh hoạt động 15 Nhiệm vụ (Tiến trình Backend)**:
    *   Kiểm tra việc lưu/đọc dữ liệu nhiệm vụ từ database thông qua REST API.
    *   Xác minh các mốc Khóa Tập Luyện (Level 4 và Level 6) chặn thành công không cho nhận nhiệm vụ tiếp theo nếu chưa đạt điều kiện sức mạnh.
    *   Xác minh trao thưởng Thần Thú Ngọc 1★, 2★, 3★ khi nhận thưởng nhiệm vụ chính 4, 6, 9.
*   **Xác minh dấu hiệu NPC Quest**: Xác minh biểu tượng `!` và `?` đổi trạng thái chính xác theo tiến trình nhiệm vụ.
*   **Xác minh Vật lý Nước & Bay**:
    *   *Bay*: PC dùng phím Lên/W và Trái/Phải; Mobile dùng kéo Joystick lên trên để bay. Kiểm tra bay tiêu hao 3 Mana/giây.
    *   *Rơi Tự Do (Freefall)*: Khi Mana xuống dưới 40%, kiểm tra nhân vật tự động thoát bay, mất điều khiển ngang (chỉ còn 15% quán tính), rơi thẳng đứng với gia tốc. Kiểm tra các nút nhảy, bay, đánh đấm/chưởng bị khóa trong khi rơi. Tiếp đất kiểm tra nhân vật bị stun 0.5s và có khói bụi bụi đất.
    *   *Nước*: Đứng trên nước hao 2 Mana/giây, xuất hiện vòng gợn nước phát sáng dưới chân. Khi Mana < 40%, nhân vật rơi xuống nước, vẫn chạy/di chuyển bình thường nhưng tốc độ đấm và tốc độ hồi/thi triển chưởng bị giảm đi 30%.
*   **Xác minh Hồn Linh Thú**: Sử dụng Hồn Linh Thú để khảm vào trang bị kích hoạt các dòng thuộc tính ẩn và hiệu ứng hình ảnh thành công.
*   **Xác minh Quái Tinh Anh (Elite) - Kịch bản Test cho Phase 3**:
    *   Kiểm tra tăng HP (+150%) hoạt động chính xác.
    *   Kiểm tra sát thương của đòn đánh quái Tinh Anh gây mất đúng **10% - 15% HP tối đa** của người chơi (bất kể chỉ số phòng thủ).
    *   *Test Tinh Anh Phân Thân*: Nhân bản 2 phân thân ở < 50% HP, giữ mục tiêu đỏ ở bản gốc.
    *   *Test Tinh Anh Địa Lôi*: Vùng lôi slam khóa thành công bay/nhảy trong 3s.
    *   *Test Tinh Anh Hộ Thuẫn*: Khiên cam block đấm, khiên lam block chưởng luân phiên 5s.
*   **Xác minh Thanh Nộ Tối Thượng**:
    *   Kiểm tra sạc nộ khi tấn công/chịu đòn, khóa giữ nộ ở 100% không bị tụt.
    *   Kiểm tra logic **quay ngẫu nhiên nhận 1 trong 4 skill bá đạo** khi kích hoạt.
*   **Xác minh Cây Thần Ảo Mộng**:
    *   Kiểm tra logic thu thập đủ 9 ngọc mới cho triệu hồi.
    *   Kiểm tra hiệu ứng rung camera, chuyển màu nền sang tối trăng máu, quái vật tăng 30% sát thương đòn đánh.
*   **Xác minh Doanh Trại Co-op Gauntlet Raid**:
    *   Kiểm tra chặn không cho đi solo (tổ đội phải có ít nhất 2 người và tối đa 8 người mới cho vào cổng).
    *   Kiểm tra thuật toán **Scale chỉ số quái vật** theo thời gian thực dựa trên số lượng và sức mạnh của tổ đội người chơi.
    *   Xác minh cấu trúc vượt ải: dọn quái qua các bản đồ nhỏ, tiêu diệt Boss nhỏ gác cổng để qua bản đồ lớn tiếp theo.
    *   Xác minh các cơ chế phối hợp: kích hoạt mở kết giới bằng phá trụ nhãn trên cao khi đang bay, đi trên nước chia ngả và đo thời gian hạ gục 3 phân thân Boss đồng thời (dưới 10 giây).