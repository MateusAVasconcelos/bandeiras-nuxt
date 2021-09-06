<template>
	<div>
		<toolbar :view="viewPais" :visible="option" @clicked="back"></toolbar>
		<v-container v-show="!viewPais">
			<v-row>
				<v-flex sm4 xs12 md4 class="pl-6 pr-6 pa-4" v-for="flag in paginaFlags" :key="flag.index">
					<v-card  width="80%" height="200px">
					<img
						class="linkClickable" 
						width="100%" 
						height="200px" 
						:src="flag.flag"
						@click="getInformations(flag.alpha2Code)"
					/>
					</v-card>
				</v-flex>
			</v-row>
			<v-pagination
				v-model="page"
				:length="Math.ceil(flags.length/perPage)"
				@input="visiblePages($event)"
				class="pt-4"
				color="purple"
			>
			</v-pagination>
		</v-container>
	</div>
</template>

<script>
export default {
	components: {
		toolbar: () => import('../components/toolbar')
	},
	data () {
		return {
			//Pagina Principal (index)
			flags: [],
			paginaFlags: [],
			page: 1,
			perPage: 12,
			Filtros: [
				{
					nome: "Região",
					value: "region"
				},
				{
					nome: "Capital",
					value: "capital"
				},
				{
					nome: "Língua",
					value: "lang"
				},
				{
					nome: "País",
					value: "name"
				},
				{
					nome: "Código de ligação",
					value: "callingcode"
				},
			],
			//Pagina de informações do pais
			pageVizinho: 1,
			info: [],
			paisesVizinhos: [],
			paginaVizinhos: [],
			//Variavel utilizada em ambas
			viewPais: false,
			option: 'default',
			
		}
	},
	methods: {
		//Função para pegar as bandeiras dos paises
		async getFlags(option, selected){
			if(selected != null){
				const flags = await this.$axios.$get(`${option}/${selected}?fields=flag;alpha2Code`)
				this.flags = flags
			}else{
				const flags = await this.$axios.$get(`${option}?fields=flag;alpha2Code`)
				this.flags = flags
			}
			this.paginaFlags = this.flags.slice((this.page - 1)* this.perPage, this.page* this.perPage)
		},

		//pega as informações do país
		async getInformations(code){
			this.clear()
			this.viewPais = true
			const info = await this.$axios.$get(`alpha/${code}?fields=name;flag;region;capital;languages;alpha2Code;population;subregion;borders`)
			this.info = info
			getVizinhos(info)
		},

		//pega as bandeiras dos paises vizinhos do pais
		getVizinhos(info){
			for(var vizinhos = 0; vizinhos<info.borders.length; vizinhos++){
				this.$axios.$get(`alpha/${info.borders[vizinhos]}?fields=flag;alpha2Code`)
				.then((response)=>{
					this.paisesVizinhos.push({
						alpha2Code: response.data.alpha2Code,
						flag: response.data.flag
					})
				this.paginaVizinhos = this.paisesVizinhos.slice((this.pageVizinho - 1)* this.perPageVizinho, this.pageVizinho* this.perPageVizinho)					})
			}
		},

		//Determina qual a paginação e mostra as bandeiras correspondentes
		visiblePages(){
			this.paginaFlags = this.flags.slice((this.page - 1)* this.perPage, this.page* this.perPage)
		},
		back(){
			if(this.viewPais == true){
				this.viewPais = false
			}else{
				this.filtered = null
				this.filtro2 = null
				this.getFlags("all", null)
			}
			
		},
		clear(){
			this.paisesVizinhos = []
			this.paginaVizinhos = []
			this.page = 1
			this.pageVizinho = 1
		},

	},
	async mounted() {
		this.getFlags("all", null)
	}
}
</script>
<style scoped>
.linkClickable {
	color: purple;
	text-decoration: underline;
	text-decoration-color: purple;
	cursor: pointer;
}
</style>
