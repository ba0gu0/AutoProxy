<template>
    <van-notice-bar
        :text="'当前代理: '+ currentProxy + ', 点击复制. '"
        delay="0.5"
        color="darkgrey"
        background="white"
        style="height: 30px;font-size: small;"
        :left-icon="require('../../image/copy.png')"
        @click="copyCurrentProxy"
    />

    <van-button :icon="require(autoProxyStatus?'../../image/popup-close.png':'../../image/popup-open.png')" @click="controlProxy" type="default" size="small" class="popup-button" plain hairline>
        <span>{{ autoProxyStatus ? '| 关闭代理' : '| 开启代理' }}</span>
    </van-button>


    <van-button :icon="require(autoProxyStatus?'../../image/popup-switch-open.png':'../../image/popup-switch-close.png')" :disabled="!autoProxyStatus" @click="switchProxy" type="success" size="small" class="popup-button" plain hairline>
        <span>| 随机代理</span>
    </van-button>

    <van-button :icon="require(autoProxyStatus?'../../image/popup-delete-open.png':'../../image/popup-delete-close.png')" :disabled="!autoProxyStatus" @click="deleteProxy" type="danger" size="small" class="popup-button" plain hairline>
        <span>| 删除代理</span>
    </van-button>

    <van-button :icon="require(autoProxyStatus?'../../image/popup-upgrade-open.png':'../../image/popup-upgrade-close.png')" :disabled="!autoProxyStatus" @click="upgradeRemoteData" type="warning" size="small" class="popup-button" plain hairline>
        <span>| 更新代理</span>
    </van-button>

    <a href="/options.html" target="_blank" role="button">
        <van-button :icon="require('../../image/popup-setting.png')" type="primary" size="small" class="popup-button" plain hairline>
            <span>| 配置中心</span>
        </van-button>
    </a>

    <van-grid :border="false" :column-num="3" class="popup-proxy">
        <van-grid-item  v-for="userProxy in userProxyList" :key="userProxy.name" >
            <van-button :icon="'/icon/' + userProxy.icon" @click="switchUserProxy(userProxy)" type="default" size="small" plain round>
            </van-button>
            <span class="popup-user-proxy">
                {{ userProxy.name }}
            </span>

        </van-grid-item>

        <van-grid-item>

            <van-button :icon="require('../../image/popup-reset-proxy.png')" @click="setSystemProxy" type="default" size="small" plain round>
            </van-button>
            系统代理
        </van-grid-item>

        <van-grid-item>
            <a href="options.html#addUserProxy" target="_blank" role="button">
                <van-button :icon="require('../../image/popup-add-proxy.png')"  type="default" size="small" plain round>
                </van-button>
            </a>
            添加代理
        </van-grid-item>
    </van-grid>

</template>

<script>

import {timeLog, getCurrentProxy, cleanProxy, deleteProxy, setRandomProxy, switchUserProxy} from '../../lib/lib.js'

import { Toast } from "vant";
import axios  from 'axios'

