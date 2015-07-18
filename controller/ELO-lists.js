function ELO_List(divID) {
    db.count({}, function(err, count) {
        //db.find({}, function(err, docs) {
        db.find({}).sort({
            _id: 1
        }).exec(function(err, docs) {
            var div = document.getElementById(divID);
            var ul = document.createElement("ul");
            ul.setAttribute("class", "users-list clearfix");
            var li;
            var img;
            var a;
            var span;
            var title;
            var name;
            var elopath;

            for (var i = 0; i < count; i++) {
                title = docs[i].title;
                name = docs[i].name;
                elopath = docs[i].elopath;
                li = document.createElement("li");
                li.onclick = function() {
                    location.href = "eloviewer.html?=elopath=" + elopath;
                };
                img = document.createElement("img");
                img.setAttribute("src", "assets/img/book-64.png");
                img.setAttribute("alt", "User Image");
                a = document.createElement("a");
                a.setAttribute("class", "users-list-date");
                a.innerHTML = title;
                span = document.createElement("span");
                span.setAttribute("class", "users-list-date");
                span.innerHTML = name;

                li.appendChild(img);
                li.appendChild(a);
                li.appendChild(span);
                ul.appendChild(li);
            }
            div.appendChild(ul);
        });
    });
}