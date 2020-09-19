-- 注：仅为测试 SQL 语法用，不保证与真实协议一一对应
-- 测试地址：https://www.tutorialspoint.com/execute_sql_online.php
-- 测试地址：https://repl.it/repls/SmugSuburbanUserinterface
-- 请选择 SQLite

-- 注：SQLite 的功能实在是太弱了，考虑转到 MySQL 语法
-- 日了，SQLite 连 left join 都不支持，还是换 MySQL 吧
-- 测试地址：https://paiza.io/en/languages/mysql

-- -- -- -- -- 表结构初始化 -- -- -- -- --

CREATE TABLE name (
    __value__ VARCHAR(255)
);

CREATE TABLE age (
    __value__ INTEGER
);

CREATE TABLE address (
    __value__ VARCHAR(255)
);

CREATE TABLE phone (
    __value__ VARCHAR(255)
);

CREATE TABLE records (
    name VARCHAR(255),
    age INTEGER,
    address VARCHAR(255),
    phone VARCHAR(255),
    -- 为了保证在 SQL 中运行正常, 真实情况下无需提供
    __index__ INTEGER NOT NULL AUTO_INCREMENT UNIQUE
);

CREATE TABLE num_arr (
    -- 按理来说 JS 的数组不应该有类型
    __value__ BIGINT,
    -- 为了保证在 SQL 中运行正常, 真实情况下无需提供
    __index__ INTEGER NOT NULL AUTO_INCREMENT UNIQUE
);

CREATE TABLE kv_map (
    key1 VARCHAR(255),
    key2 VARCHAR(255),
    key3 VARCHAR(255)
);

-- -- -- -- -- 数据结构初始化 -- -- -- -- --

INSERT INTO records(name, age, address, phone)
    VALUES
        ('Jack1', 10, 'Hangzhou1', '11111111111'),
        ('Jack2', 15, 'Hangzhou2', '22222222222'),
        ('Jack3', 20, 'Hangzhou3', '33333333333'),
        ('Jack4', 25, 'Hangzhou4', '44444444444'),
        ('Jack5', 30, 'Hangzhou5', '55555555555'),
        ('Jack5', 35, 'Hangzhou4', '66666666666');

INSERT INTO num_arr(__value__)
    VALUES
        (6),
        (5),
        (4),
        (3),
        (2);

INSERT INTO name VALUES('Jack');
INSERT INTO age VALUES(100);
INSERT INTO address VALUES('Hangzhou');
INSERT INTO phone VALUES('13333333333');

-- 这句不要看，因为对象结构使用 UPDATE 进行数据操作，所以必须要搞一条初始数据进去

INSERT INTO kv_map(key1, key2, key3) VALUES('1', '2', '3');

-- 这个表是用来给数组操作辅助添加 __index__ 用的

CREATE TABLE __indexes__ (
    __index__ INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    __useless__ varchar(1)
);

INSERT INTO __indexes__(__useless__)
    VALUES
        (''), (''), (''), (''),
        (''), (''), (''), (''),
        (''), (''), (''), ('');

-- SELECT * FROM name;
-- SELECT * FROM address;
-- SELECT * FROM phone;

-- -- -- -- -- 数组新增一行 -- -- -- -- --

INSERT INTO records(name, age, address, phone)
    VALUES(
        (SELECT __value__ FROM name),
        (SELECT __value__ FROM age),
        (SELECT __value__ FROM address),
        (SELECT __value__ FROM phone)
    );

SELECT '-- -- -- ALL records -- -- --';

SELECT * FROM records;

SELECT '';

-- -- -- -- -- slice 操作 -- -- -- -- --

SELECT '-- -- -- Slice records(1, 3) -- -- --';

SELECT * FROM records LIMIT 1, 3;

SELECT '';

-- -- -- -- -- filter 操作 -- -- -- -- --

SELECT '-- -- -- Filter records(name = ''Jack1'') -- -- --';

