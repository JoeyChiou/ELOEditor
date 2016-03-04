var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('userdata.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS `users` (
                `user_id` int(10) NOT NULL,
                `name` varchar(128) NOT NULL,
                `password` varchar(256) NOT NULL,
                `email` varchar(256) NOT NULL,
                PRIMARY KEY (`user_id`))");
});

function dbUserRun (queries) {
    db.serialize(function() {
        db.run(queries);

        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
          stmt.run("Ipsum " + i);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
          console.log(row.id + ": " + row.info);
        });
    });

    db.close();
}
