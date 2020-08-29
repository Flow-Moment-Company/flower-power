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

            return new Promise(resolve => {
                fcl.tx(response).subscribe((transaction) => {
                    if (fcl.tx.isSealed(transaction)) {
                        resolve();
                    }
                });
            })
        },
        async sendScript(store, script) {
            const response = await fcl.send([fcl.script`${script}`]);

            return fcl.decode(response);
        },
        async getMoment({ dispatch, getters }, momentId) {
            const vm = this;

            const metadata = await dispatch("sendScript", `
                import TopShot from 0x179b6b1cb6755e31

                pub fun main(): {String: String} {

                    let collectionRef = getAccount(0x${getters.address}).getCapability(/public/MomentCollection)!
                        .borrow<&{TopShot.MomentCollectionPublic}>()
                        ?? panic("Could not get public moment collection reference")

                    let token = collectionRef.borrowMoment(id: ${momentId})
                        ?? panic("Could not borrow a reference to the specified moment")

                    let data = token.data

                    let metadata = TopShot.getPlayMetaData(playID: data.playID) ?? panic("Play doesn't exist")

                    log(metadata)

                    return metadata
                }
            `);

            metadata.autographs = [];

            const autographIds = await dispatch("sendScript", `
                import TopShot from 0x179b6b1cb6755e31
                pub fun main(): [UInt64] {
                    let token = getAccount(0x${getters.address}).getCapability(/public/MomentCollection)!
                                .borrow<&{TopShot.MomentCollectionPublic}>()!.borrowMoment(id: ${momentId})!
                    log(token.autographs.keys)
                    return token.autographs.keys
                }
            `);

            for (const autographId of autographIds) {
                const author = await dispatch("sendScript", `
                    import TopShot from 0x179b6b1cb6755e31
                    import Autograph from 0xf3fcd2c1a78f5eee

                    pub fun main(): Address {
                        let collectionRef = getAccount(0x${getters.address}).getCapability(/public/MomentCollection)!
                            .borrow<&{TopShot.MomentCollectionPublic}>()
                            ?? panic("Could not get public moment collection reference")

                        let moment = collectionRef.borrowMoment(id: ${momentId})
                            ?? panic("Could not borrow a reference to the specified moment")

                        let autograph = &moment.autographs[UInt64(${autographId})] as &Autograph.NFT

                        log(autograph.author)
                        return autograph.author
                    }

                `);

                const signatureDocument = await dispatch("sendScript", `
                    import TopShot from 0x179b6b1cb6755e31
                    import Autograph from 0xf3fcd2c1a78f5eee

                    pub fun main(): String {
                        let collectionRef = getAccount(0x${getters.address}).getCapability(/public/MomentCollection)!
                            .borrow<&{TopShot.MomentCollectionPublic}>()
                            ?? panic("Could not get public moment collection reference")

                        let moment = collectionRef.borrowMoment(id: ${momentId})
                            ?? panic("Could not borrow a reference to the specified moment")

                        let autograph = &moment.autographs[UInt64(${autographId})] as &Autograph.NFT

                        log(autograph.document)
                        return autograph.document
                    }
                `);

                metadata.autographs.push({
                    document: signatureDocument,
                    author,
                });
            }

            metadata.id = momentId;
            return metadata;
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