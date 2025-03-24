
import { createApp } from 'vue'
import App from "./App.vue"
import router from './router/router'
import "@/assets/variaveis-css/var-css.css"
import ElementPlus from "element-plus"
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import "element-plus/dist/index.css"
import ptbr from 'element-plus/es/locale/lang/pt-br'
import 'primeicons/primeicons.css'
import * as Icons from '@element-plus/icons-vue'; 

const app = createApp(App)

for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component);
}

app.use(router)
app.use(ElementPlus, {
    locale: ptbr
})

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '#e3f5ff', 
            100: '#c1eaff', 
            200: '#9fdfff', 
            300: '#7dd3ff', 
            400: '#5bc8ff', 
            500: '#38b6ff', 
            600: '#309fd9', 
            700: '#2889b3', 
            800: '#206f8d', 
            900: '#185567', 
            950: '#103b41'  
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false || "none",
            unstyled: true
        }
    }
})



app.mount("#app")




