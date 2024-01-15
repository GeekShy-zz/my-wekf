let app = null;

class WePage {
  constructor() {
    if(!app) {
      app = getApp();
    }
    this.$app = app;
  }
}

function createPage(pageClass) {
  const pageOptions = new pageClass();
  Page(pageOptions);
}

export default {
  'WePage': WePage,
  'createPahe': createPage
}