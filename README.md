# mini-e-commerce

## 核心功能

1. 商品清單：需包含 `id`、`title`、`price`、`image`。
2. 購物流程：
   - Hover 商品圖片時顯示「加入購物車」按鈕，點擊後顯示加入購物車 dialog。
   - Dialog 需顯示商品資訊，並提供數量輸入欄位（必填）；點擊確認即可加入購物車。
3. 購物車預覽：
   - 顯示已選商品清單、單價、數量，並自動計算總金額。

## 開發流程

1. 測試先行
2. 開發程式
3. code format

## 目錄規範

```text
src/
  components/       # UI 元件（僅處理畫面與互動事件）
  data/             # 靜態資料來源（目前為 in-memory products）
  repositories/     # 資料存取層（ex: InMemory / API）
  services/         # 商業資料服務層（對外提供可用資料）
  store/            # Vuex（state/getters/actions/mutations）
  types/            # 全域型別定義（Product、Cart payload 等）
tests/unit/         # 單元測試
```

1. `components` 不直接處理資料來源，僅透過 Vuex 讀寫資料。
2. `store` 不直接依賴 `data`，統一透過 `service/repository` 取得資料。
3. 新增功能時，優先依序評估：`types -> repository -> service -> store -> component -> tests`。

## 狀態流

1. 畫面觸發事件（例如加到購物車、調整數量）。
2. Component 呼叫 `dispatch(ActionType.xxx)`。
3. Action 負責流程入口，並 `commit(MutationType.xxx)`。
4. Mutation 寫入 `state`（唯一資料寫入點）。
5. Getter 計算衍生資料（`cartItemCount`、`cartPreviewItems`、`cartTotalAmount`）。
6. Component 透過 computed 讀取 `state/getters` 後重新渲染。

## 命名規則

1. 檔名：
   - Vue 元件使用 `PascalCase`（例：`ProductDetailDialog.vue`）。
   - service / repository / data 使用 `camelCase`（例：`productService.ts`）。
2. 型別：
   - `interface` / `type` 使用 `PascalCase`（例：`RootState`, `AddToCartPayload`）。
   - enum 名稱使用 `PascalCase`，成員使用 `UPPER_SNAKE_CASE`（例：`MutationType.ADD_TO_CART`）。
3. 變數與函式：使用 `camelCase`，且需明確標註 TypeScript 型別。
4. `data-test` 屬性：使用 `kebab-case`，避免與 class 命名耦合。
5. getter / action key：
   - getter key 使用可讀字串（例：`cartItemCount`）。
   - action key 使用動詞開頭（例：`addToCart`, `removeFromCart`）。

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Runs unit tests

```
npm run test:unit
```

### Lint and format

```
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
