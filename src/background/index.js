chrome.storage.local.get(['autoProxyStatus'], function(result) {

    var iconPath = result.autoProxyStatus ? "./icon/icon-open.png" : "./icon/icon-close.png";
    chrome.browserAction.setIcon({path: iconPath});

});

setInterval(function(){
    chrome.storage.local.get(['allProxyList'], function (result) {
        if(result.allProxyList){
            chrome.browserAction.setBadgeText({
                text: String(result.allProxyList.length)
            });
        }else{
            chrome.browserAction.setBadgeText({
                text: String(0)
            });
        }
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#1E9FFF'
        });
    })
}, 60 * 1000);
