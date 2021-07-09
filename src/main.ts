import { createApp } from 'vue';
import App from './App.vue';
import routes from './routes';
import store, { key } from './store';
import BaseContainer from './components/UI/BaseContainer.vue';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseBadge from './components/UI/BaseBadge.vue';
import BaseFormControl from './components/UI/BaseFormControl.vue';
import BaseFlash from './components/UI/BaseFlash.vue';
import BaseSpinner from './components/UI/BaseSpinner.vue';

const app = createApp(App);

app.component('base-container', BaseContainer);
app.component('base-card', BaseCard);
app.component('base-flash', BaseFlash);
app.component('base-button', BaseButton);
app.component('base-badge', BaseBadge);
app.component('base-form-control', BaseFormControl);
app.component('base-spinner', BaseSpinner);

app.use(routes);
app.use(store, key);

app.mount('#app');
