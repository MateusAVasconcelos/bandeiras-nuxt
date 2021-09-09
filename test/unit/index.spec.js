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
        expect(wrapper.vm.getInformations.length).toEqual(1)
    })

})
