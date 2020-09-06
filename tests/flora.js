const { Parser } = require('flora-sql-parser');
const parser = new Parser();

console.log(parser.parse('SELECT * FROM t'));
console.log(parser.parse(`SELECT name FROM bbc
WHERE population>
(SELECT population FROM bbc
WHERE name='Russia')`));
console.log(parser.parse(`insert into mytable(X,Y,Z)
Values((SELECT X from basetable WHERE ID = 8),(SELECT Y from basetable WHERE ID = 8),(SELECT Z from basetable WHERE ID = 8))`));
