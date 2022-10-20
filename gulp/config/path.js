/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль Path - предоставляет функционал для работы с путями:
import * as nodePath from "path";

// Настройка функционирования к. с. __filename и __dirname:
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);      // jshint ignore:line
const __dirname = nodePath.dirname(__filename);         // jshint ignore:line

/* <================================================================================================================> */
/* <============================================== ОПРЕДЕЛЕНИЕ ПУТЕЙ ===============================================> */
/* <================================================================================================================> */

// Путь к основным папкам проекта:
const rootFolder = nodePath.join(__dirname, "..", "..");                    // Путь к папке проекта
const distFolder = nodePath.join(__dirname, "..", "..", "public/dist");     // Путь к папке со стаиическими файлами
const srcFolder = nodePath.join(__dirname, "..", "..", "public/src");       // Путь к папке с исходниками

// Объект с путями, 
export const path = {
    rootFolder,                                                 // Папка проекта
    srcFolder,                                                  // Папка со статическими файлами
    distFolder,                                                 // Папка с исходниками
    
    blocks: `${rootFolder}/blocks/`,                            // Папка с БЭМ-блоками
    pages: `${rootFolder}/server/views/pages`,                  // Папка со страницами сайта
    pugInclude: `${rootFolder}/server/views/include.pug`,       // Pug-файл, содержащий подключение всех блоков
    sassInclude: `${rootFolder}/public/src/sass/import.sass`,   // Sass-файл, содержащий подключение всех блоков

    dist: {
        css: `${distFolder}/css/`,                              // Результирующие CSS-файлы
        js: `${distFolder}/js/`,                                // Результирующие JS-файлы
        images: `${distFolder}/img/`,                           // Результирующее изображения
        fonts: `${distFolder}/fonts/`                           // Шрифты
    },
    src: {
        sass: `${srcFolder}/sass/style.sass`,                   // Готовый к компиляции SASS-файл
        js: `${srcFolder}/js/app.js`,                           // Готовый к компиляции JS-файл
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg}`,     // Готовые к сжатию изображения
        
    },
    watch: {
        sass: `${rootFolder}/blocks/**/*.sass`,                 // Изменяемые SASS-файлы
        js: `${srcFolder}/modules/**/*.js`,                     // Изменяемые JS-файлы
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg}`      // Изменяемые изображения
    },

    clean: distFolder,
};