export default {
    name: 'popup',
    data: function(){
        return {
            autoProxyStatus: false,
            currentProxy: 'DIRECT',
            remoteProxyUrl: 'https://proxy.baoguo.site/get_all',
            urlEvalFunction: 'var result = [];for (proxy of response){result.push((proxy.type ? proxy.type : "http") + "://" + proxy.proxy)};return result;',
            userProxyList: [
                {
                    name: "BurpSuite",
                    proxy: "http://127.0.0.1:8080",
                    icon: "proxy-icon6.png",
                    bypass: []
                },
                {
                    name: "ShadowSocks",
                    proxy: "socks5://127.0.0.1:1080",
                    icon: "proxy-icon5.png",
                    bypass: ['127.0.0.1', '[::1]', 'localhost']
                }
            ]
        }
    },
    methods: {
        controlProxy(){
            this.autoProxyStatus = !this.autoProxyStatus;
            var that = this;
            if(this.autoProxyStatus){
                console.log(timeLog() + '插件已启动!');
                Toast.success('插件已启动!');
                chrome.browserAction.setIcon({path: './icon/icon-open.png'});
                getCurrentProxy(function (currentProxy) {
                    that.currentProxy = currentProxy;
                });
            }else{
                cleanProxy(function (currentProxy) {
                    that.currentProxy = currentProxy;
                });
                console.log(timeLog() + '插件已关闭!');
                Toast.success('插件已关闭!');
                chrome.browserAction.setIcon({path: '/icon/icon-close.png'});
            }
            chrome.storage.local.set({'autoProxyStatus': this.autoProxyStatus}, function (){});
        },
        switchProxy() {
            var that = this;
            chrome.storage.local.get(['allProxyList'], function(result) {
                console.log(result);
                if(result.allProxyList && result.allProxyList.length > 0){
                    setRandomProxy(function (currentProxy) {
                        that.currentProxy = currentProxy;
                        Toast.success('随机代理成功!');
                    });
                }else{
                    Toast.fail('可用代理为空,请重新配置!');
                }
            });
            chrome.browserAction.setIcon({path: './icon/icon-open.png'});
        },
        upgradeRemoteData() {
            var that = this;
            axios.get(this.remoteProxyUrl)
            .then(function (response) {
                var convertData = [];
                try{
                    var evalFunction = new Function('response', that.urlEvalFunction);
                    convertData = evalFunction(response.data);
                }catch(err){
                    Toast.fail('远程代理更新失败! 转换数据函数有误!');
                    console.log(err);
                    return 0;
                }
                that.allProxyList = convertData;
                chrome.storage.local.set({'allProxyList': convertData}, function () {
                    Toast.success('远程代理更新成功!');
                });
            })
            .catch(function (err) {
                Toast.fail('远程代理更新失败! 网站请求有误!');
                console.log(err)
            });
            chrome.browserAction.setIcon({path: './icon/icon-open.png'});
        },
        deleteProxy() {
            deleteProxy();
            Toast.success('代理删除成功!');
            chrome.browserAction.setIcon({path: './icon/icon-open.png'});
        },
        copyCurrentProxy(){
            const input = document.createElement("input");
            document.body.appendChild(input);
            input.setAttribute("value", this.currentProxy);
            input.select();
            if (document.execCommand("copy")) {
                document.execCommand("copy");
                Toast.success('已复制到剪切板!');
            }
            document.body.removeChild(input);
        },
        switchUserProxy(proxy){
            var that = this;

            switchUserProxy(proxy.proxy, Object.values(proxy.bypass), function (currentProxy) {
                that.currentProxy = currentProxy;
                that.autoProxyStatus = true;

                Toast.success('代理' + proxy.name + '切换成功!');
                console.log(timeLog() + '插件已启动!', proxy);

                chrome.storage.local.set({'autoProxyStatus': true}, function (){});
                // chrome.browserAction.setIcon({path: './icon/icon-close.png'});
                chrome.browserAction.setIcon({path: '/icon/' + proxy.icon});
            });
        },
        setSystemProxy(){
            var that = this;
            cleanProxy(function (currentProxy) {

                that.currentProxy = currentProxy;
                that.autoProxyStatus = false;
                Toast.success('已经切换为系统代理!');
                chrome.storage.local.set({'autoProxyStatus': false}, function (){});
            });
            chrome.browserAction.setIcon({path: './icon/icon-close.png'});
        }
    },
    mounted: function(){

        var that = this;
        getCurrentProxy(function (currentProxy) {
            that.currentProxy = currentProxy;
        });
        chrome.storage.local.get(['userProxyList', 'autoProxyStatus', 'remoteProxyUrl', 'urlEvalFunction'], function (result) {
            // console.log(result);
            if (result.remoteProxyUrl){
                that.remoteProxyUrl = result.remoteProxyUrl;
            }
            if (result.urlEvalFunction){
                that.urlEvalFunction = result.urlEvalFunction;
            }
            that.autoProxyStatus = result.autoProxyStatus;
            that.userProxyList = result.userProxyList ? JSON.parse(result.userProxyList) : [];
        });
    }
}
</script>

<style>
    body {
        width: 200px;
        text-align: center;
    }
    .popup-button {
        margin-top: 8px;
        width: 85%;
        font-size: 15px;
    }
    .popup-proxy {
        font-size: x-small;
        color: darkgrey;
        margin: 5px 0px;

    }
    .popup-user-proxy{
        overflow: hidden;
        text-overflow: ellipsis;
        width: 64px;
        white-space: nowrap;
    }
</style>
