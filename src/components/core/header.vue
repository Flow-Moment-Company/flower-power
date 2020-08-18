<template>
    <v-app-bar color="primary">
        <v-spacer />
        <v-btn v-if="loggedIn" @click="fcl.unauthenticate">logout</v-btn>
        <v-btn v-else @click="fcl.authenticate">login</v-btn>
    </v-app-bar>
</template>

<script>
import * as fcl from "@onflow/fcl";
import { mapState } from "vuex";

export default {
    data() {
        return {
            fcl,
        };
    },
    computed: {
        ...mapState(["loggedIn"]),
    },
};
</script>