/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
    onSubmit(data) {
        User.register(data, (err, response) => {
            if (response && response.success) {
                this.element.reset();
                App.setState('user-logged');
                App.getModal('register').close();
            }
        });
    }
}