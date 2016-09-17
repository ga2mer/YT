import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import userStore from '../../stores/UserStore';
import {MKButton} from 'react-native-material-kit';
import {observer, inject} from 'mobx-react/native';
//@inject('navigator')
@observer(['channelStore'])
export default class AboutTab extends Component {
    render() {
        const {channelStore: {
                about
            }} = this.props;
        return (
            <View>
                <Text>{about.description}</Text>
            </View>
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
