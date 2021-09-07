<template>
	<div>
		<toolbar :view="viewPais" :visible="option" @clicked="back"></toolbar>
		<v-container v-show="!viewPais">
			<v-row class="pl-1 pt-7 pb-7">
				<v-flex md4 xs12 sm6>	
					<v-autocomplete
						v-model="option"
						:items="Filtro"
						label="Escolha uma opção"
						item-text="nome"
						item-value="value"
						@change="[filter($event), selected = null]"
						clearable
						style="width: 80%"
						color="#6D2080"
						item-color="#6D2080"
					>
					</v-autocomplete>
				</v-flex>
				<v-flex md4 xs12 sm6>
					<v-autocomplete
						v-model="selected"
						v-if="option"
						:items="filterList"
						item-text="nome"
						item-value="value"
						:label="nameFilter"
						style="width: 80%"
						color="#6D2080"
						item-color="#6D2080"
						>
					</v-autocomplete>
				</v-flex>
				<v-flex md4 xs12 sm6>
					<v-btn
					v-if="selected != null"
					color="#6D2080"
					dark
					@click="[getFlags(option, selected)]"	
					>
						Pesquisar
					</v-btn>	
				</v-flex>
			</v-row>
			<v-row>
				<v-flex sm4 xs12 md4 class="pl-6 pr-6 pa-4" v-for="flag in paginaFlags" :key="flag.index">
					<v-card  width="500px" height="200px">
					<img
						id="bandeira"
						class="linkClickable" 
						width="100%"
						height="100%"
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
		<v-container v-show="viewPais" grid-list-xl class="mt-md-12">
			<v-layout row wrap>
				<v-flex d-flex xs12 sm6 md5>
					<v-card elevation="0">
						<v-img :src="info.flag" height="100%"> </v-img>
					</v-card>
				</v-flex>
				<v-flex d-flex xs12 sm6 md7>
					<v-flex d-flex>
						<v-layout row wrap>
							<v-card elevation="0">
								<v-card-subtitle>
									Nome: {{info.name}}
								</v-card-subtitle>
								<v-card-subtitle>
									Capital: {{info.capital}}
								</v-card-subtitle>
								<v-card-subtitle>
									Região: 
									<span
										class="linkClickable"
										@click="[option='region', selected = info.region, viewPais = false,filter(), getFlags(option, selected)]"
									> 
										{{info.region}} 
									</span>
								</v-card-subtitle>
								<v-card-subtitle>
									Sub-região: {{info.subregion}}
								</v-card-subtitle>
								<v-card-subtitle>
									População: {{info.population}}
								</v-card-subtitle>
								<v-card-subtitle>
									Línguas: 
									<span v-for="language in info.languages" :key="language.index">{{language.nativeName}}, </span>
								</v-card-subtitle>
							</v-card>
						</v-layout>
					</v-flex>
				</v-flex>
			</v-layout>
			<v-layout>
				<v-card elevation="0" class="mt-md-12">
					<v-card-text v-if="paisesVizinhos.length>0">
						Países vizinhos
					</v-card-text>
					<v-card-text v-else>
						Esse país não possui países vizinhos
					</v-card-text>
				</v-card>
			</v-layout>
			<v-layout row wrap>
				<v-flex d-flex>
					<v-layout wrap>
						<v-flex md4 sm4 v-for="vizinho in paginaVizinhos" :key="vizinho.id">
							<v-card class="card-container">
								<v-img 
									class="linkClickable" 
									:src="vizinho.flag" 
									height="200px" 
									@click="[getInformations(vizinho.alpha2Code)]"
								>	
								</v-img>
							</v-card>
						</v-flex>
					</v-layout> 
				</v-flex>
			</v-layout>
			<v-pagination v-if="paisesVizinhos.length>0"
				v-model="pageVizinho"
				:length="Math.ceil(paisesVizinhos.length/perPageVizinho)"
				@input="visiblePagesVizinhos($event)"
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
			filterList: [],
			page: 1,
			perPage: 12,
			perPageVizinho: 3,
			nameFilter: null,
			Filtro: [
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
			option: null,
			selected: null,
			info: [],
			paisesVizinhos: [],
			paginaVizinhos: [],
			//Variavel utilizada em ambas
			viewPais: false,
			
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
			this.getVizinhos(info)
		},

		//pega as bandeiras dos paises vizinhos do pais
		async getVizinhos(info){
			for(var contador = 0; contador<info.borders.length; contador++){
				const vizinhos = await this.$axios.$get(`alpha/${info.borders[contador]}?fields=flag;alpha2Code`)
				.then((vizinhos)=>{
					this.paisesVizinhos.push({
						alpha2Code: vizinhos.alpha2Code,
						flag: vizinhos.flag
					})
				this.paginaVizinhos = this.paisesVizinhos.slice((this.pageVizinho - 1)* this.perPageVizinho, this.pageVizinho* this.perPageVizinho)					})
			}
		},

		//Filtra as bandeiras
		async filter(){
			switch (this.option) {
				//filtro por região
				case "region":
					this.nameFilter = "Região"
					const region = await this.$axios.$get('all?fields=region')
					.then((region)=> {
						this.filterList = region.filter(element => {
							element.nome = element.region
							element.value = element.region
							return element;
						});
					})
				break;
				//filtro por capital
				case "capital":
					this.nameFilter = "Capital"
					const capital = await this.$axios.$get('all?fields=capital')
					.then((capital)=>{
						this.filterList = capital.filter(element => {
							element.nome = element.capital
							element.value = element.capital
							return element;
						});
					})
				break;
				//filtro por língua
				case "lang":
					this.nameFilter = "Língua"
					const lingua = await this.$axios.$get('all?fields=languages')
					this.linguas = lingua;
					this.filterList = this.linguas.map((lingua)=>{
						for(var i=0; i<lingua.languages.length; i++){
							if(lingua){
								return {
									nome: lingua.languages[i].nativeName,
									value: lingua.languages[i].iso639_1
								}
							}
						}
					})
				break;
				//filtro por país
				case "name":
					this.nameFilter = "País"
					const pais = await this.$axios.$get('all?fields=name')
					.then((pais)=>{
						this.filterList = pais.filter(element => {
							element.nome = element.name
							element.value = element.name
							return element;
						})
					})
				break;
				//filtro por codigo de ligação
				case "callingcode":
					this.nameFilter = "Código de ligação"
					const codigo = await this.$axios.$get('all?fields=callingCodes')
					this.calling = codigo;
					this.filterList = this.calling.map((call)=>{
						for(var i=0; i<call.callingCodes.length; i++){
							if(call){
								return {
									nome: call.callingCodes[i],
									value: call.callingCodes[i]
								}
							}
						}
					})
				break;
				//default país
				default:
					const defau = await this.$axios.$get('all?fields=name')
					.then((defau)=>{
						this.filterList = defau.filter(element => {
							element.nome = element.name
							return element;
						})
					})
				break;
			}
			this.clear()
		},

		

		//Determina qual a paginação e mostra as bandeiras correspondentes
		visiblePages(){
			this.paginaFlags = this.flags.slice((this.page - 1)* this.perPage, this.page* this.perPage)
		},

		//Determina qual a paginação e mostra as bandeiras correspondentes
		visiblePagesVizinhos(){
			this.paginaVizinhos = this.paisesVizinhos.slice((this.pageVizinho - 1)* this.perPageVizinho, this.pageVizinho* this.perPageVizinho)
		},

		//Retorna pra pagina anterior
		back(){
			if(this.viewPais == true){
				this.viewPais = false
			}else{
				this.option = null
				this.selected = null
				this.getFlags("all", null)
			}
		},

		//Limpa filtros
		clear(){
			this.paisesVizinhos = []
			this.paginaVizinhos = []
			this.page = 1
			this.pageVizinho = 1
		},

	},
	async mounted() {
		this.getFlags("all", null)
	},
}
</script>
<style scoped>
.linkClickable {
	color: purple;
	text-decoration: underline;
	text-decoration-color: purple;
	cursor: pointer;
}
#bandeira{
	object-fit: cover;
}
</style>
