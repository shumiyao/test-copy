// import './cookieConsent.js';

var app = new Vue({
  router,
  el: "#app",
  // Reactive dynamic data (anything that needs updating)
  data() {
    return {
      currentPageData: [],
      currentPageSettings: null,
    };
  },
  mounted() {
    const _pageId =
      this.$route.query && this.$route.query.page_id
        ? this.$route.query.page_id
        : null;
    this.directToPage(_pageId);
    window.onload = function () {
      window.initCookieConsent();
    };
  },
  updated() {
    this.initializePageScripts();
  },
});
