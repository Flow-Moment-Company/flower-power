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
                        <v-card
                            ripple
                            class="pointer"
                            @click="$router.push({name: 'Moment', query: { momentId: item.id }})"
                        >
                            <v-card-title>{{ item.FullName }}</v-card-title>
                            {{ item.CurrentTeam }}
                            Autographs:
                            <span
                                v-for="autograph of item.autographs"
                                :key="autograph.document"
                            >
                                {{ autograph.author }}
                                <v-img v-if="autograph.document" :src="autograph.document" />
                            </span>
                            <v-card-actions>
                                <v-btn
                                    @click="$router.push({name: 'Moment', query: { momentId: item.id, sign: 1 }})"
                                >Sign it!</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState(["moments"]),
        ...mapGetters(["address"]),
    },
    methods: {
        ...mapActions(["sendScript", "sendTransaction"]),
    },
};
</script>
 