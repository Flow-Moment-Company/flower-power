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
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
        <v-btn @click="setupAccount">Create Collection</v-btn>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            items: [
                { id: 1, name: "Test", description: "Just test it" },
                { id: 2, name: "Test", description: "Just test it" },
                { id: 3, name: "Test", description: "Just test it" },
                { id: 4, name: "Test", description: "Just test it" },
                { id: 5, name: "Test", description: "Just test it" },
                { id: 6, name: "Test", description: "Just test it" },
                { id: 7, name: "Test", description: "Just test it" },
            ],
        };
    },
    computed: {
        ...mapState(["moments"]),
        ...mapGetters(["address"]),
    },
    methods: {
        ...mapActions(["sendScript", "sendTransaction"]),
        setupAccount() {
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
    },
};
</script>
 