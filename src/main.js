import { createApp } from 'vue'
import App from './App.vue'
import '../node_modules/bulma/css/bulma.css'


window.onYouTubeIframeAPIReady = function() {
  createApp(App).mount('#app')
}
