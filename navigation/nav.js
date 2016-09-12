window.onload = function () {
    var st = document.getElementById("st");
    var author = document.getElementById("author");
    var hidden = document.getElementById("hidden");
    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    var page = document.getElementById("page");
    var photo = document.getElementById("photo");
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
}	
	