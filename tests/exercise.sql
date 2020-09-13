-- 注：仅为测试 SQL 语法用，不保证与真实协议一一对应
-- 测试地址：https://www.tutorialspoint.com/execute_sql_online.php
-- 测试地址：https://repl.it/repls/SmugSuburbanUserinterface
-- 请选择 SQLite

-- -- -- -- -- 表结构初始化 -- -- -- -- --

CREATE TABLE name (
    _value VARCHAR(255)
);

CREATE TABLE age (
    _value INTEGER
);

CREATE TABLE address (
    _value VARCHAR(255)
);

CREATE TABLE phone (
    _value VARCHAR(255)
);

CREATE TABLE records (
    name VARCHAR(255),
    age INTEGER,
    address VARCHAR(255),
    phone VARCHAR(255),
    -- 为了保证在 SQL 中运行正常, 真实情况下无需提供
    _index INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE num_arr (
    -- 按理来说 JS 的数组不应该有类型
    _value BIGINT,
    -- 为了保证在 SQL 中运行正常, 真实情况下无需提供
    _index INTEGER PRIMARY KEY AUTOINCREMENT
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

INSERT INTO num_arr(_value)
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

-- SELECT * FROM name;
-- SELECT * FROM address;
-- SELECT * FROM phone;

-- -- -- -- -- 数组新增一行 -- -- -- -- --

INSERT INTO records(name, age, address, phone)
    VALUES(
        (SELECT _value FROM name),
        (SELECT _value FROM age),
        (SELECT _value FROM address),
        (SELECT _value FROM phone)
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
SELECT '-- -- -- Set records(phone = phone._value -> name = address._value + '' von '' + name) -- -- --';

-- 这里有魔改空间
UPDATE records SET name = 'Dr. ' || name WHERE _index = 2;

UPDATE records SET name = (SELECT _value FROM address) || ' von ' || name WHERE phone = (SELECT _value FROM phone);

SELECT * FROM records;

SELECT '';

-- -- -- -- -- 删除操作 -- -- -- -- --

SELECT '-- -- -- Delete records(index = 4) -- -- --';

DELETE FROM records WHERE _index = 4;

-- 更复杂的 WHERE 从句不演示了

SELECT * FROM records;

SELECT '';

-- -- -- -- -- 原始值数组 -- -- -- -- --

SELECT '-- -- -- Push num_arr(1) -- -- --';
SELECT '-- -- -- Set num_arr(_index = 3 -> _value += 10) -- -- --';

INSERT INTO num_arr(_value) VALUES(1);

UPDATE num_arr SET _value = _value + 10 WHERE _index = 3;

SELECT _value FROM num_arr;

SELECT '';

-- -- -- -- -- 对象修改 / 新增属性 -- -- -- -- --

-- 注：这里有点小区别，普通 SQL 新增一列需要使用 ALTER，但这里是包装 JS 方言，所以用了类 JS 的 UPDATE 语句
UPDATE kv_map SET key1=(SELECT _value FROM name);

SELECT '-- -- -- Set map(key1 = name._value) -- -- --';

SELECT * FROM kv_map;

SELECT '';
