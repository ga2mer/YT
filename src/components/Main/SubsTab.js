import React, {Component} from 'react';
import {
    Text,
    ToastAndroid,
    TouchableNativeFeedback,
    Image,
    View,
    ScrollView,
    ListView,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import mainStore from '../../stores/MainStore';
import videoStore from '../../stores/VideoStore';
import {observer} from 'mobx-react/native';
@observer
export default class SubsTab extends Component {
    handleShowVideo(id) {
        videoStore.setVideo(id);
    }
    renderRow = (rowData) => {
        return (
            <TouchableNativeFeedback onPress={() => this.handleShowVideo(rowData.id)}>
                <View style={{
                    flexDirection: 'column',
                    padding: 15
                }}>
                    <Image style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        resizeMode: 'stretch',
                        height: 200
                    }} source={{
                        uri: rowData.thumbnail
                    }}>
                        <Text style={{
                            color: 'white',
                            paddingTop: 2,
                            paddingLeft: 4,
                            paddingRight: 4,
                            paddingBottom: 2,
                            margin: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            alignSelf: 'flex-end'
                        }}>{rowData.length}</Text>
                    </Image>
                    <View style={{
                        paddingTop: 5,
                        flexDirection: 'row'
                    }}>
                        <Image style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50
                        }} source={{
                            uri: rowData.author.avatar
                        }}/>
                        <View style={{
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>
                            <Text numberOfLines={1} style={{
                                color: '#000'
                            }}>{rowData.title}</Text>
                            <Text>{rowData.author.name}</Text>
                            <Text>{rowData.views}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (<View key={`${sectionID}-${rowID}`} style={{
            height: adjacentRowHighlighted
                ? 4
                : 1,
            backgroundColor: adjacentRowHighlighted
                ? '#3B5998'
                : '#CCCCCC'
        }}/>);
    }
    renderProgressBar() {
        if (mainStore.endReachedSubs) {
            return false;
        }
        return (<ActivityIndicator animating style={styles.progressBar} size="large"/>);
    }
    render() {
        var refreshControl = <RefreshControl refreshing={mainStore.subsRefresh} onRefresh={() => mainStore.loadData('subscriptions', 2, true)}/>
        return (
            <View style={{
                flex: 1
            }}>
                <ListView refreshControl={refreshControl} onEndReached={mainStore.handleEndReachedSubs} scrollRenderAheadDistance={1000} renderFooter={this.renderProgressBar} renderSeparator={this.renderSeparator} enableEmptySections initialListSize={1} dataSource={mainStore.subsList} renderRow={this.renderRow}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        padding: 10
    }
});
