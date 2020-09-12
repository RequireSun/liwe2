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

#### 指定下标

从名为 `property_name` 的数组属性中读取 `index1` 到 `index2` 之间的记录。

```SQL
SELECT * FROM property_name LIMIT index1, index2
```

等价语句：`property_name.slice(index1, index2)`

__注意：LIMIT 语法与 slice 函数参数定义不同__

#### 指定条件

从名为 `property_name` 的数组属性中读取 `key` 值为 `value` 的记录。

```SQL
SELECT * FROM property_name WHERE key=value
```

等价语句：`property_name.filter(record => record.key === value)`

##### 变种 - 多条件并联

从名为 `property_name` 的数组属性中读取 `key1` 值为 `1001` 或 `1002`，`key2` 值为 `'yes'` 的记录。

```SQL
SELECT * FROM property_name WHERE (key1 = 1001 OR key1 = 1002) AND key2 = 'yes'
```

等价语句：`property_name.filter(record => (record.key1 === 1001 || key1 === 1002) && key2 === 'yes')`

#### 提取记录集合内的特定属性形成新集合

从名为 `property_name` 的数组属性中按照某条件读取一些记录，然后提取每条记录中的 `name`、`age` 属性形成新的记录集合。

```SQL
SELECT name, age FROM property_name WHERE ...
```

等价语句：

```javascript
property_name.filter(...).map(({ name, age }) => ({ name, age }))
```

_Ps：感觉用处不大，可以往后放一放_

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

从名为 `property_name` 的对象属性中读取一个属性：`key1`。

```SQL
SELECT key1 from property_name;
```

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

## 问题 & 思考

1. 数组操作结果都是数组、对象 or 原始值操作结果都是原始值？
1. 是否需要提供 `entries` 或 `reduce` 类似的函数方便记录 - 集合互转？
