/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль Gulp - предоставляет функционал для работы с  Gulp
import gulp from "gulp";

// 2. Пользовательский модуль Path - предоставляет информацию о путях к необходимым файлам/папкам
import { path } from "./gulp/config/path.js";



/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ ЗАДАЧИ ==============================================> */
/* <================================================================================================================> */

// 1. Задача, которая удаляет все данные из папки с результатом:
import { resetDist } from "./gulp/tasks/resetDist.js";

// 2. Задачи, которые объединяют PUG-файла и формируют необходимые html-файлы:
import { includePug } from "./gulp/tasks/includePug.js";

// 3. Задачи, которые объединяют SASS-файлы и формируют необходимые css-файлы:
import { includeSass } from "./gulp/tasks/sassProcessing/includeSass.js";
import { sassConversion } from "./gulp/tasks/sassProcessing/sassConversion.js";

// 4. Задача, которая копирует все js-файлы из папки с исходниками в папку с результатом:
import { jsProcessing } from "./gulp/tasks/jsProcessing.js";

// 5. Задача, которая копирует все изображения из папки с исходниками в папку с результатом:
import { copyImages } from "./gulp/tasks/copyImages.js";

// 6. Задачи, которые подключают необходимые шрифты:
import { otfToTtf } from "./gulp/tasks/fontsProcessing/otfToTtf.js";
import { ttfToWoff } from "./gulp/tasks/fontsProcessing/ttfToWoff.js";
import { includeFonts } from "./gulp/tasks/fontsProcessing/includeFonts.js";

// 8. Задача, которая формирует директории для отсутствующих блоков:
import { createBlocks } from "./gulp/tasks/createBlocks.js";

/* <================================================================================================================> */
/* <================================================= ЗАПУСК ЗАДАЧ =================================================> */
/* <================================================================================================================> */

// Работа с шрифтами:
const fonts = gulp.series(otfToTtf, ttfToWoff, includeFonts);

// Подключение блоков:
const includeBlocks = gulp.series(createBlocks, includePug, includeSass);

// Настройка наблюдателя:
const watcher = () => {
    // Наблюдение за sass-файлами:
    gulp.watch(path.watch.sass, { ignoreInitial: false }, sassConversion);
    // Наблюдение за js-файлами:
    gulp.watch(path.watch.js, { ignoreInitial: false }, jsProcessing);
    // Наблюдение за изображениями:  
    gulp.watch(path.watch.images, { ignoreInitial: false }, copyImages);
};

const dev = gulp.series(resetDist, fonts, watcher);

export {includeBlocks};
export default dev;