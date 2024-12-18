# Category API Documentation

This document provides the **Category API** endpoints and their details in table format.

---

## Base URL

Replace `{{Domain}}` with the actual base URL.

**Example**: `http://localhost:9999/.netlify/functions/app`

---

## Endpoints

### 1. Create Category

| Method | Endpoint                      | Request Body                                                                                     |
|--------|--------------------------------|--------------------------------------------------------------------------------------------------|
| POST   | `{{Domain}}/api/v1/category`   | ```{ "categoryName": "Foot Wear""categoryParentId": "675f21b86978ce3117ae15f1"}``` |

---

### 2. Create Root Category

| Method | Endpoint                      | Request Body                                                                                     |
|--------|--------------------------------|--------------------------------------------------------------------------------------------------|
| POST   | `{{Domain}}/api/v1/category`   | ```json<"">{<"">  "categoryName": "Foot Wear",  "isRoot": true}```                       |

---

### 3. Get Category By ID

| Method | Endpoint                                | Query Parameter                        |
|--------|----------------------------------------|----------------------------------------|
| GET    | `{{Domain}}/api/v1/category/ById`       | `categoryId=men`                       |

---

### 4. Get Children By Category ID

| Method | Endpoint                                 | Query Parameter                                     |
|--------|-----------------------------------------|----------------------------------------------------|
| GET    | `{{Domain}}/api/v1/category/children`    | `categoryId=675f21b86978ce3117ae15f7` *(optional)* |

---

### 5. Update Category

| Method | Endpoint                      | Request Body                                                                                     |
|--------|--------------------------------|--------------------------------------------------------------------------------------------------|
| PATCH  | `{{Domain}}/api/v1/category`   | ```{  "categoryId": "67601d950b90a48abcccf738",  "categoryName": "Men"}```    |

---

### 6. Delete Category

| Method | Endpoint                                 | Query Parameter                                     |
|--------|-----------------------------------------|----------------------------------------------------|
| DELETE | `{{Domain}}/api/v1/category/children`    | `categoryId=675f21b86978ce3117ae15f7`              |

---

## Environment Variables

| Key       | Value                                     |
|-----------|------------------------------------------|
| `Domain`  | `https://categorylambda.netlify.app/.netlify/functions/app` |

---

## Notes

- Replace `categoryId` or `categoryParentId` with actual IDs when testing.
- Request body examples are written in **JSON** format for `POST` and `PATCH` requests.

---

## License

This API documentation is provided to assist developers with testing and integration of the Category API.
