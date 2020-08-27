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
                            <v-card-actions>
                                <v-btn @click="createSignature(item.id)">Sign it!</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
        <!--<v-btn @click="setupTopShotAccount">Create Moment Collection</v-btn>
        <v-btn @click="setupSignatureAccount">Create Signature Collection</v-btn>-->
        <VueSignaturePad id="signature" width="100%" height="500px" :options="options" />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            options: {
                penColor: "#c0f",
            },
        };
    },
    computed: {
        ...mapState(["moments"]),
        ...mapGetters(["address"]),
    },
    methods: {
        ...mapActions(["sendScript", "sendTransaction"]),
        setupTopShotAccount() {
            const vm = this;
            vm.sendTransaction(`
                import TopShot from 0x179b6b1cb6755e31

                transaction {

                    prepare(acct: AuthAccount) {

                        // First, check to see if a moment collection already exists
                        if acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection) == nil {

                            // create a new TopShot Collection
                            let collection <- TopShot.createEmptyCollection() as! @TopShot.Collection

                            // Put the new Collection in storage
                            acct.save(<-collection, to: /storage/MomentCollection)

                            // create a public capability for the collection
                            acct.link<&{TopShot.MomentCollectionPublic}>(/public/MomentCollection, target: /storage/MomentCollection)
                        }
                    }
                }
            `);
        },
        setupSignatureAccount() {
            const vm = this;
            vm.sendTransaction(`
                import Autograph from 0xf3fcd2c1a78f5eee

                // This transaction sets up an account to use autographs
                // by storing an empty autograph collection and creating
                // a public capability for it

                transaction {

                    prepare(acct: AuthAccount) {

                        // First, check to see if a autograph collection already exists
                        if acct.borrow<&Autograph.Collection>(from: /storage/AutographCollection) == nil {

                            // create a new Autograph Collection
                            let collection <- Autograph.createEmptyCollection() as! @Autograph.Collection

                            // Put the new Collection in storage
                            acct.save(<-collection, to: /storage/AutographCollection)

                            // create a public capability for the collection
                            acct.link<&{Autograph.AutographCollectionPublic}>(/public/AutographCollection, target: /storage/AutographCollection)
                        }
                    }
                }
            `);
        },
        createSignature(momentId) {
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
                        let moment = collectionRefTopShot.borrowMoment(id: ${momentId})
                            ?? panic("Could not borrow a reference to the specified moment")

                        // Save author resource
                        acct.save(<-Autograph.createAuthor(), to: /storage/AutographAuthor)
                        let authorRef = acct.borrow<&Autograph.Author>(from: /storage/AutographAuthor)!

                        // Mint a new NFT
                        let autograph <- Autograph.mintAutograph(metadata: {"Name": "Test"}, author: authorRef)

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
 