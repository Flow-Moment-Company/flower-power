<template>
    <div>
        <item-cards :items="items" />
    </div>
</template>

<script>
import ItemCards from "@/components/core/item-cards";

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
    components: {
        ItemCards,
    },
};
</script>