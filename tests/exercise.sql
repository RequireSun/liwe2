-- 测试地址：https://www.tutorialspoint.com/execute_sql_online.php

-- -- -- -- -- 表结构初始化 -- -- -- -- --

CREATE TABLE name (
    _value varchar(255)
);

CREATE TABLE address (
    _value varchar(255)
);

CREATE TABLE phone (
    _value varchar(255)
);

CREATE TABLE records (
    name varchar(255),
    address varchar(255),
    phone varchar(255)
);

CREATE TABLE kv_map (
    key1 varchar(255),
    key2 varchar(255),
    key3 varchar(255)
);

-- -- -- -- -- 数据结构初始化 -- -- -- -- --

INSERT INTO name VALUES('Jack');
INSERT INTO address VALUES('Hangzhou');
INSERT INTO phone VALUES('13333333333');

-- 这句不要看，因为对象结构使用 UPDATE 进行数据操作，所以必须要搞一条初始数据进去

INSERT INTO kv_map(key1, key2, key3) VALUES('1', '2', '3');

-- SELECT * FROM name;
-- SELECT * FROM address;
-- SELECT * FROM phone;

-- -- -- -- -- 数组新增一行 -- -- -- -- --

INSERT INTO records(name, address, phone)
    VALUES(
        (SELECT _value FROM name),
        (SELECT _value FROM address),
        (SELECT _value FROM phone)
    );

SELECT * FROM records;

-- -- -- -- -- 对象修改 / 新增属性 -- -- -- -- --

-- 注：这里有点小区别，普通 SQL 新增一列需要使用 ALTER，但这里是包装 JS 方言，所以用了类 JS 的 UPDATE 语句
UPDATE kv_map SET key1=(SELECT _value FROM name);

SELECT * FROM kv_map;
