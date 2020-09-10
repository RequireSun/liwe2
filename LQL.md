LQL 语法说明
===

页面数据仓库 ROOT 上的任何属性均由初始化脚本 / JS 生成，不可动态修改，所以不提供任何删除、新增 ROOT 属性的指令。 

对应关系:

| DB | LQL |
| --- | --- |
| TABLE | @observable 修饰的属性 |

## 关键字

| 名称 | 场景 | 介绍 |
| --- | --- | --- |
| index | `WHERE` 子句中 | 作下标查询时用 |
| value | `UPDATE` 子句中 | 表示更新指定记录的整个值（而非某个属性） |

## 数组操作

### 读取

__TODO__

### 新增

向名为 `property_name` 的数组属性中 push 一个对象：`{ key1: value1, key2: value2, key3: value3 }`。

```SQL
INSERT INTO property_name(key1, key2, key3) VALUES(value1, value2, value3)
```

#### 元素为非对象时

向名为 `property_name` 的数组属性中 push 一个原始值 `value`。

```SQL
INSERT INTO property_name VALUES(value)
```

### 修改

修改名为 `property_name` 的数组属性中下标为 `n` 的记录（`key1 => value1`，`key2 => value2`）：

```SQL
UPDATE property_name SET key1 = value1, key2 = value2 WHERE index = n
```

#### 元素为非对象时

修改名为 `property_name` 的数组属性中下标为 `n` 的记录为原始值 `value`。

```SQL
UPDATE property_name SET value=value WHERE index = n
```

### 删除

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

### 删除

在名为 `property_name` 的对象属性中删除一个属性：`key1`。

```SQL
DELETE FROM property_name WHERE key = key1
```

## 原始值

### 读取

__TODO__

### 修改

修改名为 `property_name` 的属性的值为 `value`：

```SQL
UPDATE property_name SET value = value
```

## 初始化页面数据仓库

__TODO__

## TODOs

- [ ] 数组顺序修改 / 插入位置控制
- [ ] 类 `a.b.c.d` 格式的深层级数据修改
- [ ] `WHERE` 与 `find` 的关系对应
- [ ] 嵌套语句
