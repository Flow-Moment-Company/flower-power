<template>
    <div>
        <v-app-bar color="primary">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-spacer />
            <v-btn v-if="loggedIn" @click="fcl.unauthenticate">logout</v-btn>
            <v-btn v-else @click="fcl.authenticate">login</v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" app>
            <v-list nav>
                <v-list-item exact :to="{ name: 'Home' }">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="loggedIn" exact :to="{ name: 'Account' }">
                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Account</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import * as fcl from "@onflow/fcl";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            fcl,
            drawer: true,
        };
    },
    computed: {
        ...mapGetters(["loggedIn"]),
    },
};
</script>