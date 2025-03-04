/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
            super(element)
            this.renderAccountsList();
        }
        /**
         * Получает список счетов с помощью Account.list
         * Обновляет в форме всплывающего окна выпадающий список
         * */
    renderAccountsList() {
            Account.list({}, (err, response) => {
                const selects = document.querySelectorAll('.form-control');
                selects.forEach(select => {
                    if (response.data) {
                        select.innerHTML = response.data.map(account => `<option value="${account.id}">${account.name}</option>`).join("");
                    }
                });
            })
        }
        /**
         * Создаёт новую транзакцию (доход или расход)
         * с помощью Transaction.create. По успешному результату
         * вызывает App.update(), сбрасывает форму и закрывает окно,
         * в котором находится форма
         * */
    onSubmit(data) {
        Transaction.create(data, (err, response) => {
            if (!err) {
                this.element.reset();
                App.update();
                if (this.element.id === 'new-income-form') {
                    App.getModal('newIncome').close();
                } else {
                    App.getModal('newExpense').close();
                }
            }
        });
    }
}