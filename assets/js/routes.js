// Routing
// TODO https://stackoverflow.com/questions/51639850/how-to-change-page-titles-when-using-vue-router
var router = new VueRouter({
  mode: 'history',
  base: window.location.pathname,
  routes: [
    {
      path: '/:pageSlug?',
    },
  ]
});
