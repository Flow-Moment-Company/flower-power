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

export default {
    components: {
        Header,
        Footer,
    },
};
</script>

<style>
.header {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 50px;
    z-index: 2;
}
.content {
    position: fixed;
    top: 50px;
    bottom: 50px;
    width: 100%;
    z-index: 1;
}
.footer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    z-index: 2;
}
</style>