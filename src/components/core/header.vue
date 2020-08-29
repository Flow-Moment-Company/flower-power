<template>
    <v-app-bar color="primary">
        <v-spacer />
        <v-btn v-if="loggedIn" @click="fcl.unauthenticate">logout</v-btn>
        <v-btn v-else @click="fcl.authenticate">login</v-btn>
    </v-app-bar>
</template>

<script>
import * as fcl from "@onflow/fcl";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            fcl,
            navigation: true,
        };
    },
    computed: {
        ...mapGetters(["loggedIn"]),
    },
};
</script>