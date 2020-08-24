import Vuex from "vuex"
import Vue from "vue"
import * as fcl from "@onflow/fcl"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        moments: []
    },
    getters: {
        loggedIn(state) {
            if (state.user) {
                return state.user.loggedIn
            }
        },
        address(state) {
            if (state.user) {
                return state.user.addr
            }
        }
    },
    actions: {
        async sendTransaction(store, transaction) {
            const response = await fcl.send([
                fcl.transaction`${transaction}`,
                fcl.proposer(fcl.currentUser().authorization),
                fcl.authorizations([fcl.currentUser().authorization]),
                fcl.payer(fcl.currentUser().authorization),
                fcl.limit(100),
            ]);

            fcl.tx(response).subscribe((transaction) => {
                if (fcl.tx.isSealed(transaction)) {
                    console.log("Transaction sealed");
                }
            });
        },
        async sendScript(store, script) {
            const response = await fcl.send([fcl.script`${script}`]);

            return fcl.decode(response);
        },
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setMoments(state, moments) {
            state.moments = moments
        }
    }
})