import { createRouter, createWebHistory } from 'vue-router'

const base = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', redirect: '/dashboards' },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: 'dashboards', component: () => import('@/views/DashboardList.vue') },
        { path: 'd/:id', component: () => import('@/views/DashboardViewer.vue') },
        { path: 'd/:id/edit', component: () => import('@/views/DashboardDesigner.vue') },
        { path: 'admin', component: () => import('@/views/AdminPlaceholder.vue') },
        { path: 'data-sources', component: () => import('@/views/DataSources.vue') }
      ]
    }
  ]
})

export default router
