<template>
    <div>
        <v-data-iterator :items="moments">
            <template #default="props">
                <v-row>
                    <v-col
                        v-for="item in props.items"
                        :key="item.id"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                    >
                        <v-card>
                            <v-card-title>{{ item.FullName }}</v-card-title>
                            {{ item.CurrentTeam }}
                            Autographs:
                            <span
                                v-for="autograph of item.autographs"
                                :key="autograph.metadata"
                            >
                                {{ autograph.author }}
                                <v-img
                                    v-if="autograph.metadata.SignatureBlob"
                                    :src="autograph.metadata.SignatureBlob"
                                />
                            </span>
                            <v-card-actions>
                                <v-btn
                                    @click="showSignaturePad = true; currentMomentId = item.id"
                                >Sign it!</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
        <SignaturePad @newSignature="createSignature" />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import SignaturePad from "@/components/core/signature-pad";

export default {
    data() {
        return {
            showSignaturePad: false,
            currentMomentId: null,
        };
    },
    components: {
        SignaturePad,
    },
    computed: {
        ...mapState(["moments"]),
        ...mapGetters(["address"]),
    },
    methods: {
        ...mapActions(["sendScript", "sendTransaction"]),
        createSignature(blobText) {
            const vm = this;
            vm.sendTransaction(`
                import NonFungibleToken from 0x01cf0e2f2f715450
                import TopShot from 0x179b6b1cb6755e31
                import Autograph from 0xf3fcd2c1a78f5eee

                // This transaction is how a TopShot + Autograph user would mint
                // an autograph to a moment in their account

                // Parameters:
                //
                // momentID: The id of the moment to attach autograph
                // metadata: Dictionary of Autograph metadata

                transaction() {
                    prepare(acct: AuthAccount) {
                        // borrow a reference to the owner's collection
                        let collectionRefTopShot = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
                            ?? panic("Could not borrow a reference to the stored TopShot collection")
                        
                        // Borrow a reference to the specified moment
                        let moment = collectionRefTopShot.borrowMoment(id: ${vm.currentMomentId})
                            ?? panic("Could not borrow a reference to the specified moment")

                        // Save author resource
                        acct.save(<-Autograph.createAuthor(), to: /storage/AutographAuthor)
                        let authorRef = acct.borrow<&Autograph.Author>(from: /storage/AutographAuthor)!

                        // Mint a new NFT
                        let autograph <- Autograph.mintAutograph(metadata: {"SignatureBlob": "${blobText}"}, author: authorRef)

                        // destroy the author resource
                        destroy <-acct.load<@Autograph.Author>(from: /storage/AutographAuthor)
                        
                        // Attach the autograph to the moment
                        let oldAutograph <- moment.autographs[autograph.id] <- autograph
                        destroy oldAutograph
                    }
                }
            `);
        },
    },
};
</script>
 