import Vue from 'vue'
import Router from 'vue-router'
import Top from '@/components/Top'
import Camera from '@/components/Camera'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'top',
      component: Top
    },
    {
      path: '/camera',
      name: 'camera',
      component: Camera
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    }
  ]
})
