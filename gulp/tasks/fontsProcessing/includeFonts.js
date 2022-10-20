/* <================================================================================================================> */
/* <============================================== НЕОБХОДИМЫЕ МОДУЛИ ==============================================> */
/* <================================================================================================================> */

// 1. Модуль FS - предоставляет функционал для работы с файловой структурой:
import fs from "fs";

// 2. Пользовательский модуль Path - предоставляет информацию о путях к необходимым файлам/папкам:
import { path } from "../../config/path.js";

/* <================================================================================================================> */
/* <=============================== ФОРМИРОВАНИЕ SASS-СТРУКТУРЫ ПОДКЛЮЧЕНИЯ ШРИФТОВ ================================> */
/* <================================================================================================================> */

// Функция формирует sass-структуру для подключения шрифтов:
export const includeFonts = (cb) => {
    // Файл со стилями, где покдлючаются шрифты:
    let fontsFile = `${path.srcFolder}/sass/fonts.sass`;

    // Считываем из папки со шрифтами названия всех файлов в качестве массива.
    // Аргумент №1 - Путь к папке с файлами
    // Аргумент №2 - CallBack, который вызывается после считывания
    // Аргумент №1 CallBack-функции - индекс ошибки
    // Аргумент №2 CallBack-функции - массив с названиями файлов
    fs.readdir(path.dist.fonts, (err, fontsFiles) => {
        // Если в процессе считывания произошла ошибка, то выводим соответствующее сообщение:
        if (err) {
            console.log("Шрифты не были подключены. " + err);
        // Если в процессе считывания не произошло ошибок, то:
        } else {
            // Если папка со шрифтами не пустая, то:
            if (fontsFiles) {
                // Если файл со стилями, где подключаются шрифты не существует, то:
                if (!fs.existsSync(fontsFile)) {
                    // Создаём файл со шрифтами, где подключаются шрифты:
                    fs.writeFile(fontsFile, "", err => {
                        // Если в процессе создания файла произошла ошибка, то выводим соответствующее сообщение: 
                        if (err) {
                            console.log("Шрифты не были подключены. " + err);
                        // Если в процессе создания не произошло ошибок, то:
                        } else {
                            // Название шрифта на предыдущем цикле итерации:
                            let newFileOnly;
                            // Выполняем цикл "количество файлов со шрифтами" раз:
                            for (let i = 0; i < fontsFiles.length; i++) {
                                // Определяем название текущего файла без расширения:
                                let fontFileName = fontsFiles[i].split(".")[0];
                                // Каждый файл шрифта имеет пару с аналогичным названием, но другим расширением.
                                // Так как файла 2, а подключение должно быть одно, вывполним проверку:
                                if (newFileOnly !== fontFileName) {
                                    // Определяем абсолютное название шрифта:
                                    let fontName = fontFileName.split("-")[0] ? fontFileName.split("-")[0] : fontFileName;
                                    // Определяем начертание шрифта:
                                    let fontWeight = fontFileName.split("-")[1] ? fontFileName.split("-")[1] : fontFileName;
                                    // Преобразуем строковое начертание шрифта в цифровое:
                                    if (fontWeight.toLowerCase() == "thin") {
                                        fontWeight = 100;
                                    } else if (fontWeight.toLowerCase() == "extralight") {
                                        fontWeight = 200;
                                    } else if (fontWeight.toLowerCase() == "light") {
                                        fontWeight = 300;
                                    }  else if (fontWeight.toLowerCase() == "medium") {
                                        fontWeight = 500;
                                    } else if (fontWeight.toLowerCase() == "semibold") {
                                        fontWeight = 600;
                                    } else if (fontWeight.toLowerCase() == "bold") {
                                        fontWeight = 700;
                                    } else if (fontWeight.toLowerCase() == "extrabold") {
                                        fontWeight = 800;
                                    } else if (fontWeight.toLowerCase() == "black") {
                                        fontWeight = 900;
                                    // Если начертание шрифта определить не удалось, устанавливаем 400
                                    } else {
                                        fontWeight = 400;
                                    }
                                    // Формируем текст подключения шрифтов:
                                    fs.appendFile(fontsFile, `@font-face\n\tfont-family: ${fontName}\n\tfont-display: swap\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff")\n\tfont-weight: ${fontWeight}\n\tfont-style: normal\n\r\n`, err => {
                                        // Если в процессе подключения шрифтов возникла ошибка, то выводим соответствующее сообщение
                                        if (err) {
                                            console.log("Шрифты не были подключены. " + err);
                                        // Если ошибок при подключении не произошло, то
                                        } else {
                                            // Обноввляем название шрифта на предыдущей итерации:
                                            newFileOnly = fontFileName; 
                                        }
                                    });    
                                }
                            }
                        }
                    });
                // Если файл со стилями, где подключаются шрифты существует, то:
                } else {
                    console.log("Шрифты не были подключены. Файл с подключением шрифтов уже существует");
                }
            // Если шрифты в папке отсутствуют, то выводим соответствующее сообщение:
            } else {
                console.log("Шрифты не были подключены. Папка со шрифтами пустая.");
            }
        }
    });
    cb();
};