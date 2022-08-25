import { defineCustomElement } from 'vue'
import App from './App.ce.vue'

// Vue generates a new HTML element class from the component definition.
export const Dashboard = defineCustomElement(App)

// Register the custom element so that it can be used as <dark-mode-switch>.
// export function register(tagName = 'dpa-dashboard') {
//     customElements.define(tagName, Dashboard)
// }

customElements.define('dpa-dashboard', Dashboard)