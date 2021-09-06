<template>
    <v-app-bar
			app
			color="white"
			dark
	>
    <div class="d-flex align-center">
		<v-img
			alt="Mova Logo"
			class="shrink mr-2"
			contain
			src="https://mova.vc/img/footer_mova.svg"
			transition="scale-transition"
			width="80"
			height="80"
		/>
		</div>
		<v-spacer></v-spacer>
		<v-btn
			target="_blank"
			color="purple"
			outlined
            v-show="!$vuetify.breakpoint.xs"
            @click="onClickButton"
            v-if="visible!=null || view!=false"
		>
			<v-icon
                class="iconBack pr-4"  
                v-on:click="onClickButton"
            >
                mdi-keyboard-return
            </v-icon>
			<span class="mr-2 pl-2 hidden-xs-only" style="text-transform: capitalize" v-if="view != false">Voltar</span>
			<span class="mr-2 pl-2 hidden-xs-only" style="text-transform: capitalize" v-else>Limpar</span>
		</v-btn>
        <v-icon  
            color="purple"
            class="iconBack pr-4" 
            v-show="$vuetify.breakpoint.xs"
            v-on:click="onClickButton"
        >
            mdi-keyboard-return
        </v-icon>
    </v-app-bar>
</template>

<script>
export default {
    name:"cabeca",
    methods: {
        onClickButton () {
            this.$emit('clicked')
        }
    },
    props: {
        view: Boolean,
        visible: String,
    },
}
</script>