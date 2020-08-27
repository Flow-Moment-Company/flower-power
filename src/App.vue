<template>
    <v-app>
        <v-main>
            <Header class="header" />
            <router-view class="content" />
            <Footer class="footer" />
        </v-main>
    </v-app>
</template>

<script>
import Header from "@/components/core/header";
import Footer from "@/components/core/footer";
import { mapMutations, mapActions, mapGetters } from "vuex";
import * as fcl from "@onflow/fcl";

export default {
    components: {
        Header,
        Footer,
    },
    computed: {
        ...mapGetters(["address"]),
    },
    methods: {
        ...mapMutations(["setUser", "setMoments"]),
        ...mapActions(["sendScript"]),
        async loadMomentMetadata() {
            const vm = this;
            const momentIds = await vm.sendScript(`
                import TopShot from 0x179b6b1cb6755e31

                pub fun main(): [UInt64] {

                    let acct = getAccount(0x${vm.address}) 
                    let collectionRef = acct.getCapability(/public/MomentCollection)!
                                            .borrow<&{TopShot.MomentCollectionPublic}>()!

                    log(collectionRef.getIDs())

                    return collectionRef.getIDs()
                }
            `);

            const moments = [];

            for (const momentId of momentIds) {
                const metadata = await vm.sendScript(`
                    import TopShot from 0x179b6b1cb6755e31

                    pub fun main(): {String: String} {

                        let collectionRef = getAccount(0x${vm.address}).getCapability(/public/MomentCollection)!
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

                const autographIds = await vm.sendScript(`
                    import TopShot from 0x179b6b1cb6755e31
                    pub fun main(): [UInt64] {
                        let token = getAccount(0x${vm.address}).getCapability(/public/MomentCollection)!
                                    .borrow<&{TopShot.MomentCollectionPublic}>()!.borrowMoment(id: ${momentId})!
                        log(token.autographs.keys)
                        return token.autographs.keys
                    }
                `);

                console.log(autographIds);

                metadata.id = momentId;
                moments.push(metadata);
            }
            return moments;
        },
    },
    mounted() {
        const vm = this;

        fcl.currentUser().subscribe(async (user) => {
            vm.setUser(user);
            if (user.loggedIn) {
                vm.setMoments(await vm.loadMomentMetadata());
            } else {
                vm.setMoments([]);
            }
        });
    },
};
</script>

<style>
.header {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 50px;
}
.content {
    margin-top: 100px;
}
.footer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
}
</style>