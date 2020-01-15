import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Alunos from '../views/Alunos.vue'
import Cursos from '../views/Cursos.vue'

Vue.use(VueRouter)
Vue.use(Vuetify)
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/alunos',
    name: 'alunos',
    component: Alunos
  },
  {
    path: '/cursos',
    name: 'cursos',
    component: Cursos
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
