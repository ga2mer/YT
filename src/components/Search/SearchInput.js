import React, {Component} from 'react';
import {Text, TextInput, View, SwitchAndroid, StyleSheet} from 'react-native';
import {observer} from 'mobx-react/native';
@observer
export default class SearchInput extends Component {

    render() {
        var {store} = this.props;
        return (
            <View style={{
                flex: 1
            }}>
                <TextInput style={{
                    fontSize: 18
                }} autoFocus={true} blurOnSubmit={true} placeholder='Enter name of video or channel' underlineColorAndroid={'transparent'} onChangeText={store.handleChange} onSubmitEditing={store.handleSubmit}/>
            </View>
        );
    }
}
