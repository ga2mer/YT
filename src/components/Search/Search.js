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
    TouchableNativeFeedback,
    ScrollView
} from 'react-native';
import videoStore from '../../stores/VideoStore';
import {observer, inject} from 'mobx-react/native';
import ChannelStore from '../../stores/ChannelStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modalbox';
import Dropdown from 'react-native-dropdown-android';
import {MKButton} from 'react-native-material-kit';
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
                {searchStore.suggestions.length > 0 && searchStore.showSuggest && <Suggestions searchStore={searchStore}/>}
                {searchStore.filterOpened && <M searchStore={searchStore}/>}
            </View>
        );
    }
}
@observer
class M extends Component {
    state = {
        type: 0,
        time: 0
    }
    componentDidMount() {
        const {searchStore} = this.props;
        this.setState({type: searchStore.type, time: searchStore.time});
    }
    render() {
        const {searchStore} = this.props;
        const ApplyButton = MKButton.flatButton().withText('Apply').withOnPress(() => {
            searchStore.handleFilter(this.state.type, this.state.time);
        }).build();
        const CancelButton = MKButton.flatButton().withText('Cancel').withOnPress(() => {
            searchStore.handleCloseFilter();
        }).build();
        return (
            <Modal isOpen={searchStore.filterOpened} onClosed={searchStore.handleCloseFilter} style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 300,
                width: 300
            }} position={"center"}>
                <Text style={styles.text}>Тип контента:</Text>
                <Dropdown style={{
                    height: 20,
                    width: 200
                }} values={['Все', 'Каналы']} selected={this.state.type} onChange={(data) => {
                    this.setState({type: data.selected});
                }}/>
                <Text style={styles.text}>Время добавления:</Text>
                <Dropdown style={{
                    height: 20,
                    width: 200
                }} values={['За всё время', 'Сегодня', 'На этой неделе', 'В этом месяце']} selected={this.state.time} onChange={(data) => {
                    this.setState({time: data.selected});
                }}/>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <CancelButton/>
                    <ApplyButton/>
                </View>
            </Modal>
        );
    }
}
@observer
class Suggestions extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <ScrollView keyboardShouldPersistTaps style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'white'
            }}>
                {searchStore.suggestions.map((suggestion) => {
                    return (
                        <View key={suggestion} style={{
                            flex: 1,
                            padding: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableNativeFeedback onPress={() => searchStore.handleSearchSuggest(suggestion)}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon name={'search'} size={24}/>
                                    <Text style={{
                                        marginLeft: 24
                                    }}>{suggestion}</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => searchStore.handleSuggest(suggestion)}>
                                <View><Icon name={'add'} size={24}/></View>
                            </TouchableNativeFeedback>
                        </View>
                    );
                })}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    progressBar: {
        padding: 10
    }
});
