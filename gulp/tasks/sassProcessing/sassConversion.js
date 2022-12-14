/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль Gulp - предоставляет функционал для работы с  Gulp:
import gulp from "gulp";

// 2. Модули Sass и GulpSass - предоставляют функционал для работы с Sass:
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

// 3. Моудль GulpGroupCssMediaQueries - предоставляет функционал для объединения медиа-запросов
import gcmq from "gulp-group-css-media-queries";

// 4. Модуль Autoprefixer - предоставляет функционал для работы с вендорными префиксами:
import autoPrefixer from "gulp-autoprefixer";

// 5. Модуль GulpClean - предоставляет функционал по сжатию css-файлов:
import cleanCSS from "gulp-clean-css";

// 6. Модуль Rename - предоставляет функционла для переименования файлов:
import rename from "gulp-rename";

// 7. Пользовательский модуль Path - предоставляет информацию о путях к необходимым файлам/папкам:
import { path } from "../../config/path.js";

/* <================================================================================================================> */
/* <============================ РЕАЛИЗАЦИЯ ЗАДАЧИ СОЗДАНИЯ РЕЗУЛЬТИРУЮЩЕГО CSS ФАЙЛА ==============================> */
/* <================================================================================================================> */

// Функция объединяет sass-файлы, переводит их в css и перемещает из папки с исходниками в папку с результатом:
export const sassConversion = () => {
    return gulp.src(path.src.sass, { sourcemaps: true })    // Считываем из папки с исходниками необходимый sass-файл
        .pipe(sass().on('error', sass.logError))            // Преобразуем sass-файл в css-файл
        .pipe(gcmq())                                       // Объединяем медиа-запросы в css-файле
        .pipe(autoPrefixer({                                // Настраиваем вендерные префиксы в css-файле
            grid: true,                                     // - поддержка сеток
            overrideBrowserslist: ["last 3 version"]        // - используем последние 3 версии браузера
        }))
        .pipe(gulp.dest(path.dist.css))                // Записываем сформированный css-файл в папку с результатом
        .pipe(cleanCSS({compatibility: 'ie8'}))         // Сжимаем получившийся css-файл
        .pipe(rename({extname: ".min.css"}))            // Изменяем название файла
        .pipe(gulp.dest(path.dist.css));               // Записываем миннифицированный css-файл в папку с результатом
};