SELECT * FROM records WHERE name = 'Jack1';

SELECT '-- -- -- Filter records((name = ''Jack4'' || name = ''Jack5'') && address = ''Hangzhou4'') -- -- --';

SELECT * FROM records WHERE (name = 'Jack4' OR name = 'Jack5') AND address = 'Hangzhou4';

SELECT '';

-- -- -- -- -- map 操作 -- -- -- -- --

SELECT '-- -- -- Map records(name, age) -- -- --';

SELECT name, age FROM records;

SELECT '-- -- -- Map records(name -> customer, age >= 18 -> adult) -- -- --';

SELECT name AS customer, age >= 18 AS adult FROM records;

SELECT '';

-- -- -- -- -- 更新操作 -- -- -- -- --

SELECT '-- -- -- Set records(index = 2 -> name = ''Dr. '' + name) -- -- --';
SELECT '-- -- -- Set records(phone = phone.__value__ -> name = address.__value__ + '' von '' + name) -- -- --';

-- 这里有魔改空间
UPDATE records SET name = CONCAT('Dr. ', name) WHERE __index__ = 2;

UPDATE records SET name = CONCAT((SELECT __value__ FROM address), ' von ', name) WHERE phone = (SELECT __value__ FROM phone);

SELECT * FROM records;

SELECT '';

-- -- -- -- -- 顺序操作 -- -- -- -- --

SELECT '-- -- -- 该部分 LQL 设计与 SQL 不同，所以需要在 SQL 中添加辅助函数 -- -- --';
SELECT '-- -- -- Update records(4 <= __index__ <= 6 -> 1 <= __index__ <= 3) -- -- --';
SELECT '-- -- -- Insert records(between 4 < __index__ < 5) -- -- --';

-- 辅助函数 1: 将目标位置与当前位置间的元素全部标记 (置负)
UPDATE records SET __index__ = -__index__ WHERE __index__ >= 1 AND __index__ < 4;
-- 此处 3 的含义: 向前平移 3 位
UPDATE records SET __index__ = __index__ - 3 WHERE __index__ >= 4 AND __index__ <= 6;
-- 辅助函数 2: 将刚刚标记的元素修正回正确位置 (此处 3 的含义: 插入了 3 个元素)
UPDATE records SET __index__ = 3 - __index__ WHERE __index__ < 0;

-- INSERT INTO records(name, age, address, phone, __index__)
--     VALUES
--         ('Pony', 40, 'Shenzhen1', '17777777777', 4),
--         ('Pony', 45, 'Shenzhen2', '18888888888', 5);

SELECT * FROM records;

SELECT '';

-- -- -- -- -- 删除操作 -- -- -- -- --

SELECT '-- -- -- Delete records(index = 4) -- -- --';

DELETE FROM records WHERE __index__ = 4;

-- 更复杂的 WHERE 从句不演示了

SELECT * FROM records;

SELECT '';

-- -- -- -- -- 原始值数组 -- -- -- -- --

SELECT '-- -- -- Push num_arr(1) -- -- --';
SELECT '-- -- -- Set num_arr(__index__ = 3 -> __value__ += 10) -- -- --';
SELECT '-- -- -- Delete num_arr(__value__ = 5) -- -- --';

INSERT INTO num_arr(__value__) VALUES(1);

UPDATE num_arr SET __value__ = __value__ + 10 WHERE __index__ = 3;

DELETE FROM num_arr WHERE __value__ = 5;

SELECT __value__ FROM num_arr;

SELECT '';

-- -- -- -- -- 对象修改 / 新增属性 -- -- -- -- --

-- 注：这里有点小区别，普通 SQL 新增一列需要使用 ALTER，但这里是包装 JS 方言，所以用了类 JS 的 UPDATE 语句
UPDATE kv_map SET key1=(SELECT __value__ FROM name);

SELECT '-- -- -- Set map(key1 = name.__value__) -- -- --';

SELECT * FROM kv_map;

SELECT '';
