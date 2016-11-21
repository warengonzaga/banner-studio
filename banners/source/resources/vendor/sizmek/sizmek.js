"use-strict";

function initEB() {
    if (!EB.isInitialized()) {
        EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
    }
    else {
        startAd();
    }
}

function startAd() {
    addEventListeners();
    init();
}

function addEventListeners() {
    document.getElementById("banner-exit").addEventListener("click", clickthrough);
}

function clickthrough() {
    EB.clickthrough();
}

window.addEventListener('load', initEB);

/**
* Sizmek API above 
* Don't modify the codes above
* Except you know what you are doing!
*/
