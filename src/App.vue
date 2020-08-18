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
import { mapMutations } from "vuex";
import * as fcl from "@onflow/fcl";

export default {
    components: {
        Header,
        Footer,
    },
    methods: {
        ...mapMutations(["setLoggedIn"]),
    },
    mounted() {
        const vm = this;

        fcl.currentUser().subscribe((user) => {
            vm.setLoggedIn(user.loggedIn);
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