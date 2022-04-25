import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
// eslint-disable-next-line no-unused-vars
import flushPromises from 'flush-promises'
import DragDropZone from './DragDropZone.vue'
// eslint-disable-next-line no-unused-vars
import { generateMounted, generateStore } from '@/test/util'
import { FileValidation } from './file.validation'
const localVue = createLocalVue()
localVue.use(Vuex)

const createMounted = generateMounted(DragDropZone, {
  localVue
})

describe('DragDropZone', () => {
  it('check standard function for ', async () => {
    const wrapper = createMounted()

    wrapper.find('.drag-drop').trigger('dragenter')
    await flushPromises()
    expect(wrapper.vm.active).toBe(true)

    wrapper.find('.drag-drop').trigger('dragleave')
    expect(wrapper.vm.active).toBe(false)
    await flushPromises()
  })

  it('displays a card for each device placement and sets props correctly', async () => {
    const wrapper = createMounted({
      propsData: {
        fileValidationOptions: [
          {
            ...FileValidation.options.kml,
            invalidText: 'some text'
          }
        ]
      }
    })
    const res = wrapper.vm._filterFilesByCriteria([
      {name: 'test.kml'},
      {name: 'ee.ee'},
      {name: 'rr.rr'},
    ])

    expect(res.successFiles).toStrictEqual([
      { name: 'test.kml' }
    ])
    expect(res.errorFiles).toStrictEqual([
      { name: 'ee.ee' },
      { name: 'rr.rr' }
      ])
  })
})
