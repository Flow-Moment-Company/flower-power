<template>
    <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        hide-default-footer
        class="d-flex flex-column mh-100 overflow-hidden"
    >
        <template v-slot:default="props">
            <v-row class="fill-height overflow-auto" id="container">
                <v-col
                    v-for="item in props.items"
                    :key="item.name"
                    :cols="(12/itemsPerRow)"
                    class="py-2"
                >
                    <v-card class="card fill-height">
                        <v-card-title>
                            <span class="font-weight-light text-truncate">
                                <span>{{ item.id }}</span>
                                {{ item.name }}
                            </span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <span class="mr-2">{{ item.description }}</span>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <template v-slot:footer>
            <v-row class="no-gutters mt-auto py-2 shrink" align="center" justify="center">
                <span class="mx-2">Rows per page</span>
                {{ rowsPerPage }} (based on viewport height)
                <v-spacer></v-spacer>
                <span class="mr-4 grey--text">
                    Page {{ page }} of
                    <span
                        v-text="numberOfPages"
                        class="font-weight-bold primary--text"
                    ></span>
                </span>
                <v-btn small dark rounded color="blue darken-3" class="mr-1" @click="formerPage">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn small dark rounded color="blue darken-3" class="ml-1" @click="nextPage">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-row>
        </template>
    </v-data-iterator>
</template>

<script>
export default {
    data() {
        return {
            bottom: false,
            rowsPerPageArray: [3, 4, 6],
            rowsPerPage: 4,
            page: 1,
            busy: false,
        };
    },
    props: {
        items: Array,
    },
    computed: {
        numberOfPages() {
            const vm = this;
            return Math.ceil(vm.items.length / vm.itemsPerPage);
        },
        itemsPerRow() {
            const vm = this;

            let result;
            switch (vm.$vuetify.breakpoint.name) {
                case "xs":
                    result = 1;
                    break;
                case "sm":
                    result = 2;
                    break;
                case "md":
                    result = 3;
                    break;
                case "lg":
                    result = 4;
                    break;
                case "xl":
                    result = 6;
                    break;
            }
            return result;
        },
        itemsPerPage() {
            const vm = this;
            return Math.ceil(vm.rowsPerPage * vm.itemsPerRow);
        },
    },
    methods: {
        nextPage() {
            const vm = this;
            if (vm.page + 1 <= vm.numberOfPages) vm.page += 1;
        },
        formerPage() {
            const vm = this;
            if (vm.page - 1 >= 1) vm.page -= 1;
        },
        calcRowsPerPage() {
            const vm = this;

            let container = document.getElementById("container");
            let minItemHeight = 170;
            if (container) {
                let containerHeight = parseInt(container.clientHeight, 0);
                console.log(containerHeight);
                vm.rowsPerPage = Math.floor(
                    Math.max(containerHeight, minItemHeight) / minItemHeight
                );
            } else {
                vm.rowsPerPage = 3;
            }
        },
    },
    mounted() {
        const vm = this;
        window.addEventListener("resize", () => {
            if (!vm.busy) {
                vm.busy = true;
                setTimeout(() => {
                    vm.calcRowsPerPage();
                    vm.busy = false;
                }, 300);
            }
        });
    },
};
</script>

<style>
.mh-100 {
    min-height: 100vh;
    max-height: 100vh;
    height: 100vh;
}

.overflow-hidden {
    overflow: hidden;
}

.theme--light.v-application {
    background-color: #ddd;
}
</style>