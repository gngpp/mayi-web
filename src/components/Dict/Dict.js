import Vue from 'vue'
import { get as getDictDetail } from '@/api/system/dictDetail'

export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    names.forEach(n => {
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(getDictDetail(n).then(data => {
        this.dict[n].splice(0, 0, ...data.data.records)
        data.data.records.forEach(d => {
          let ret
          if (d.value) {
            ret = 'true'
          } else {
            ret = 'false'
          }
          Vue.set(this.dict.dict[n], ret, d)
          Vue.set(this.dict.label[n], ret, d.label)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
