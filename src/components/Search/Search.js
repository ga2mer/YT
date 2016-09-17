import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    Navigator,
    ActivityIndicator,
    ListView,
    Image,
    TouchableNativeFeedback
} from 'react-native';
import videoStore from '../../stores/VideoStore';
import {observer, inject} from 'mobx-react/native';
import ChannelStore from '../../stores/ChannelStore';
@inject('navigator')
@observer
export default class Search extends Component {
    handleShowVideo(id) {
        videoStore.setVideo(id);
    }
    handleOpenChannel = (username) => {
        this.props.navigator.push({
            name: 'channel',
            passProps: {
                store: new ChannelStore(username)
            }
        });
    }
    renderRow = (rowData) => {
        if (rowData.type == 'channel') {
            return (
                <TouchableNativeFeedback onPress={() => this.handleOpenChannel(rowData.username)}>
                    <View style={{
                        margin: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image style={{
                            width: 64,
                            height: 64,
                            borderRadius: 50
                        }} source={{
                            uri: rowData.avatar
                        }}/>
                        <View style={{
                            paddingLeft: 8
                        }}>
                            <Text style={{
                                color: 'black'
                            }}>{rowData.title}</Text>
                            <Text>{rowData.count_videos}</Text>
                            <Text>{rowData.count_subs}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            );
        } else if (rowData.type == 'video') {
            return (
                <TouchableNativeFeedback onPress={() => this.handleShowVideo(rowData.id)}>
                    <View style={{
                        margin: 4,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image style={{
                            width: 120,
                            height: 68
                        }} source={{
                            uri: rowData.thumbnail
                        }}/>
                        <View style={{
                            paddingLeft: 8
                        }}>

                            <View style={{
                                flex: 1,
                                width: 200
                            }}>
                                <Text style={{
                                    color: 'black'
                                }} numberOfLines={2}>{rowData.title}</Text>
                            </View>
                            <Text>{rowData.author}</Text>
                            <Text>{rowData.count_views}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            );
        } else if (rowData.type == 'playlist') {
            return (
                <View>
                    <Text>Пока без плейлистов</Text>
                </View>
            );
        } else if (rowData.type == 'message') {
            return (
                <View>
                    <Text>{rowData.text}</Text>
                </View>
            );
        }
        return (
            <View>
                <Text>Какая-то неподдерживаемая штуковина</Text>
            </View>
        )
    }
    renderProgressBar = () => {
        if (this.props.searchStore.endReached) {
            return false;
        }
        return (<ActivityIndicator animating style={styles.progressBar} size="large"/>);
    }
    render() {
        const {searchStore} = this.props;
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                {searchStore.list && <ListView keyboardShouldPersistTaps removeClippedSubviews={false} onEndReached={searchStore.handleEnd} scrollRenderAheadDistance={1000} renderFooter={this.renderProgressBar} enableEmptySections initialListSize={1} dataSource={searchStore.list} renderRow={this.renderRow}/>}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    progressBar: {
        padding: 10
    }
});
