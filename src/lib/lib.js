const BYPASSLIST = ["localhost", "[::1]", "127.0.0.0/8", "10.0.0.0/8", "192.168.0.0/16", "172.16.0.0/12"]

function timeLog(){
    var d = new Date();
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ';
}

function getCurrentProxy(f) {
    chrome.proxy.settings.get({'incognito': false}, function(config) {
        var proxyRules = config.value.rules;
        var currentProxy = '';
        if (!proxyRules){
            currentProxy = 'DIRECT';
        }else if (proxyRules.singleProxy){
            currentProxy = proxyRules.singleProxy.scheme + "://" + proxyRules.singleProxy.host + ":" + proxyRules.singleProxy.port;
        }else if (proxyRules.fallbackProxy){
            currentProxy = proxyRules.fallbackProxy.scheme + "://" + proxyRules.fallbackProxy.host + ":" + proxyRules.fallbackProxy.port;
        }
        console.log(timeLog() + '获取到当前系统的代理为: ' + currentProxy);
        f(currentProxy);
    });
}

function proxyToConfig(strProxy, bypassList){

    var config = {}

    if (strProxy == 'DIRECT') {
        config = {
            mode: "system"
        };
        return config;
    }

    var re = new RegExp('(\\w+)://((\\w+):(\\w+)?)?@?(\\d+\\.\\d+\\.\\d+\\.\\d+):(\\d+)');
    var reResult = re.exec(strProxy);

    var proxyType = reResult[1];
    // var proxyUserName = reResult[3];
    // var proxyPassWord = reResult[4];
    var proxyHost = reResult[5];
    var proxyPort = parseInt(reResult[6]);

    config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: proxyType,
                host: proxyHost,
                port: proxyPort
            },
            bypassList: bypassList
        }
    };
    return config
}

function cleanProxy(f){
    chrome.proxy.settings.set({
        value: proxyToConfig("DIRECT", BYPASSLIST),
        scope: 'regular'
        },
        function(){
            f("DIRECT");
            console.log(timeLog() + '成功切换到系统代理模式!');
        }
    );
}


function deleteProxy(){

    getCurrentProxy(function (currentProxy) {
        chrome.storage.local.get(['allProxyList', 'checkedProxyList'], function(result){

            var allProxyList = [];

            if (result.allProxyList) {
                allProxyList = result.allProxyList.filter(function(item) {
                    return item != currentProxy
                });
                chrome.storage.local.set({'allProxyList': allProxyList}, function(){});
            }

            console.log(timeLog() + '从所有的列表中删除代理: ' + currentProxy + '!');

        });
    });
}

function setRandomProxy(f){
    getCurrentProxy(function (currentProxy) {
        chrome.storage.local.get(['allProxyList'], function(result) {

            var selectProxyList = result.allProxyList;

            var setNewProxy = '';

            const wtrue = true;
            while(wtrue){
                setNewProxy = selectProxyList[Math.floor(Math.random()*selectProxyList.length)];
                if (setNewProxy != currentProxy || selectProxyList.length < 2) {
                    break;
                }
            }
            console.log(timeLog() + '随机到代理: ' + setNewProxy + '!');
            chrome.proxy.settings.set({
                value: proxyToConfig(setNewProxy, BYPASSLIST),
                scope: 'regular'
                },
                function(){
                    f(setNewProxy);
                    console.log(timeLog() + '成功的切换到代理: ' + setNewProxy + '!');
                }
            );
        });

    });
}

function switchUserProxy(proxy, bypass = [], f) {
    // console.log(proxy, bypass);
    chrome.proxy.settings.set({
        value: proxyToConfig(proxy, bypass),
        scope: 'regular'
        },
        function(){
            f(proxy);
            console.log(timeLog() + '成功的切换到代理: ' + proxy + '!');
        }
    );
}


module.exports = {
    timeLog,
    proxyToConfig,
    cleanProxy,
    deleteProxy,
    setRandomProxy,
    getCurrentProxy,
    switchUserProxy,
}