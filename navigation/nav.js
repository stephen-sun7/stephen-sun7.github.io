window.onload = function () {
    var st = document.getElementById("st"),
        author = document.getElementById("author"),
        hidden = document.getElementById("hidden"),
        next = document.getElementById("next"),
        prev = document.getElementById("prev"),
        page = document.getElementById("page"),
        photo = document.getElementById("photo"),
        bodybgs = ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg"];
    index = 0;
    author.onclick = function () {
        photo.style.height = "630px";
        photo.style.transition = "height 2s";
        hidden.style.display = "block";
    }

    hidden.onclick = function () {
        photo.style.height = "0";
        photo.style.transition = "height 2s";
        hidden.style.display = "none";
    }
    next.onclick = function () {
        index++;
        if (index == 6) {
            index = 0;
        }
        page.style.backgroundImage = "url(" + bodybgs[index] + ")";
    }
    prev.onclick = function () {
        index--;
        if (index < 0) {
            index = 5;
        }
        page.style.backgroundImage = "url(" + bodybgs[index] + ")";
    }
}	
	