<template>
    <van-steps direction="vertical" :active="100">
        <van-step>
            <van-icon name="new-o" size="20" dot />
            <h3>
                Auto Proxy 2.0
            </h3>
            <p class="pfont">
                1. Auto Proxy 是一个自动切换代理的一个浏览器插件, 专为测试人员使用.
                <br />
                2. 2.0版本使用vue+vant进行了重构, 界面变化比较大.
                <br />
                3. 新增了自定义代理功能, 可以自行添加代理并进行切换, 比如BurpSuite代理、Shadowsocks代理等, 同时支持添加IP白名单, 暂不支持编写PAC脚本功能.
                <br />
                4. 去除了代理筛选功能, 去除了计划任务功能.
            </p>
        </van-step>
        <van-step>
            <van-icon name="label-o" size="20" />
            <h3>
                Auto Proxy 1.0
            </h3>
            <p class="pfont">
                1. Auto Proxy 是一个自动切换代理的一个浏览器插件, 专为测试人员使用.
                <br />
                2. 插件可以从远程服务器或者Json文档中获取到代理列表, 之后自动筛选列表中可用的代理, 每隔一段时间自动的切换一个列表中可用的代理.
                <br />
                3. 每一个自动任务都可以选择是否开启, 同时Json文档的优先级大于远程服务器, 切换代理时, 筛选出来的代理优先级大于导入的代理.
            </p>
        </van-step>
        <van-step>
            <van-icon name="volume-o" size="20" />
            <h3>
                免责声明
            </h3>
            <p class="pfont">
                1. 禁止使用此插件进行任何恶意操作.
                <br>
                2. 如您在使用本工具的过程中存在任何非法行为, 您需自行承担所有后果, 本工具所有作者和所有贡献者不承担任何法律及连带责任.
                <br>
                3. 除非您已充分阅读、完全理解并接受本协议所有条款, 否则, 请您不要安装并使用本工具. 您的使用行为或者您以其他任何明示或者默示方式表示接受本协议的, 即视为您已阅读并同意本协议的约束.
            </p>
        </van-step>
        <van-step active-icon="">
            <van-icon name="info-o" size="20" />
            <h3>
                版权
            </h3>
            <p class="pfont">
                作者: BaoGuo
                <br>
                本插件完全开源、免费!
                <br>
                <a href="http://www.apache.org/licenses/LICENSE-2.0.txt">遵循 Apache License Version 2.0 协议 </a>
            </p>
        </van-step>
    </van-steps>
</template>

<script>
    export default {
        name: 'about'
    }
</script>

<style>
    .pfont{
        line-height: 25px;
        font-size: 15px;
        color: darkgrey;
    }
    a:link {
        color: #01AAED;
        text-decoration: none;
    }
    a:visited {
        color: #01AAED;
        text-decoration: none;
    }
    a:hover {
        color: #01AAED;
        text-decoration: none;
    }
</style>