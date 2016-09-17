import React, {Component} from 'react';
import {observer, Provider} from 'mobx-react/native';
import {Text, View} from 'react-native';
@observer
export default class ToolbarTitle extends Component {
    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'white'
                }}>{this.props.store.title}</Text>
            </View>
        );
    }
}
