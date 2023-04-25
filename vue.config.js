module.exports = {
  publicPath: process.env.DEPLOY_ENV === "GH_PAGES"
    ? "/coffe management system/"
    : "/"
};
