import React, {Component} from 'react';
import {Text, TextInput, View, SwitchAndroid, StyleSheet} from 'react-native';
import {observer} from 'mobx-react/native';
@observer
export default class SearchInput extends Component {

    render() {
        var {store} = this.props;
        return (
            <View style={{
                flex: 1,
            }}>
                <TextInput autoFocus={true} placeholder='Enter description of entry...' onChangeText={store.handleChange} onSubmitEditing={store.handleSubmit}/>
            </View>
        );
    }
}
