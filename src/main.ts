import { createApp } from 'vue';
import App from './App.vue';
import routes from './routes';
import store from './store';
import BaseContainer from './components/UI/BaseContainer.vue';

const app = createApp(App);

app.component('base-container', BaseContainer);

app.use(routes);
app.use(store);

app.mount('#app');
