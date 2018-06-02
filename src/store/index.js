/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
// import * as VueGoogleMaps from 'vue2-google-maps';


// Modules
import account from './modules/account';
import auth from './modules/auth';

Vue.use(Vuex);
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyBEHv_obRsxXQwTou7mzUh6p9fQcwtv0vk',
//   },
// });

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  /**
   * Assign the modules to the store.
   */
  modules: {
    account,
    auth,
  },

  /**
   * If strict mode should be enabled.
   */
  strict: debug,

  /**
   * Plugins used in the store.
   */
  plugins: debug ? [createLogger()] : [],
});
