const sidebarToggle = document.querySelector('.sidebar-toggle');
/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
    /**
     * Запускает initAuthLinks и initToggleButton
     * */
    static init() {
            this.initAuthLinks();
            this.initToggleButton();
        }
        /**
         * Отвечает за скрытие/показа боковой колонки:
         * переключает два класса для body: sidebar-open и sidebar-collapse
         * при нажатии на кнопку .sidebar-toggle
         * */
    static initToggleButton() {
            sidebarToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
                document.body.classList.toggle('sidebar-collapse');
            })
        }
        /**
         * При нажатии на кнопку входа, показывает окно входа
         * (через найденное в App.getModal)
         * При нажатии на кнопку регастрации показывает окно регистрации
         * При нажатии на кнопку выхода вызывает User.logout и по успешному
         * выходу устанавливает App.setState( 'init' )
         * */
    static initAuthLinks() {
        const menuItem = document.querySelectorAll('.menu-item a');
        menuItem.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const modalIdentifier = item.closest('.menu-item').classList[1].split('_').pop();
                if (modalIdentifier === 'logout') {
                    User.logout((err, response) => {
                        if (response.success) {
                            App.setState('init');
                        }
                    });
                }
                const modalReg = App.getModal(modalIdentifier);
                if (modalReg) {
                    modalReg.open();
                }
            });
        })
    }
}