import toolbar from '@/components/toolbar'
import Vue from 'vue'
import $axios from './helpers/api.mock'
import Vuetify from 'vuetify'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

Vue.use(Vuetify)
const vuetify = new Vuetify()
const localVue = createLocalVue()

$axios.jsonOverwritesPath = 'toolbar/'
localVue.prototype.$axios = $axios

Vue.use(Vuetify);

describe('index.vue', () => {
    const wrapper = shallowMount(toolbar, {
        localVue,
        vuetify,
        propsData: {
            view: true,
            visible: null
        },
    })

    test('emitir o click', async () => {
        const teste = await wrapper.vm.onClickButton()
        expect(teste).toBeUndefined()
    })
})