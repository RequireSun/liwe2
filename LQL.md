LQL 语法说明
===

页面数据仓库 ROOT 上的任何属性均由初始化脚本 / JS 生成，不可动态修改，所以不提供任何删除、新增 ROOT 属性的指令。 

对应关系:

| DB | LQL |
| --- | --- |
| DATABASE | 每个独立的数据仓库（页面 or 引入的通用数据仓库） |
| TABLE | @observable 修饰的属性 |
| RECORD | 集合中的一条记录（数组元素 or 对象属性） |

## 关键字

| 名称 | 场景 | 介绍 |
| --- | --- | --- |
| index | `WHERE` 子句中 | 作下标查询时用 |
| value | `UPDATE` 子句中 | 表示更新指定记录的整个值（而非某个属性） |

## 数组操作

### 读取

__TODO__

（`slice`）从名为 `property_name` 的数组属性中读取 `index1` 到 `index2` 之间的记录。

（`filter`）从名为 `property_name` 的数组属性中读取

### 新增

向名为 `property_name` 的数组属性中新增一个对象：`{ key1: value1, key2: value2, key3: value3 }`。

```SQL
INSERT INTO property_name(key1, key2, key3) VALUES(value1, value2, value3)
```

等价语句：

```javascript
property_name.push({ 
    key1: value1, 
    key2: value2, 
    key3: value3,
})
```

#### 元素为非对象时

向名为 `property_name` 的数组属性中 push 一个原始值 `value`。

```SQL
INSERT INTO property_name VALUES(value)
```

等价语句：`property_name.push(value)`

### 修改

修改名为 `property_name` 的数组属性中下标为 `n` 的记录（`key1 => value1`，`key2 => value2`）：

```SQL
UPDATE property_name SET key1 = value1, key2 = value2 WHERE index = n
```

等价语句：

```javascript
property_name[n].key1 = value1;
property_name[n].key2 = value2;
```

#### 元素为非对象时

修改名为 `property_name` 的数组属性中下标为 `n` 的记录为原始值 `value`。

```SQL
UPDATE property_name SET value=value WHERE index = n
```

等价语句：`property_name[n] = value`

### 删除

__TODO：这里是用 `delete` 还是 `splice`?__

删除名为 `property_name` 的数组属性中下标为 `n` 的记录：

```SQL
DELETE FROM property_name WHERE index = n
```

### 顺序控制

__TODO__

## 对象操作

### 读取

__TODO__

### 新增 / 修改

向名为 `property_name` 的对象属性中新增 / 修改一个属性：`key1: value1`。

```SQL
UPDATE property_name SET key1 = value1
```

等价语句：`property_name.key1 = value1`

### 删除

在名为 `property_name` 的对象属性中删除一个属性：`key1`。

```SQL
DELETE FROM property_name WHERE key = key1
```

等价语句：`delete property_name.key1`

## 原始值

### 读取

__TODO__

### 修改

修改名为 `property_name` 的属性的值为 `value`：

```SQL
UPDATE property_name SET value = value
```

等价语句：`property_name = value`

## 初始化页面数据仓库

__TODO__

## TODOs

- [ ] 数组顺序修改 / 插入位置控制（`splice`）

    可能需要通过自定义函数实现了
    
    或者是将 `index` 属性设置为关键字，修改后直接影响整个数组的排序，这样在插入的时候也可以随意控制了
    - [ ] 读取 / 写入时数组 / 对象的转换
    
        要不要限定我这里的输出都是数组（use `filter`, no `find`），这样似乎从概念上更好理解
- [ ] 类 `a.b.c.d` 格式的深层级数据修改
- [ ] `WHERE` 与 `find` 的关系对应
- [ ] 嵌套语句
- [ ] 初始化数据结构语句
    - [ ] 对象型属性如何初始化
