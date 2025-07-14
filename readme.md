# Project Guide

## 🧪 Run Project

```bash
yarn install
yarn dev
```

---

## 🌐 Routing

All page routes are located under:

```
/pages/[page name]
```

---

## 📦 Basic Structure

### 1. Routing  
- Located in: `/pages/[page name]`

### 2. List Data Fetching Component  
- Handles paginated data retrieval  
- Located in:  
  ```
  /components/template/[component name]
  ```

### 3. List Container  
- Main UI wrapper for list  
- Located in:  
  ```
  /components/organism/Panel_[component name]
  ```

> 🔧 **TODO**:  
> `OrderList` (used for column config) is currently located in `/components/organism/OrderList`.  
> This path is not ideal and needs restructuring.

### 4. Modals Container  
- Handles modal editing and views  
- Located in:  
  ```
  /components/organism/Modal_[component name]
  ```

> 🔧 **TODO**:  
> File naming is too generic.  
> Should be improved for scalability (e.g., future modularization).

---

## ⚙️ Configs

### Field-to-Title Mapping

- File:  
  ```
  /lib/constants/constants_labelMapping.js
  ```

> 🔧 **TODO**:  
> File name too generic — should be renamed for better specificity.

---

## 🧩 Core Modal: `Modal_OrderEdit`

Located in:
```
/components/organism/Modal_OrderEdit
```

### Key File: `LocalDataProviders.js`
- Serves as a control center for data management.

### Behavior Logic

#### If input is **disabled**:
- Check via:  
  - `Com.js/checkEditableById`  
  - `Com.js/checkEditableByGroup`

#### If input is **required**:
- Logic handled in:  
  - `hooks/vconfig.js`

---

## ➕ Adding a New Field in Order Management (OM)

### To the List View

1. **Display Settings**  
   File:  
   ```
   /components/organism/OrderList/index.jsx
   ```
   - Controls which fields are shown
   - Handles conditional hiding

2. **Column Mapping & Ordering**  
   File:  
   ```
   /components/organism/OrderList/_constants.js
   ```
   - Maps status → columns  
   - Defines column ordering

3. **Field Naming**  
   File:  
   ```
   /lib/constants/constants_labelMapping.js
   ```
   - Controls fallback column names if `title` is not set  
   - Also used for history/modals naming

### To the Edit Modal

1. **Locate the target `sec_` section**

2. **Use Existing Editable Components**  
   - Located in:  
     ```
     /components/molecule/Editable
     ```
   - All editable field types live here

> 🛠️ In the future:  
> Consider adding new input types (e.g., a date-time picker with time selection).
