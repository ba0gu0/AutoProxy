<template>
    <van-divider content-position="left" :style="{ color: '#FC6800', borderColor: '#FC6800'}">添加自定义代理</van-divider>
    <van-row>
        <van-col span="10">
            <van-field v-model="proxyName" label="代理名字" placeholder="新建代理名字" maxlength="15" :border="true" clearable center />
        </van-col>
        <van-col span="4">
            <van-cell title="选择代理图标" />
        </van-col>
        <van-col span="10">
            <van-icon v-for="icon in proxyIcons" v-bind:key="icon" :name="'/icon/' + icon"  size="30" style="margin: 5px 5px;" @click="selectUserProxyIcon(icon)" />
        </van-col>
    </van-row>
    <van-divider />
    <van-row>
        <van-col span="3">
            <van-cell title="代理类型" />
        </van-col>
        <van-col span="4">
            <van-dropdown-menu :overlay="false" active-color="#1989fa">
                <van-dropdown-item v-model="proxyType" :options="options" teleport="body" />
            </van-dropdown-menu>
        </van-col>
        <van-col span="7">
            <van-field v-model="proxyAddress" label="代理服务器" placeholder="代理服务器地址" maxlength="15" :formatter="formatter" clearable center />
        </van-col>
        <van-col span="3">
            <van-cell title="代理端口" />
        </van-col>
        <van-col span="4">
            <div class="portStep">
                <van-stepper v-model="proxyPort" theme="round" :integer="true" input-width="50" button-size="20" default-value="8080" min="1" max="65535" />
            </div>
        </van-col>
        <van-col span="3">
            <van-button size="small" icon="setting-o" style="margin: 7px 0 0 10px;" type="success" @click="openAuthData" plain round >
                认证配置
            </van-button>
        </van-col>
    </van-row>
    <van-divider />
    <van-field v-model="proxyByPass" label="代理白名单(每行一个)" placeholder="请输入代理白名单!" type="textarea" rows="3" maxlength="1000" show-word-limit clearable autosize />
    <van-row>
        <van-col span="3"></van-col>
        <van-col span="4">
            <van-button type="primary" style="margin-top: 10px;width: 100%;" @click="addUserProxy">立即添加</van-button>
        </van-col>
        <van-col span="17"></van-col>
    </van-row>
    <van-popup v-model:show="showAuthData" teleport="body" :style="{ height: '35%', width: '30%', padding:'20px 20px' }" round>
        <van-cell title="代理用户名" />
        <van-field v-model="proxyUserName" placeholder="UserName" clearable center />
        <van-cell title="代理密码" />
        <van-field v-model="proxyPassWord" placeholder="PassWord" clearable center />
        <van-button @click="openAuthData" type="primary" style="width: 70%; margin: 20px 0 0 60px" round >
            确认
        </van-button>
    </van-popup>
    <van-divider content-position="left" :style="{ color: '#FF00EE', borderColor: '#FF00EE'}">管理自定义代理</van-divider>
    <div v-for="userProxy in userProxyList" v-bind:key="userProxy.name">
        <van-divider />
        <van-row >
            <van-col span="3">
                <van-icon :name="'/icon/' + userProxy.icon" size="30" style="margin: 8px 0 0 40px;" />
            </van-col>
            <van-col span="8">
                <van-field label="代理名称" v-model="userProxy.name" center readonly/>
            </van-col>
            <van-col span="10">
                <van-field label="代理地址" v-model="userProxy.proxy" :right-icon="require('../../image/copy.png')" @click="copySelectProxy(userProxy.proxy)" readonly />
            </van-col>
            <van-col span="3">
                <van-button size="small" icon="setting-o" style="margin: 7px 0 0 10px;" type="danger" @click="deleteUserProxy(userProxy.name)" >
                    删除配置
                </van-button>
            </van-col>
        </van-row>
    </div>

</template>


<script>
    import { Toast, Dialog } from 'vant'

    export default {
        name: 'userProxySetting',
        data: function () {
            return {
                proxyName: '新建代理',
                proxyIcon: 'proxy-default-icon.png',
                proxyType: 'http',
                proxyAddress: '127.0.0.1',
                proxyPort: 8080,
                proxyUserName: '',
                proxyPassWord: '',
                proxyByPass: '127.0.0.1\n[::1]\nlocalhost',
                options: [
                    { text: 'HTTP', value: 'http' },
                    { text: 'HTTPS', value: 'https' },
                    { text: 'SOCKS4', value: 'socks4' },
                    { text: 'SOCKS5', value: 'socks5' },
                ],
                showAuthData: false,
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
                ],
                proxyIcons: [
                    'proxy-default-icon.png',
                    'proxy-icon1.png',
                    'proxy-icon2.png',
                    'proxy-icon3.png',
                    'proxy-icon4.png',
                    'proxy-icon5.png',
                    'proxy-icon6.png'
                ]
            }
        },
        methods: {
            openAuthData(){
                this.showAuthData = !this.showAuthData;
            },
            formatter(value){
                return value.replace(/[^0-9.]/g, '');
            },
            selectUserProxyIcon(icon){
                this.proxyIcon = icon;
                Toast.success('图标选择成功!');
            },
            deleteUserProxy(proxyName){
                Dialog.confirm({
                    title: '删除选择的代理!',
                    message: '将从自定义代理列表中, 删除当前选中的代理!',
                }).then(() => {
                    this.userProxyList = this.userProxyList.filter(function(item) {
                        return item.name != proxyName
                    });
                    chrome.storage.local.set({'userProxyList': JSON.stringify(this.userProxyList)}, function () {
                        Toast.success('删除代理 ' + proxyName + ' 成功!');
                    });

                }).catch(() => {
                    Toast.fail('删除代理 ' + proxyName + ' 失败!');
                });
            },
            addUserProxy(){
                if (!this.proxyName || !this.proxyAddress ){
                    Toast.fail('代理信息不能为空!');
                    return ;
                }
                var existed = this.userProxyList.find(item => {
                    return item.name == this.proxyName
                });
                // console.log(this.proxyByPass.split('\n'));
                if (!existed){
                    var that = this;
                    this.userProxyList.push(
                        {
                            name: this.proxyName,
                            proxy: (this.proxyUserName || this.proxyPassWord) ? this.proxyType + '://' + this.proxyUserName + ':' + this.proxyPassWord + '@' + this.proxyAddress + ':' + this.proxyPort : this.proxyType + '://' + this.proxyAddress + ':' + this.proxyPort,
                            icon: this.proxyIcon,
                            bypass: this.proxyByPass.split('\n')
                        }
                    );
                }else{
                    Toast.fail('代理 ' + this.proxyName + ' 已存在!');
                    return ;
                }
                // console.log(this.userProxyList);
                chrome.storage.local.set({'userProxyList': JSON.stringify(this.userProxyList)}, function () {
                    Toast.success('添加代理 ' + that.proxyName + ' 成功!');
                });

            },
            copySelectProxy(selectProxy){
            const input = document.createElement("input");
            document.body.appendChild(input);
            input.setAttribute("value", selectProxy);
            input.select();
            if (document.execCommand("copy")) {
                document.execCommand("copy");
                Toast.success('已复制到剪切板!');
            }
            document.body.removeChild(input);
        },
        },
        mounted: function () {
            var that = this;
            chrome.storage.local.get(['userProxyList'], function (result) {
                // console.log(result);
                that.userProxyList = result.userProxyList ? JSON.parse(result.userProxyList) : [];
            });
        }
    }

</script>


<style>
    .portStep {
        margin-top: 8px;
        text-align: center;
    }
</style>