import {observable, autorun} from 'mobx';
class AppState {
    @observable init = false;
    @observable userInit = false;
    constructor() {
        autorun(() => {
            if (this.userInit) {
                this.init = true;
            }
        });
    }
}
export default new AppState();
