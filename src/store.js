import Vuex from "vuex"
import Vue from "vue"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loggedIn: null
    },
    getters: {

    },
    actions: {

    },
    mutations: {
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        }
    }
})