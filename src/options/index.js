import { createApp } from 'vue'
import App from './App/App.vue'
import {Button, Image, Icon, Col, Row, Tab, Tabs, Step, Steps, Divider, Cell, Field, DropdownMenu, DropdownItem, Stepper, Popup } from 'vant';

import '@vant/touch-emulator';
import 'vant/lib/icon/local.css';

createApp(App)
    .use(Button)
    .use(Icon)
    .use(Col)
    .use(Row)
    .use(Image)
    .use(Tab)
    .use(Tabs)
    .use(Step)
    .use(Steps)
    .use(Divider)
    .use(Cell)
    .use(Field)
    .use(DropdownMenu)
    .use(DropdownItem)
    .use(Stepper)
    .use(Popup)
    .mount('#app')

