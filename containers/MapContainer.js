import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

var XMLParser = require('react-xml-parser');

import { useSelector } from 'react-redux';

export default function MapContainer(props) {
    const data = useSelector((state) => state.appData.data);
    const [map, updateMap] = useState("");

    const handleClick = (elementId) => {
        props.select(elementId);
    };

    const handleMessage = (event) => {
        const message = JSON.parse(event.nativeEvent ? event.nativeEvent.data : event.data);
        switch (message.action) {
            case "handleClick":
                handleClick(message.elementId);
                break;
        }
    };

    useEffect(() => {
        try {
            if (!data.mapData) throw "mapData не существует в запросе";
            if (!data.mapData.svg_content) throw "mapData.svg_content не существует в запросе";
            if (!data.mapData.map_objects) throw "mapData.map_objects не существует в запросе";

            let _map = data.mapData.svg_content;
            let _mapObjs = data.mapData.map_objects;
            let _madIds = _mapObjs.map((item) => item.path_id);


            let xml = new XMLParser().parseFromString(_map);

            xml.attributes.style = "display:block;margin:auto;";
            xml.attributes.width = "100%";
            xml.attributes.height = "100%";

            if (xml.children)
                parseChildren(xml.children);

            function parseChildren(in_array) {
                for (let i = 0; i < in_array.length; i++) {
                    if (in_array[i].children)
                        parseChildren(in_array[i].children);
                    let onMap = _madIds.indexOf(in_array[i].attributes.id);
                    if (onMap > -1)
                        applyAttributes(in_array[i], _mapObjs[onMap]);
                }
            }

            function applyAttributes(in_item, in_object) {
                if (in_object.space_link_info === null) return;
                in_item.attributes.onclick = "handleClick(" + in_object.space_link_info.id + ")";
                in_item.attributes.style = in_object.space_link_info.is_reserved_now ? "fill:#EA6060" : "fill:#5fad00";
            }

            let string = new XMLParser().toString(xml);
            string = string.replace('</svg>', `
                <script>
                    function handleClick(elementId) {
                        console.log('JavaScript is enabled');
                        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'handleClick', elementId }));
                        console.log("pressed!");
                    }
                </script>
              </svg>`);

            if (Platform.OS === "web") {
                window.handleClick = function (elementId) {
                    window.postMessage(JSON.stringify({ action: 'handleClick', elementId }), '*');
                };
            }

            updateMap(string);
        } catch (e) {
            console.log("Ошибка в отрисовке svg карты: " + e);
        }
    }, [data.mapData]);

    useEffect(() => {
        if (Platform.OS === "web") {
            window.addEventListener('message', handleMessage);
            return () => { window.removeEventListener('message', handleMessage); };
        }
    }, []);

    return (
        Platform.OS === "web" ?
            <ReactNativeZoomableView
                maxZoom={2}
                minZoom={1}
                zoomStep={1}
                initialZoom={1}
                bindToBorders={true}
                disablePanOnInitialZoom={true}
            >
                <div style={{ margin: "auto", width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: map }} />
            </ReactNativeZoomableView >
            :
            <View style={styles.contents}>
                <WebView
                    // source={{ uri: 'https://app.animaspace.online' }}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    source={{ html: map }}
                    onMessage={handleMessage}
                    pointerEvents="auto"
                />
            </View>
    );
}


const styles = StyleSheet.create({
    contents: {
        flex: 1,
        alignSelf: 'stretch',
    },
});
