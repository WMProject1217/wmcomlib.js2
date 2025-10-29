/*
* Copyright(c) A.K.A wmcomlib.js JavaScript Function Library v2
* WMProject1217 Studios 2025
* FileName: PageTemplateEngine.js
* FileVersion: 0.1.1
* FileDescription: 页面模板引擎
* Author: WMProject1217
* LatestCommit: 2025-10-12
*
* FOR THE DAWN THAT SHALL ARRIVE!
*/

export const id = 'PageTemplateEngine';
export const name = 'PageTemplateEngine';
export const namext = '页面模板引擎';
export const version = '0.1.1';
export const author = 'WMProject1217';
export const description = 'Fill the template.';

let SystemContext;
let ErrorHandler;

export async function _init_(context) {
    SystemContext = context;
    SetErrorHandler();
}

export async function _unload_() {}

export function SetErrorHandler(handler = function(error) { return error.description; }) {
    ErrorHandler = handler;
}

export function WalkProcess(element) {
    let elements = element.querySelectorAll('*');
    
    let html = "";
    let expression = "";
    let result = "";
        
    for (const el of elements) {
        html = el.innerHTML.trim();
        if (html.startsWith('${') && html.endsWith('}')) {
            try {
                expression = html.slice(2, -1);
                result = Function(`"use strict"; return (${expression})`)();
                el.innerHTML = result;
            } catch (error) {
                console.error('无法执行模板 ' + html, error);
                el.innerHTML = ErrorHandler(error);
            }
        }
    }
}

export async function WalkProcessAsync(element) {
    let elements = element.querySelectorAll('*');
    
    let html = "";
    let expression = "";
    let result = "";
        
    for (const el of elements) {
        html = el.innerHTML.trim();
        if (html.startsWith('${') && html.endsWith('}')) {
            try {
                expression = html.slice(2, -1);
                result = await Function(`"use strict"; return (async () => { return ${expression} })()`)();
                el.innerHTML = result;
            } catch (error) {
                console.error('无法执行模板 ' + html, error);
                el.innerHTML = ErrorHandler(error);
            }
        }
    }
}
