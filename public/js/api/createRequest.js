const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let requestUrl = options.url;
    let requestData = null; 
    if (options.data) {
        if (options.method === 'GET') {
            const params = new URLSearchParams(options.data).toString();
            requestUrl += '?' + params;
        } else {
            requestData = new FormData();
            Object.entries(options.data).forEach(([key, value]) => requestData.append(key, value));
        }
    }
    xhr.open(options.method, requestUrl);
    xhr.onload = () => {
        options.callback?.(null, xhr.response);
    };
    xhr.onerror = () => {
        options.callback?.(new Error('Ошибка сети'), null);
    };
    xhr.send(requestData);
};