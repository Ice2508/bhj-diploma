/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
    /**
     * Устанавливает текущего пользователя в
     * локальном хранилище.
     * */
    static URL = '/user';
    static setCurrent(user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        /**
         * Удаляет информацию об авторизованном
         * пользователе из локального хранилища.
         * */
    static unsetCurrent() {
            localStorage.removeItem('user');
        }
        /**
         * Возвращает текущего авторизованного пользователя
         * из локального хранилища
         * */
    static current() {
            const user = localStorage.getItem('user');
            return JSON.parse(user);
        }
        /**
         * Получает информацию о текущем
         * авторизованном пользователе.
         * */
       static fetch(callback) {
        createRequest({
            url: `${this.URL}/current`,
            method: 'GET',
            callback: (err, response) => {
                if (err) {
                    callback(err, null);
                } else if (response.success) {
                    this.setCurrent(response.user);
                    callback(null, response);
                } else {
                    this.unsetCurrent();
                    callback(null, response);
                }
            }
        });
    }
        /**
         * Производит попытку авторизации.
         * После успешной авторизации необходимо
         * сохранить пользователя через метод
         * User.setCurrent.
         * */
    static login(data, callback) {
            createRequest({
                url: this.URL + '/login',
                method: 'POST',
                responseType: 'json',
                data,
                callback: (err, response) => {
                    if (response && response.user) {
                        this.setCurrent(response.user);
                    }
                    callback(err, response);
                }
            });
        }
        /**
         * Производит попытку регистрации пользователя.
         * После успешной авторизации необходимо
         * сохранить пользователя через метод
         * User.setCurrent.
         * */
    static register(data, callback) {
            createRequest({
                url: `${this.URL}/register`,
                method: 'POST',
                data,
                callback: (err, response) => {
                    if (err) {
                callback(err, null);
            } else if (response.success) {
                this.setCurrent(response.user);
                callback(null, response);
            } else {
                callback(null, response);
            }
                }
            });
        }
        /**
         * Производит выход из приложения. После успешного
         * выхода необходимо вызвать метод User.unsetCurrent
         * */
    static logout(callback) {
        createRequest({
            url: `${this.URL}/logout`,
            method: 'POST',
            callback: (err, response) => {
                if (err) {
                    callback(err, null);
                } else if (response.success) {
                    this.unsetCurrent();
                    callback(null, response);
                } else {
                    callback(null, response);
                }
            }
        });
    }
}
