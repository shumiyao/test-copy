const classAttributes = siteData.variation.class_attributes;

// Components
Vue.component("Layout", {
  name: "layout",
  template: decodeURIComponent(
    siteData.variation.template_parts.layout.template
  ),
  data() {
    return {
      showMenu: false,
      ...classAttributes,
      wrapperClass: "fe-flex fe-flex-col",
    };
  },
});

var contentBodyForRegularPages = (templatePartsData) => {
  const _dataProperty = templatePartsData.data ? templatePartsData.data : null;
  return {
    name: "ContentBody",
    template: decodeURIComponent(templatePartsData.template),
    data() {
      return {
        wrapperClass: "fe-flex-1",
        filter: "all",
        markClassSettings: siteData.variation.class_attributes.markClasses,
        inlineCodeClassSettings:
          siteData.variation.class_attributes.inlineCodeClasses,
        filterClassSettings: siteData.variation.class_attributes.filterClasses,
        ..._dataProperty,
      };
    },
    methods: {
      /**
       * Get all the types of grid items and return as an array for the filter menu.
       * @param {Array} gridItems     Contents of grid items (block.data.items)
       * @returns  Array or boolean   Returns an array with all the item types available or false when it is not necessary to show the filter.
       */
      getGridFilterItemsInArray(gridItems = []) {
        // Don't show filter if there aren't any items
        if (gridItems.length < 1) {
          return false;
        }

        const types = [...new Set(gridItems.map((item) => item.type))];

        if (types.length > 1) {
          return ["all", ...types];
        }

        // No need to show filter: there is only one item type
        return false;
      },
      async getPageFeaturedMedia(pageID) {
        const { data } = await vm.$Page.get(this.project.id, pageID);

        return get(data, "page.featured_media_path");
      },
      updateFilter(link) {
        this.filter = link;
      },
    },
  };
};

//
// Create component helper
const createComponent = (name, componentData) => {
  const props = componentData.props ? JSON.parse(componentData.props) : {};
  const dataProps = componentData.data ? JSON.parse(componentData.data) : {};
  return {
    name: `froyio-${name}`,
    template: componentData.template,
    props: props,
    data() {
      return dataProps;
    },
    mounted() {
      if (name === "grid") {
        vm.updateGridItemSizes();
      }
    },
  };
};

// Section Component
Object.entries(siteData.components.section).forEach(([key, value]) => {
  Vue.component(`froyio-${key}`, {
    ...createComponent(key, value),
  });
});

// Block Component
Object.entries(siteData.components.block).forEach(([key, value]) => {
  Vue.component(`froyio-${key}`, {
    ...createComponent(key, value),
  });
});
