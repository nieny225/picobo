# 上線：picobo.net（GitHub Pages ＋ Gandi DNS）

網站是純靜態檔案，不需要建置。GitHub Pages 直接把 `main` 分支的根目錄當網站。
repo 裡已經有：

- `CNAME`：內容是 `picobo.net`，告訴 GitHub Pages 用這個網域。
- `.nojekyll`：叫 GitHub Pages 不要跑 Jekyll，檔案原樣上線。

## 1. GitHub：repo 改公開、準備 main 分支

1. repo → Settings → General → 最下面 Danger Zone → Change repository
   visibility → Public。
2. 要有一個 `main` 分支，內容是最新的開發分支，並設成預設分支
   （Settings → General → Default branch）。

## 2. GitHub：驗證網域（建議，防止別人搶用你的網域）

1. 右上角頭像 → Settings → Pages → Add a domain → 輸入 `picobo.net`。
2. GitHub 會給一筆 TXT 記錄，名稱像 `_github-pages-challenge-nieny225`，值是一串亂碼。
3. 先到下面第 3 步把這筆 TXT 加進 Gandi，再回來按 Verify。

## 3. Gandi：DNS 記錄

Gandi 後台 → Domain → picobo.net → DNS Records。

**先刪掉 Gandi 預設的記錄**（不刪會跟 GitHub 衝突）：

- `@` 的 A 記錄（值是 `217.70.184.38`，Gandi 的停放頁）
- `@` 的 AAAA 記錄（如果有）
- `www` 的 CNAME（值是 `webredir.vip.gandi.net.`）

如果 picobo.net 有開 Web Forwarding（網址轉址），也在 Gandi 的
Web Forwarding 分頁把它刪掉。

**再新增**（TTL 用 300 就好）：

| 類型 | 名稱 | 值 |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | nieny225.github.io. |
| TXT | _github-pages-challenge-nieny225 | （第 2 步 GitHub 給的值） |

`www` 的值最後有一個句點，Gandi 的格式需要它。
MX 等跟信箱有關的記錄不要動。

## 4. GitHub：打開 Pages

1. repo → Settings → Pages。
2. Build and deployment → Source 選 Deploy from a branch，
   Branch 選 `main`、資料夾 `/ (root)`，按 Save。
3. Custom domain 應該已經自動帶出 `picobo.net`（來自 `CNAME` 檔），
   沒有的話手動填入後 Save。GitHub 會檢查 DNS，DNS 生效通常要幾分鐘到一小時。
4. DNS check 通過、憑證發好之後，勾 Enforce HTTPS。

## 5. 確認

- https://picobo.net 打得開，網址列有鎖頭。
- https://www.picobo.net 會自動轉到 https://picobo.net。
- 手機打開三個分頁都有內容，計分板重新整理後分數還在（localStorage）。

## 之後怎麼更新

改動合併進 `main` 就會自動重新部署，約一兩分鐘生效。
