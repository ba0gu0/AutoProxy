<template>
    <van-divider content-position="left" :style="{ color: '#FF8C00' , borderColor: '#FF8C00'}" >
        代理列表数据格式
    </van-divider>

    <van-cell icon="info-o" size="x-large" value="插件支持从远程服务器中获取代理数据, 也可以直接从代理列表中获取! 如果从网站中获取数据, 需要编写数据转换函数, 将远程服务器上的数据转换成代理列表, 格式按照下方的格式. 如果直接提供代理列表, 直接按照下方的格式填写." />

    <pre style="color: #01AAED; font-size: large">
    [
        "socks5://127.0.0.1:1080",
        "http://127.0.0.1:8080"
    ]
    </pre>

    <van-divider content-position="left" :style="{ color: '#7413FC', borderColor: '#7413FC'}">
        远程代理服务器配置
    </van-divider>

    <van-cell icon="cluster-o" size="x-large" title="设置从远程服务器中获取代理数据!" />

    <van-field v-model="remoteProxyUrl" label="远程地址" placeholder="请输入远程URL!" clearable center />
    <van-cell size="x-large" title="设置用来处理目标网站数据的函数!" label="Response为网站的请求结果, 根据目标网站的不同, 需要编写对应的代码, 将数据处理为上方的示例格式." />
    <van-field v-model="urlEvalFunction" label="数据转换函数" placeholder="请输入Js转换代码!" type="textarea" rows="7" maxlength="5000" show-word-limit clearable autosize />
    <van-button type="primary" style="margin: 10px 0 0 110px" @click="upgradeRemoteData">立即更新</van-button>

    <van-divider content-position="left" :style="{ color: '#9DF400', borderColor: '#9DF400'}">
        自定义代理列表
    </van-divider>
    <van-cell icon="point-gift-o" size="x-large" title="设置从自定义代理列表中获取代理数据!" />

    <van-field v-model="userProxyListData" label="代理列表" placeholder="请输入符合规则的的代理列表!" type="textarea" rows="4" maxlength="5000" show-word-limit clearable autosize />
    <van-button type="primary" style="margin: 10px 0 0 110px" @click="upgradeUserProxyData">立即更新</van-button>

    <van-divider content-position="left" :style="{ color: '#FF00BC', borderColor: '#FF00BC'}">重置代理数据</van-divider>
    <van-cell icon="point-gift-o" size="x-large" title="重置将清理远程获取到的代理数据, 清理输入的代理列表, 清理远程代理地址!" />
    <van-button type="primary" style="margin: 10px 0 0 110px" @click="resetAllProxyData">立即重置</van-button>
    <br />
    <br />
    <br />
    <br />
</template>

<script>
    import { Toast, Dialog } from 'vant'
    import axios  from 'axios'
    import { timeLog } from '../../lib/lib.js'

    export default {
        name: 'proxyPoolSetting',
        data: function () {
            return {
                userProxyListData: '[\n' +
                    '   "socks5://127.0.0.1:1080",\n' +
                    '   "http://127.0.0.1:8080"\n' +
                    ']',
                remoteProxyUrl: 'https://proxy.baoguo.site/get_all',
                urlEvalFunction: '// Tips:\n' +
                    'var result = [];\n' +
                    'for (proxy of response){\n' +
                    '   result.push(\n' +
                    '       (proxy.type ? proxy.type : "http") + "://" + proxy.proxy\n' +
                    '   )\n' +
                    '}\n' +
                    'return result;'
            }
        },
        methods: {
            upgradeRemoteData(){
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
                    console.log(timeLog() + '远程代理更新成功, 共获取到' + convertData.length + '个!');
                    chrome.storage.local.set({'remoteProxyUrl': that.remoteProxyUrl, 'urlEvalFunction': that.urlEvalFunction, 'allProxyList': convertData}, function () {
                        Toast.success('远程代理更新成功!');
                    });
                })
                .catch(function (err) {
                    Toast.fail('远程代理更新失败! 网站请求有误!');
                    console.log(err)
                });
            },
            upgradeUserProxyData(){
                var result = [];
                try{
                    result = JSON.parse(this.userProxyListData);
                }catch(err){
                    Toast.fail('代理列表更新失败! 代理格式不正确!');
                    return 0;
                }
                chrome.storage.local.set({'userProxyListData': this.userProxyListData, 'allProxyList': result}, function () {
                    Toast.success('代理列表更新成功!');
                });
            },
            resetAllProxyData(){
                Dialog.confirm({
                    title: '重置所有获取到的数据!',
                    message: '将清理获取到代理列表, 清理所有的代理数据!',
                }).then(() => {
                    chrome.storage.local.set({'userProxyListData': [], 'allProxyList': [], 'remoteProxyUrl': ''}, function () {
                        Toast.success('重置所有数据成功!');
                    });
                }).catch(() => {
                    Toast.fail('重置所有数据失败!');
                });
            }
        },
        mounted: function () {

            var that = this;
            chrome.storage.local.get(['remoteJsonUrl', 'userProxyListData', 'urlEvalFunction'], function (result){
                if (result.remoteJsonUrl){
                    that.remoteJsonUrl = result.remoteJsonUrl;
                }
                if (result.userProxyListData){
                    that.userProxyListData = result.userProxyListData;
                }
                if (result.urlEvalFunction){
                    that.urlEvalFunction = result.urlEvalFunction;
                }
            });

        }
    }
</script>

<style>

</style>