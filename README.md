# Marketspace

## Framework7 CLI Options

Framework7 app created with following options:

```
{
  "cwd": "D:\\work\\projects\\remote\\marketplace-riga-latvia-phonegap\\mobile-app-ts",
  "type": [
    "web",
    "cordova",
    "pwa"
  ],
  "name": "Marketspace",
  "framework": "react",
  "template": "single-view",
  "bundler": "webpack",
  "cssPreProcessor": "less",
  "theming": {
    "customColor": false,
    "color": "#007aff",
    "darkTheme": false,
    "iconFonts": true,
    "fillBars": true
  },
  "customBuild": true,
  "customBuildConfig": {
    "rtl": true,
    "darkTheme": true,
    "lightTheme": true,
    "themes": [
      "ios",
      "md"
    ],
    "components": [
      "appbar",
      "dialog",
      "popup",
      "login-screen",
      "popover",
      "actions",
      "sheet",
      "toast",
      "preloader",
      "progressbar",
      "sortable",
      "swipeout",
      "accordion",
      "contacts-list",
      "virtual-list",
      "list-index",
      "tabs",
      "panel",
      "card",
      "chip",
      "form",
      "input",
      "checkbox",
      "radio",
      "toggle",
      "range",
      "stepper",
      "smart-select",
      "grid",
      "picker",
      "infinite-scroll",
      "pull-to-refresh",
      "lazy",
      "data-table",
      "fab",
      "searchbar",
      "messages",
      "messagebar",
      "swiper",
      "photo-browser",
      "notification",
      "autocomplete",
      "tooltip",
      "gauge",
      "skeleton",
      "menu",
      "color-picker",
      "treeview",
      "text-editor",
      "elevation",
      "typography"
    ]
  },
  "webpack": {
    "developmentSourceMap": true,
    "productionSourceMap": true,
    "hashAssets": false,
    "preserveAssetsPaths": false,
    "inlineAssets": true
  },
  "pkg": "com.marketspace.app",
  "cordova": {
    "folder": "cordova",
    "platforms": [
      "android"
    ],
    "plugins": [
      "cordova-plugin-statusbar",
      "cordova-plugin-keyboard",
      "cordova-plugin-splashscreen",
      "cordova-plugin-wkwebview-file-xhr",
      "cordova-plugin-device",
      "cordova-plugin-inappbrowser",
      "cordova-plugin-file",
      "cordova-plugin-safariviewcontroller"
    ]
  }
}
```

## NPM Scripts

- 🔥 `start` - run development server
- 🔧 `dev` - run development server
- 🔧 `build-dev` - build web app using development mode (faster build without minification and optimization)
- 🔧 `build-prod` - build web app for production
- 📱 `build-dev-cordova` - build cordova app using development mode (faster build without minification and optimization)
- 📱 `build-prod-cordova` - build cordova app

## WebPack

There is a webpack bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Webpack config located in `build/webpack.config.js`.

Webpack has specific way of handling static assets (CSS files, images, audios). You can learn more about correct way of doing things on [official webpack documentation](https://webpack.js.org/guides/asset-management/).

## PWA

This is a PWA. Don't forget to check what is inside of your `service-worker.js`. It is also recommended that you disable service worker (or enable "Update on reload") in browser dev tools during development.

## Cordova

Cordova project located in `cordova` folder. You shouldn't modify content of `cordova/www` folder. Its content will be correctly generated when you call `npm run cordova-build-prod`.

## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 generate-assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 generate-assets --ui
```

## Documentation & Resources

- [Framework7 Core Documentation](https://framework7.io/docs/)

- [Framework7 React Documentation](https://framework7.io/react/)

- [Framework7 Icons Reference](https://framework7.io/icons/)
- [Community Forum](https://forum.framework7.io)

## Support Framework7

Love Framework7? Support project by donating or pledging on patreon:
https://patreon.com/vladimirkharlampidi
