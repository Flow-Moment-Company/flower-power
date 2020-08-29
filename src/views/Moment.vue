<template>
    <div>
        <v-card>
            {{ moment.FirstName }}
            <v-card-actions>
                <v-btn @click="showSignaturePad = true">Sign it</v-btn>
            </v-card-actions>
        </v-card>
        <SignaturePad v-if="showSignaturePad" @newSignature="createSignature" />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import SignaturePad from "@/components/core/signature-pad";

export default {
    data() {
        return {
            showSignaturePad: false,
        };
    },
    components: {
        SignaturePad,
    },
    computed: {
        ...mapGetters(["address"]),
        ...mapState(["moments"]),
        momentId() {
            const vm = this;
            return vm.$route.query.momentId;
        },
        moment() {
            const vm = this;
            return vm.moments.filter((moment) => moment.id === vm.momentId)[0];
        },
    },
    methods: {
        ...mapActions(["sendTransaction"]),
        ...mapMutations(["setMoments"]),
        async createSignature(blobText) {
            const vm = this;
            await vm.sendTransaction(`
                import NonFungibleToken from 0x01cf0e2f2f715450
                import TopShot from 0x179b6b1cb6755e31
                import Autograph from 0xf3fcd2c1a78f5eee

                // This transaction is how a TopShot + Autograph user would mint
                // an autograph to a moment in their account

                // Parameters:
                //
                // momentID: The id of the moment to attach autograph
                // document: String of Autograph document

                transaction() {
                    prepare(acct: AuthAccount) {
                        // borrow a reference to the owner's collection
                        let collectionRefTopShot = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
                            ?? panic("Could not borrow a reference to the stored TopShot collection")
                        
                        // Borrow a reference to the specified moment
                        let moment = collectionRefTopShot.borrowMoment(id: ${vm.momentId})
                            ?? panic("Could not borrow a reference to the specified moment")

                        // Save author resource
                        acct.save(<-Autograph.createAuthor(), to: /storage/AutographAuthor)
                        let authorRef = acct.borrow<&Autograph.Author>(from: /storage/AutographAuthor)!

                        // Mint a new NFT
                        let autograph <- Autograph.mintAutograph(document: "${blobText}", author: authorRef)

                        // destroy the author resource
                        destroy <-acct.load<@Autograph.Author>(from: /storage/AutographAuthor)
                        
                        // Attach the autograph to the moment
                        let oldAutograph <- moment.autographs[autograph.id] <- autograph
                        destroy oldAutograph
                    }
                }
            `);
            vm.showSignaturePad = false;
            const newMoment = { ...vm.moment };
            newMoment.autographs.push({
                author: `0x${vm.address}`,
                document: blobText,
            });
            const newMoments = [...vm.moments];
            const momentIndex = newMoments.findIndex(
                (moment) => moment.id === newMoment.id
            );
            newMoments.splice(momentIndex, 1, newMoment);
            vm.setMoments(newMoments);
        },
    },
    mounted() {
        const vm = this;
        if (vm.$route.query.sign) {
            vm.showSignaturePad = true;
        }
    },
};
</script>

<style>
</style>