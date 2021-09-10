import index from '@/pages/index'
import Vue from 'vue'
import $axios from './helpers/api.mock'
import Vuetify from 'vuetify'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

Vue.use(Vuetify);
const localVue = createLocalVue()
$axios.jsonOverwritesPath = 'index/'
localVue.prototype.$axios = $axios
let vuetify

describe('index.vue', () => {
    beforeEach(function(){
        vuetify = new Vuetify()
    })
    const wrapper = shallowMount(index, {
        localVue,
        $axios,
        vuetify, 
        data() {
            return {
                
            }
        },
    })

    test('Não aparecer o segundo filtro caso o primeiro esteja vazio', () => {
        const segundoFiltro = wrapper.find('.selected');
        expect(segundoFiltro.exists()).toEqual(false);
    })

    test('Aparecer o segundo filtro caso o primeiro esteja preenchido', async () => {
        await wrapper.setData({ option: 'capital' });
        const segundoFiltro = wrapper.find('.selected')
        wrapper.vm.$nextTick();
        expect(segundoFiltro.exists()).toEqual(true)
    })

    test('O total de bandeiras puxadas da API ser maior que', async () => {
        expect(wrapper.vm.flags.length).toBeGreaterThan(200)
    })

    test('ter informações do pais clicado', async () => {
        await wrapper.vm.getInformations("AF")
        expect(wrapper.vm.info).toBeDefined()
    })

    test('ter informações do filtro por região', async () => {
        await wrapper.setData ({ option: 'region' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })


    test('ter informações do filtro por capital', async () => {
        await wrapper.setData ({ option: 'capital' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })

    test('ter informações do filtro por lingua', async () => {
        await wrapper.setData ({ option: 'lang' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })

    test('ter informações do filtro por país', async () => {
        await wrapper.setData ({ option: 'name' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })

    test('ter informações do filtro por código de ligação', async () => {
        await wrapper.setData ({ option: 'callingcode' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })

    test('ter informações do filtro default', async () => {
        await wrapper.setData ({ option: 'null' });
        await wrapper.vm.filter()
        expect(wrapper.vm.filterList).toBeDefined()
    })

    test('ver se a visibilidade da pagina está tendo 12 bandeiras', async () => {
        wrapper.vm.visiblePages()
        expect(wrapper.vm.paginaFlags.length).toBeGreaterThan(11)
    })

    test('ver se a visibilidade da pagina dos vizinhos está tendo 3 bandeiras', async () => {
        await wrapper.vm.getInformations("AF")
        wrapper.vm.visiblePagesVizinhos()
        expect(wrapper.vm.paginaVizinhos.length).toBeGreaterThan(2)
    })

    test('Voltar pagina quando der back', async () => {
        wrapper.setData({ option: 'capital' })
        wrapper.setData({ selected: 'Kabul' })
        await wrapper.vm.getInformations("AF")
        wrapper.vm.back()
        expect(wrapper.vm.viewPais).toBe(false)
        expect(wrapper.vm.option).toEqual('capital')
        expect(wrapper.vm.selected).toEqual('Kabul')
    })

    test('limpar variaveis caso não esteja na pagina 2', ()=>{
        wrapper.setData({ option: 'capital' })
        wrapper.setData({ selected: 'Kabul' })
        wrapper.vm.back()
        expect(wrapper.vm.option).toEqual(null)
        expect(wrapper.vm.selected).toEqual(null)
    })
    
})
