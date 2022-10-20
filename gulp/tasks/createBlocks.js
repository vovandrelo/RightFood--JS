/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль FS - предоставляет функционал для работы с файловой структурой:
import fs from "fs";

// 2. Пользовательский модуль Path - предоставляет информацию о путях к необходимым файлам/папкам:
import { path } from "../config/path.js";


/* <================================================================================================================> */
/* <========================== РЕАЛИЗАЦИЯ ЗАДАЧИ СОЗДАНИЯ ФАЙЛОВОЙ СТРУКТУРЫ ДЛЯ БЛОКОВ ============================> */
/* <================================================================================================================> */


export const createBlocks = cb => {
    // Определяем необходимые пути:
    const pagesPath = `${path.rootFolder}/server/views/pages`;
    const blocksPath = `${path.rootFolder}/blocks`;


    // Считываем названия каждой страницы:
    fs.readdir(`${pagesPath}/`, (err, pagesName) => {
        // Если при считывании произошла ошибка, то выводим соответствующее сообщение:
        if (err) {
            console.log("Директории для блоков не были созданы. " + err);
        // Если при считывании не произошло ошибок, то:
        } else {
            // Если страницы существуют, то:
            if (pagesName) {
                // Перебираем каждую страницу:
                pagesName.forEach(pageName => {
                    try {
                        // Формирование массива со строками текущей страницы:
                        const pageLines = fs.readFileSync(`${pagesPath}/${pageName}`, 'utf8').toString().split("\n");
                        // Перебираем каждую строку текущей страницы:
                        pageLines.forEach(line => {
                            // Определяем индексы имени сущности:
                            const firstSymbol = line.indexOf("+") + 1;
                            const lastSymbol = line.indexOf("(");
                            // Если в текущей строке сущности нет, то переходим к следующей:
                            if (firstSymbol === -1 || lastSymbol === -1) {
                                return;
                            // Если в текущей строке существует сущность, то:
                            } else {
                                // Формируем полное название сущности:
                                const mainClassName = line.slice(firstSymbol, lastSymbol);
                                console.log(mainClassName);

                                // Если сущность - блок, то:
                                if (mainClassName.indexOf('__') === -1) {
                                    // Если такого блока ещё не существует, то:
                                    if (!fs.existsSync(`${blocksPath}/${mainClassName}`)) {
                                        // Создаём директорию для блока:
                                        fs.mkdirSync(`${blocksPath}/${mainClassName}`);
                                        // Создаём шаблон для разметки блока:
                                        fs.writeFileSync(`${blocksPath}/${mainClassName}/${mainClassName}.pug`, `mixin ${mainClassName}(mixAndMod = "")\n    tag.${mainClassName}(class=mixAndMod)\n        block`);
                                        // Создаём шаблон для стилей блока:
                                        fs.writeFileSync(`${blocksPath}/${mainClassName}/${mainClassName}.sass`, `.${mainClassName}`);
                                    }
                                // Если сущность - элемент, то:
                                } else if (mainClassName.indexOf('__') !== -1) {
                                    // Формируем название блока:
                                    const blockClassName = mainClassName.slice(mainClassName.indexOf("+") + 1, mainClassName.indexOf("_"));
                                    // Формируем название элемента:
                                    const elemClassName = mainClassName.slice(mainClassName.indexOf("__"));

                                    // Если такого элемента ещё не существует, то:
                                    if (!fs.existsSync(`${blocksPath}/${blockClassName}/${elemClassName}`)) {
                                        // Создаём директорию для элемента:
                                        fs.mkdirSync(`${blocksPath}/${blockClassName}/${elemClassName}`);
                                        // Создаём шаблон для разметки элемента:
                                        fs.writeFileSync(`${blocksPath}/${blockClassName}/${elemClassName}/${blockClassName}${elemClassName}.pug`, `mixin ${blockClassName}${elemClassName}(mixAndMod = "")\n    tag.${blockClassName}${elemClassName}(class=mixAndMod)\n        block`);
                                        // Создаём шаблон для стилей элемента:
                                        fs.writeFileSync(`${blocksPath}/${blockClassName}/${elemClassName}/${blockClassName}${elemClassName}.sass`, `.${blockClassName}${elemClassName}`);
                                    }
                                }
                            }
                        });
                    } catch (err) {
                        console.log("Директории для блоков не были созданы. " + err);
                    }
                });
            }
        }
    });
    cb();
};