import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackAndroid,
    AsyncStorage,
    WebView
} from 'react-native';
import userStore from '../../stores/UserStore';
import {MKButton} from 'react-native-material-kit';
import cookie from 'cookie';
import {observer, inject} from 'mobx-react/native';
import CookieManager from 'react-native-cookies';
var SITE_URL = "https://m.youtube.com/signin";
@inject('navigator')
@observer
export default class Auth extends Component {
    state = {
        enableProgress: false
    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }
    handleBack = () => {
        this.props.navigator.pop();
        return true;
    }
    onNavigationStateChange = async(event) => {
        if (event.loading == false) {
            CookieManager.get(event.url, async(err, res) => {
                const {SID, SSID} = res;
                if (SID && SSID) {
                    this.setState({enableProgress: true});
                    await AsyncStorage.setItem('SID', SID);
                    await AsyncStorage.setItem('SSID', SSID);
                    userStore.isAuth = true;
                    userStore.SID = SID;
                    userStore.SSID = SSID;
                    this.props.navigator.replacePreviousAndPop({name: 'main'});
                }
            });
        }
    }
    render() {
        if (this.state.enableProgress) {
            return <View>
                <Text>Авторизируем</Text>
            </View>;
        }
        return (<WebView ref="webViewAndroidSample" javaScriptEnabled={true} onNavigationStateChange={this.onNavigationStateChange} geolocationEnabled={false} builtInZoomControls={false} source={{
            uri: SITE_URL
        }} style={styles.webView}/>)
    }
}
const styles = StyleSheet.create({
    webView: {
        flex: 1
    }
});
