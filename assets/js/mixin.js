Vue.mixin({
  computed: {
    uploadedOriginalImageDirUrl() {
      return this.storageUrl + "/uploads/images/original/";
    },
    uploadedThumbnailImageDirUrl() {
      return this.storageUrl + "/uploads/images/thumbnail/";
    },
    loading() {
      return this.$root.loading;
    },
    user() {
      return this.$store.getters["user/record"];
    },
    project() {
      return this.$store.getters["froyio/project"];
    },
    page() {
      return this.$store.getters["froyio/page"];
    },
    pageSettings() {
      return this.$root.currentPageSettings || {};
    },
    masthead() {
      return this.$root.currentPageSettings &&
        this.$root.currentPageSettings.masthead
        ? this.$root.currentPageSettings
        : { show: false };
    },
    template() {
      return this.$store.getters["froyio/templateData"];
    },
    variation() {
      return this.template.variations[this.project.settings_design.variation];
    },
    storageUrl() {
      return "";
    },
    // Returns false by default. Show logo image by returning a string of path to the image file.
    logoImageUrl() {
      return siteData.logoImageUrl || false;
    },
    projectTitle() {
      return siteData.projectTitle;
    },
    templateName() {
      return siteData.templateName;
    },
    siteSettings_navigation() {
      return siteData.siteSettings_navigation;
    },
    siteEmail() {
      return siteData.siteEmail;
    },
    // * Returning false will hide those SNS icons.
    facebookPageName() {
      return siteData.facebookPageName;
    },
    instagramAccountName() {
      return siteData.instagramAccountName;
    },
    twitterAccountName() {
      return siteData.twitterAccountName;
    },
    youtubeChannelUrl() {
      return siteData.youtubeChannelUrl;
    },
    cookieConsent() {
      return siteData.cookieConsent;
    },
    // * read from App.vue
    copyrightStatement() {
      return siteData.copyrightStatement;
    },
    blocks() {
      return this.$root.currentPageData.blocks || [];
    },
    originalImageDirPath() {
      return "";
    },
    footerSettings_navigation() {
      return [
        {
          id: "privacy-policy",
          home: false,
          name: "Privacy Policy",
          url: "/privacy-policy/",
          show: true,
          item_type: "custom",
        },
        {
          id: "terms-of-sale",
          home: false,
          name: "Terms Of Sale",
          url: "/terms-of-sale/",
          show: true,
          item_type: "custom",
        },
      ];
    },
    contentBody() {
      console.log(this.$route);
      const _pageSlug =
        this.$route.params && this.$route.params.pageSlug
          ? this.$route.params.pageSlug
          : false;
      if (_pageSlug === "privacy-policy") {
        return contentBodyForRegularPages(
          siteData.variation.template_parts.privacy
        );
      } else if (_pageSlug === "terms-of-sale") {
        console.log(siteData.variation.template_parts.terms);
        return contentBodyForRegularPages(
          siteData.variation.template_parts.terms
        );
      } else {
        return contentBodyForRegularPages(
          siteData.variation.template_parts.blocks
        );
      }
    },
  },
  methods: {
    async directToPage(pageId) {
      // find home page if page id is not set
      if (!pageId) {
        pageId = this.findHomepageId();
      }
      // get page slug
      const _pageSlug =
        pageId === "privacy-policy" || pageId === "terms-of-sale"
          ? pageId
          : this.getPageSlug(pageId);

      // get page Content
      const _currentPageData = this.getBlockByPageId(pageId);
      console.log(_currentPageData);
      // / for homepage (root top)
      await this.$router.push(
        {
          path: "/" + _pageSlug || "/",
          name: _currentPageData.title,
          params: {
            meta: {
              title: _currentPageData.title,
              titleTemplate: "%s | " + siteData.projectTitle,
            },
          },
        },
        // onComplete
        () => {
          this.$root.currentPageData = _currentPageData;
        },
        // onAbort
        (error) => error
      );
    },
    findHomepageId() {
      const _homePageData = siteData.pages.find(
        (element) => element.is_home == true
      );
      return !_homePageData ? siteData.pages[0].id : _homePageData.id;
    },
    getPageSlug(pageId) {
      const _currentPageData = siteData.pages.find(
        (element) => element.id == pageId
      );
      return _currentPageData.slug;
    },
    findIdBySlug(slug) {
      const _foundData = siteData.pages.find((element) => element.slug == slug);
      return _foundData.id;
    },
    /*
     * find page data by id
     * if found return page data, if not found , return 404 page
     */
    getBlockByPageId(pageId) {
      if (pageId === "privacy-policy" || pageId === "terms-of-sale") {
        return {
          blocks: [],
        };
      }
      const _currentPageData = siteData.pages.find(
        (element) => element.id == pageId
      );
      if (_currentPageData) {
        // in case of page redirected from 404 as a workaround of direct url page
        return _currentPageData;
      } else {
        return {
          blocks: [
            {
              data: {
                text: "404",
              },
              type: "paragraph",
            },
          ],
        };
      }
    },

    /**
     * Component Methods
     */
    /**
     * Toggles IG video status in grid
     * @param {event} click event
     */
    toggleMediaStatus(event) {
      event.preventDefault();
      let video = event.target.parentNode.querySelector(".video");
      if (video.paused) {
        this.$parent.pauseAllVideos(document.getElementById("preview"));
        event.target.querySelector(".play-icon").classList.add("hidden");
        event.target.querySelector(".pause-icon").classList.remove("hidden");
        video.play();
        this.mediaProgress(video, event);
      } else {
        event.target.querySelector(".play-icon").classList.remove("hidden");
        event.target.querySelector(".pause-icon").classList.add("hidden");
        video.pause();
        video.removeEventListener("timeupdate", this.mediaProgress);
      }
    },
    // aux pages
    // contentBody() {
    //   console.log(this);
    //   return contentBodyForRegularPages;
    //   // const _ pageId === "privacy-policy"
    //   //   ? siteData.variation.template_parts.privacy
    //   //   : siteData.variation.template_parts.terms;
    // },
    /**
     * Calculates and shows play progress of IG video in grid
     * @param {object} video
     * @param {event} status event
     */
    mediaProgress(video, event) {
      let progressBar = event.target.querySelector(".progress-bar");
      video.addEventListener("timeupdate", function () {
        // if the video is loaded and duration is known
        if (!isNaN(this.duration)) {
          var percent_complete = this.currentTime / this.duration;
          progressBar.style.width = percent_complete * 100 + "%";
        }
      });
    },
    pauseAllVideos(grid) {
      grid.querySelectorAll(".video").forEach(function (video) {
        video.pause();
        video
          .closest("figure")
          .querySelector(".play-icon")
          .classList.remove("hidden");
        video
          .closest("figure")
          .querySelector(".pause-icon")
          .classList.add("hidden");
      });
    },
    /**
     * Transform url to embed form either for youtube or video otherwise return as is.
     * @param {String} url
     */
    embedURL(url) {
      const ytRegex =
        /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/; // eslint-disable-line
      const ytMatch = url.match(ytRegex);

      const vimeoRegex =
        /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([‌​0-9]{6,11})[?]?.*/; // eslint-disable-line
      const vimeoMatch = url.match(vimeoRegex);

      if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
      }

      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[5]}`;
      }

      return url;
    },
  },
});
