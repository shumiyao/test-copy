// Routing
// TODO https://stackoverflow.com/questions/51639850/how-to-change-page-titles-when-using-vue-router
var router = new VueRouter({
  mode: "history",
  base: window.location.pathname,
  routes: [
    {
      path: "/:pageSlug?",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const _metaParameters = to.params.meta || false;
  document.title =
    _metaParameters && _metaParameters.title
      ? _metaParameters.titleTemplate.replace(/%s/g, _metaParameters.title)
      : "";
  // TODO populate meta tags for the page
  next();
});
