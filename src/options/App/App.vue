<template>
    <br><br>
    <van-row>
        <van-col span="3"></van-col>
        <van-col span="4" style="text-align: center;">
            <a href="options.html">
                <van-image
                    width="10rem"
                    height="10rem"
                    fit="contain"
                    :src= "require('../../image/console-log.svg')"
                />
                <br>
                <div style="font-size: xx-large;">
                    Auto Proxy
                    <br>
                    控制台
                </div>
            </a>
        </van-col>
        <van-col span="14">
            <van-tabs animated>
                <van-tab title="自定义代理配置">
                    <UserProxySetting></UserProxySetting>
                </van-tab>
                <van-tab title="代理池配置">
                    <ProxyPoolSetting></ProxyPoolSetting>
                </van-tab>
                <van-tab title="关于 Auto Proxy" name="d">
                    <About></About>
                </van-tab>
            </van-tabs>
        </van-col>
        <van-col span="3"></van-col>
    </van-row>
</template>

<script>
    import About from './About'
    import ProxyPoolSetting from './ProxyPoolSetting'
    import UserProxySetting from './UserProxySetting'

    export default {
        name: 'options',
        components: {
            About, ProxyPoolSetting, UserProxySetting
        },
        data: function () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style>

</style>
