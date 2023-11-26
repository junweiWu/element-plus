<script lang="ts" setup>
import { computed } from 'vue'
import { useLang } from '../../composables/lang'
import sponsorLocale from '../../../i18n/component/sponsor.json'

defineProps({
  sponsors: Array,
  sponsorType: String,
})

const lang = useLang()
const sponsorLang = computed(() => sponsorLocale[lang.value])
</script>

<template>
  <h2 class="text-center mb-4 text-xl">{{ sponsorLang[sponsorType] }}</h2>
</template>
