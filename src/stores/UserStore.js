import {observable} from 'mobx';
import {AsyncStorage} from 'react-native';
import appState from './AppState';
class UserStore {
    @observable isAuth = false;
    SID = null;
    SSID = null;
    constructor() {
        this.loadUserData();
    }
    loadUserData = async() => {
        this.SID = await AsyncStorage.getItem('SID');
        this.SSID = await AsyncStorage.getItem('SSID');
        if (this.SID && this.SID.length > 0 && this.SSID && this.SSID.length > 0) {
            this.isAuth = true;
        }
        appState.userInit = true;
    }
}
export default new UserStore();
