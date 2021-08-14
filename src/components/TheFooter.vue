<template>
    <a-layout-footer style="text-align: center">
        Copyright © 2007 - 2021 福建中测信息有限公司
    </a-layout-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TheFooter',
    props: {
        msg: String,
    },
});
</script>

<style>
    .ant-layout-footer {
        padding: 4px 50px !important;
    }
</style>