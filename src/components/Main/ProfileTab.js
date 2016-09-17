import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import userStore from '../../stores/UserStore';
import {MKButton} from 'react-native-material-kit';
import {observer, inject} from 'mobx-react/native';
@inject('navigator')
@observer
export default class ProfileTab extends Component {
    componentDidMount() {
        /*CookieManager.get('http://m.youtube.com/signin', (err, res) => {
            console.log('Got cookies for url', res);
            // Outputs 'user_session=abcdefg; path=/;'
        })*/
    }
    handlePressAuth = () => {
        this.props.navigator.push({name: 'auth'});
    }
    render() {
        if (!userStore.isAuth) {
            const ColoredRaisedButton = MKButton.coloredButton().withBackgroundColor('#167ac6').withText('Sign in').withTextStyle({color: 'white', fontWeight: 'bold', marginLeft: 10, marginRight: 10}).withOnPress(this.handlePressAuth).build();
            return (
                <View style={styles.notAuth}>
                    <Text style={{
                        fontSize: 22,
                        color: '#222'
                    }}>You're not signed in</Text>
                    <Text color={'#767676'}>Sign in now to upload, save, and comment on videos.</Text>
                    <View paddingTop={10}><ColoredRaisedButton/></View>
                </View>
            );
        }
        return (
            <View></View>
        )
    }
}
const styles = StyleSheet.create({
    notAuth: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressBar: {
        padding: 10
    }
});
