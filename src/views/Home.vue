<template>
    <div>
        <v-data-iterator :items="items">
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
                            <v-card-title>{{ item.name }}</v-card-title>
                            {{ item.description }}
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
        <v-btn @click="testTransaction">Send transaction</v-btn>
    </div>
</template>

<script>
import * as fcl from "@onflow/fcl";

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
    methods: {
        async testTransaction() {
            const response = await fcl.send([
                fcl.transaction`
                    transaction {
                        execute {
                            log("A transaction happened")
                        }
                    }
                `,
                fcl.proposer(fcl.currentUser().authorization),
                fcl.payer(fcl.currentUser().authorization),
            ]);

            fcl.tx(response).subscribe((transaction) => {
                if (fcl.tx.isSealed(transaction)) {
                    console.log("Transaction Confirmed: Is Sealed");
                }
            });
        },
    },
};
</script>