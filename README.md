# BookMatch mock-up (ITDS294)

This is a clickable, responsive web-app prototype for report section 5, in Thai and English. It's static HTML/CSS/JS with no build step:

| File | What it holds |
|---|---|
| `index.html` | Page shell; loads the font, Leaflet, `styles.css` and `app.js` |
| `styles.css` | Palette tokens, layout for phone/tablet/PC, every component |
| `app.js` | Mock data, Thai/English text, booking logic, map, player and owner screens |
 Data is saved in localStorage. All venues, customers, map positions and payments are made up, and no money is ever charged. It needs an internet connection for the map, which loads Leaflet from cdnjs and Esri tiles, and for the Carlito font.

Open `index.html` in a browser (keep the three files together). Any login button gets you in. The TH/EN button at the top of each page (or Profile → Language) switches language, and the choice is remembered.

## Layouts

| Width | Navigation | Notes |
|---|---|---|
| Phone (< 768 px) | Bottom tab bar | Fixed booking bar at the bottom, sheets slide up |
| Tablet (768–1099 px) | Icon rail on the left | 2-column venue grid, sheets open as centred dialogs |
| PC (≥ 1100 px) | Full sidebar | Venue and checkout pages get a sticky summary panel; the map page puts the list on the left and the map on the right |

## Font

Calibri everywhere. Carlito, Calibri's metric-compatible twin on Google Fonts, is the fallback on machines without Calibri. Calibri has no Thai glyphs, so Thai text falls back to Leelawadee UI on Windows (the font Windows pairs with Calibri), Thonburi on Mac, or Noto Sans Thai.

## Palette

| Token | Hex | Used for |
|---|---|---|
| brand | `#0B7A4B` | Primary buttons, selected slots, links |
| brand-d | `#075233` | Hover / dark green text |
| brand-l | `#E3F4EA` | Green tints, "ว่าง" badges |
| lime | `#C8F25A` | Accent: "ของคุณ" slots, logo, highlights |
| ink | `#10201A` | Main text, dark cards |
| mut | `#5F6F66` | Secondary text |
| line | `#E2E8E3` | Borders |
| bg | `#F1F4F1` | Page background |
| card | `#FFFFFF` | Cards |
| amber | `#E89A2C` (tint `#FDF1DD`, text `#7C4E0E`) | MatchQueue, ratings |
| red | `#C9473F` (tint `#FBE7E5`) | Cancel, errors, badges |
| blue | `#2F6FD1` (tint `#E4EDFB`) | Reminders, futsal pins |
| Sport pins | football `#0B7A4B` · futsal `#2F6FD1` · badminton `#7A3FB0` · basketball `#C25A1C` | Map pins and venue art |
| Owner sources | app `#0B7A4B` · phone `#6C98DE` · walk-in `#A57BD0` | Owner charts and schedule |

## Screens → MoSCoW (report 2.5 / 5.2)

| Priority | Feature | Where |
|---|---|---|
| Must | Venue timetable + free times | Home → venue → "ตารางเวลาว่าง" |
| Must | Booking (up to 3 consecutive hours) | Tap free cells → จองเลย |
| Must | Cancellation rule | Cancel up to 24 hrs before play for a full refund; inside 24 hrs the booking is locked |
| Must | Payment (PromptPay QR / card / TrueMoney) | Checkout → ชำระเงิน (simulated) |
| Must | Notifications | แจ้งเตือน + push banners; "จำลองเตือนก่อนเล่น" |
| Must | Owner booking schedule | มุมมองเจ้าของสนาม → ตารางจอง (log phone/walk-in bookings, block slots) |
| Should | MatchTime | Pick friends → overlap heatmap → venues free then → booking invites them |
| Should | MatchQueue | Tap a full cell → เข้าคิว; การจอง → "จำลอง: มีคนยกเลิก" → offer with countdown (owner sets 10/15/30 min) |
| Should | MatchPitch | Venue → "MatchPitch ข้อมูลสนาม" (layout, facilities, mini map, reviews) |
| Extra | Area search with map pin | แผนที่ tab: type an area, tap the map or drag the pin, radius 1–20 km, sport filter, current location |
| Extra | Thai / English | TH/EN toggle on every main page; dates, venue details, notifications and reviews all switch |
| Extra | Login, history, reviews, rebook | Login screen; การจอง → ที่ผ่านมา → ให้คะแนน / จองอีกครั้ง |
| Extra | Pitch management | Owner → ตั้งค่าและแพ็กเกจ: add (up to 6), rename and remove pitches, each with its own type (5/7/11-a-side) and hourly price; the player timetable, prices and checkout follow |
| Extra | Owner settings and revenue model | ตั้งค่าและแพ็กเกจ: Pro plan ฿990/month after a free trial, Boost ฿300/month, 7% commission in the payout |
| Could / Won't | MatchMake, Tournament, Streak, MatchAnalysis | Not built |

## Usability test (report 5.5)

After each booking, the success screen shows how long it took, from opening the timetable to finishing payment, and whether that beat the 2-minute target. Use โปรไฟล์ → รีเซ็ตข้อมูลตัวอย่าง to clear the data between test users.
