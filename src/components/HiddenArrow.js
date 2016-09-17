import React, {Component} from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react/native';
@observer
export default class HiddenArrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true
        };
    }
    handleToggle = () => {
        this.setState({
            hidden: !this.state.hidden
        });
    }
    render() {
        return (
            <View>
                <TouchableNativeFeedback onPress={this.handleToggle}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View flex={0.8}>{this.props.title}</View>
                        <Icon name={this.state.hidden && 'keyboard-arrow-down' || 'keyboard-arrow-up'} size={30}/>
                    </View>
                </TouchableNativeFeedback>
                {this.props.under}
                {!this.state.hidden && this.props.children}
            </View>
        );
    }
}
