import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    Navigator,
    ActivityIndicator,
    Image,
    ListView,
    TouchableNativeFeedback
} from 'react-native';
import videoStore from '../../stores/VideoStore';
import {observer, inject} from 'mobx-react/native';
@observer(['channelStore'])
export default class VideosTab extends Component {
    handleShowVideo(id) {
        videoStore.setVideo(id);
    }
    renderRow = (rowData) => {
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
                        <Text>{rowData.views}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
    renderProgressBar = () => {
        if (this.props.channelStore.videos.endReached) {
            return false;
        }
        return (<ActivityIndicator animating style={styles.progressBar} size="large"/>);
    }
    render() {
        const {channelStore} = this.props;
        if (!channelStore.videos.list) {
            return false;
        }
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <ListView onEndReached={channelStore.handleEndVideos} scrollRenderAheadDistance={1000} renderFooter={this.renderProgressBar} enableEmptySections initialListSize={1} dataSource={channelStore.videos.list} renderRow={this.renderRow}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    progressBar: {
        padding: 10
    }
});
