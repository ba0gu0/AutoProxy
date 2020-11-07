import { createApp } from 'vue'
import App from './App/App.vue'
import { Button, Icon, NoticeBar, Grid, GridItem } from 'vant';

import '@vant/touch-emulator';
import 'vant/lib/icon/local.css';

createApp(App)
    .use(Button)
    .use(Icon)
    .use(NoticeBar)
    .use(Grid)
    .use(GridItem)
    .mount('#app')