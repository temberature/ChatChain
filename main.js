// ==UserScript==
// @name         ChatChain Translation
// @namespace    ChatChain
// @version      1.0
// @description  Translate input to English on ChatChain with Google Translate
// @author       OpenAI + Translation API by xinjie
// @match        https://chat.openai.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    let monitorReply2TranslateBack = false, monitorReply2quest = false;
    let form, submitButton, inputField;
    interceptSubmitBtn();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                console.log(mutation.addedNodes)
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE && ((addedNode.classList.contains('overflow-hidden') && addedNode.classList.contains('w-full') && addedNode.classList.contains('h-full') && addedNode.classList.contains('relative')) || addedNode.classList.contains('px-2') &&
                        addedNode.classList.contains('py-10') &&
                        addedNode.classList.contains('relative') &&
                        addedNode.classList.contains('w-full') &&
                        addedNode.classList.contains('flex') &&
                        addedNode.classList.contains('flex-col') &&
                        addedNode.classList.contains('h-full'))  ) {


                        interceptSubmitBtn();

                    }

                });

                mutation.removedNodes.forEach(removedNode => {
                    if (removedNode.nodeType === Node.ELEMENT_NODE && removedNode.classList.contains('btn') && removedNode.classList.contains('flex') && removedNode.classList.contains('justify-center') && removedNode.classList.contains('gap-2') && removedNode.classList.contains('btn-neutral') && removedNode.classList.contains('border-0') && removedNode.classList.contains('md:border') && removedNode.textContent.includes('Stop generating')) {
                        const proseElements = document.querySelectorAll('.prose');
                        const lastProseElement = proseElements[proseElements.length - 1];
                        const form = document.querySelector('form.stretch');
                        const submitButton = form.querySelector('div div:nth-child(2) > button');
                        const inputField = form.querySelector('div:nth-child(2) textarea');
                        if (monitorReply2quest) {
                            quest(lastProseElement.textContent);

                        } else if(monitorReply2TranslateBack) {
                            translateBack(lastProseElement.textContent);
                        }
                    }
                })
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // 定义翻译函数，用于翻译给定的文本
    const translateText = async (text) => {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + encodeURI(text);
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0];
    };

    function interceptSubmitBtn() {
        form = document.querySelector('form.stretch');
        submitButton = form.querySelector('div div:nth-child(2) > button');
        inputField = form.querySelector('div:nth-child(2) textarea');
        // 拦截表单提交事件，翻译输入内容并替换输入框中的内容
        if(!submitButton || !inputField) {
            return;
        }
        submitButton.addEventListener('click', async (event) => {
            const stage = submitButton.getAttribute('data-stage')
            if(stage && stage != 0) {
                return;
            }
            event.preventDefault();
            if (!stage) {
                batch();
            }

        });

        inputField.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
                if (!+submitButton.getAttribute('data-translating')) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                } else {
                    return;
                }
                await translate();
            }
        });
        inputField.addEventListener("keyup", async function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
        inputField.addEventListener("keypress", async function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });


    }
    function batch() {
        if (!monitorReply2quest && !monitorReply2TranslateBack) {
            translate();
        }

    }

    function translate() {
        submitButton.setAttribute('data-stage', 'translating');

        const inputText = inputField.value.trim();
        if (inputText.length === 0) {
            return;
        }
        // inputField.value = "翻译中ing";
        // const translatedText = await translateText(inputText);
        inputField.value = '翻译成英文，只返回英文： "' + inputText + '"';

        submitButton.click();

        monitorReply2quest = true;
    }

    function quest(reply) {
        submitButton.setAttribute('data-stage', 'questing');

        if (reply.length === 0) {
            return;
        }

        inputField.value = 'answer using English, as specific as possible： "' + reply + '"';

        submitButton.click();
        monitorReply2quest = false;
        monitorReply2TranslateBack = true;
    }
    function translateBack(reply) {
        submitButton.setAttribute('data-stage', 'translateBacking');
        inputField.value = '翻译成中文，只返回中文： "' + reply + '"';
        submitButton.click();
        monitorReply2TranslateBack = false;
        submitButton.setAttribute('data-stage', 0);
    }

})();
