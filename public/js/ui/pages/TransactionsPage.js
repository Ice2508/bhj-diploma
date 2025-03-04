/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
            if (!element) {
                throw new Error('Передан пустой элемент в TransactionsPage');
            }
            this.element = element;
            this.registerEvents();
        }
        /**
         * Вызывает метод render для отрисовки страницы
         * */
    update() {
            if (!this.lastOptions || !this.lastOptions.account_id) {
                return;
            }
            this.render(this.lastOptions);
        }
        /**
         * Отслеживает нажатие на кнопку удаления транзакции
         * и удаления самого счёта. Внутри обработчика пользуйтесь
         * методами TransactionsPage.removeTransaction и
         * TransactionsPage.removeAccount соответственно
         * */
    registerEvents() {
            const removeAccount = document.querySelector('.remove-account');
            const transactionRemove = document.querySelectorAll('.transaction__remove');
            removeAccount.addEventListener('click', () => {
                this.removeAccount();
            })
            if (transactionRemove.length > 0) {
                transactionRemove.forEach(btnRemove => {
                    btnRemove.addEventListener('click', () => {
                        const transactionId = btnRemove.dataset.id;
                        this.removeTransaction(transactionId);
                    });
                });
            }
        }
        /**
         * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
         * Если пользователь согласен удалить счёт, вызовите
         * Account.remove, а также TransactionsPage.clear с
         * пустыми данными для того, чтобы очистить страницу.
         * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
         * либо обновляйте только виджет со счетами и формы создания дохода и расхода
         * для обновления приложения
         * */
    removeAccount() {
            if (!this.lastOptions) {
                return;
            }
            const userConfirmedAcc = confirm('Вы действительно хотите удалить счет?');
            if (userConfirmedAcc) {
                Account.remove(this.lastOptions, (error, result) => {
                    this.clear();
                    App.updateWidgets();
                    App.updateForms();
                });
            }
        }
        /**
         * Удаляет транзакцию (доход или расход). Требует
         * подтверждеия действия (с помощью confirm()).
         * По удалению транзакции вызовите метод App.update(),
         * либо обновляйте текущую страницу (метод update) и виджет со счетами
         * */
    removeTransaction(id) {
            const userConfirmedTrans = confirm('Вы действительно хотите удалить эту транзакцию?');
            if (userConfirmedTrans) {
                Transaction.remove(id, () => {
                    App.update();
                });
            }
        }
        /**
         * С помощью Account.get() получает название счёта и отображает
         * его через TransactionsPage.renderTitle.
         * Получает список Transaction.list и полученные данные передаёт
         * в TransactionsPage.renderTransactions()
         * */
    render(options) {
            if (!options || !options.account_id) {
                console.log('Ошибка: отсутствуют данные для рендера или account_id');
                return;
            }
            this.lastOptions = options;
            Account.get(options.account_id, (error, account) => {
                if (error) {
                    console.log('Ошибка при получении данных о счете:', error);
                    return;
                }
                this.renderTitle(account.data.name);
                Transaction.list(options.account_id, (error, transactions) => {
                    if (error) {
                        console.log('Ошибка при получении транзакций:', error);
                        return;
                    }
                    this.renderTransactions(transactions);
                });
            });
        }
        /**
         * Очищает страницу. Вызывает
         * TransactionsPage.renderTransactions() с пустым массивом.
         * Устанавливает заголовок: «Название счёта»
         * */
    clear() {
            this.renderTransactions([]);
            this.renderTitle('Название счёта');
        }
        /**
         * Устанавливает заголовок в элемент .content-title
         * */
    renderTitle(name) {
            document.querySelector('.content-title').textContent = name;
        }
        /**
         * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
         * в формат «10 марта 2019 г. в 03:20»
         * */
    formatDate(date) {
            const d = new Date(date);
            const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()} г. в ` + `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
        /**
         * Формирует HTML-код транзакции (дохода или расхода).
         * item - объект с информацией о транзакции
         * */
    getTransactionHTML(item) {
            const formattedDate = this.formatDate(item.created_at);
            const transactionTypeClass = item.type === 'income' ? 'transaction_income' : 'transaction_expense';
            const transactionIcon = item.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down';
            const transactionTitle = item.name || 'Без названия';
            return `
      <div class="transaction ${transactionTypeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa ${transactionIcon} fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${transactionTitle}</h4>
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `;
        }
        /**
         * Отрисовывает список транзакций на странице
         * используя getTransactionHTML
         * */
    renderTransactions(data) {
        const contentElement = document.querySelector('.content');
        if (data.data.length === 0) {
            contentElement.innerHTML = '<p>Нет транзакций</p>';
            return;
        }
        const transactionsHTML = data.data.map(transaction => this.getTransactionHTML(transaction)).join('');
        contentElement.innerHTML = transactionsHTML;
    }
}