/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль FS - предоставляет функционал для работы с файловой структурой:
import fs from "fs";

// 2. Модуль Path - предоставляет функционал для работы с путями:
import * as pathNode from "path";

// 3. Пользовательский модуль Path - предоставляет информацию о путях к необходимым файлам/папкам:
import { path } from "../../config/path.js";

/* <================================================================================================================> */
/* <================================== РЕАЛИЗАЦИЯ ЗАДАЧИ ПОДКЛЮЧЕНИЯ SASS-БЛОКОВ ===================================> */
/* <================================================================================================================> */

// Формирование массива со строками подключения необходимых sass-файлов:
const createStrInclude = (currentPath, pathImportBlocks) => {
    // Считывание названия всех файлов/папок по указанному пути:
    const fileNames = fs.readdirSync(currentPath);
    // Если в указанном папке были файлы/папки, то:
    if (fileNames) {
        // Этап 1. Подключение sass-файлов текущей директории:
        fileNames.forEach(fileName => {
            if (pathNode.extname(fileName) === ".sass") {
                const includeStr = createImportedPath(currentPath, fileName);
                fs.appendFileSync(pathImportBlocks, includeStr);
            }
        });
        // Этап 2. Переход в поддиректорию:
        fileNames.forEach(fileName => {
            if (pathNode.extname(fileName) === "" && fileName !== ".DS_Store") {
                createStrInclude(`${currentPath}${fileName}/`, pathImportBlocks);
            }
        });
    }
};

// Функция формирует строку подключения для sass-файла:
const createImportedPath = (path, fileName) => {
    return `@import  "../../../${path.substring(path.indexOf('blocks'))}${fileName}"\n`;
};

// Функция находит пути до необходимых sass-файлов и подключает их в blocks.sass
export const includeSass = cb => {
    // Отчищаем текущий файл с импортами блоков:
    fs.writeFileSync(path.sassInclude, "");

    // Выполняем основную задачу функции:
    createStrInclude(path.blocks, path.sassInclude);

    cb();
};