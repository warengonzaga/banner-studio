"use strict";

window.onload = clickthrough;

function clickthrough() {
    document.getElementById("banner-exit").addEventListener("click", function() {
        window.open(clickTag);
    });
    init();
}

/**
* DoubleClick Studio API above 
* Don't modify the codes above
* Except you know what you are doing!
*/
