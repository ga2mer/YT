import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Navigator,
    ToolbarAndroid
} from 'react-native';
export default class EmptyScreen extends Component {
    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <Text>Пусто тут</Text>
            </View>
        );
    }
}
