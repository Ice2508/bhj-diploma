/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let requestUrl = options.url;
    if (options.method === 'GET' && options.data) {
        const params = new URLSearchParams(options.data).toString();
        requestUrl += '?' + params;
    }
    xhr.open(options.method, requestUrl);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            options.callback(null, xhr.response);
        } else {
            options.callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`), null);
        }
    };
    xhr.onerror = function() {
        options.callback(new Error('Ошибка сети'), null);
    };
    if (options.method !== 'GET' && options.data) {
        const formData = new FormData();
        Object.entries(options.data).forEach(([key, value]) => formData.append(key, value));
        xhr.send(formData);
    } else {
        xhr.send();
    }
};
