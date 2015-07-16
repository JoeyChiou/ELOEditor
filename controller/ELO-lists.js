function ELO_List(divID){
    var div = document.getElementById(divID);
    var ul = document.createElement("ul");
    ul.setAttribute("class", "users-list clearfix");
    var li;
    var img;
    var a;
    var span;

    for(var i=1;i<9;i++){    
        li = document.createElement("li");
        li.onclick = ELO_Viewer;
        img = document.createElement("img");
        img.setAttribute("src", "assets/img/book-64.png");
        img.setAttribute("alt", "User Image");
        a = document.createElement("a");
        a.setAttribute("class", "users-list-date");
        a.innerHTML = "ELO Test " + i;
        span= document.createElement("span");
        span.setAttribute("class", "users-list-date");
        span.innerHTML = "TestMan" + i;
        
        li.appendChild(img);
        li.appendChild(a);
        li.appendChild(span);
        ul.appendChild(li);
    }
    div.appendChild(ul);
}

function ELO_Viewer(){
    location.href = "eloviewer.html";
}