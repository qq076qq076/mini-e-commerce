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
