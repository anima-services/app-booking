import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const busyColor = '#FF2400';
const freeColor = '#03c03c';
const busyAlphaColor = '#FF240030';
const freeAlphaColor = '#03c03c30';
const primaryColor = '#5EBDC0';
const containerColor = '#F2F2F7';

export const Styles = StyleSheet.create({
    fill: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    container: {
        padding: windowWidth * .01,
        borderRadius: windowWidth * .02,
        overflow: 'hidden',
        borderWidth: windowWidth * .01,
        borderColor: '#00000000',
    },
    busy: {
        backgroundColor: busyAlphaColor,
    },
    free: {
        backgroundColor: freeAlphaColor,
    },

    /* Цвета и прочее */
    primaryGradient: {
        colors: ['#139EA3', '#5EBDC0'],
        disabledColors: [containerColor, containerColor],
        grayColors: ['#ffffff', '#ffffff'],
        start: { x: 1, y: 0 },
        end: { x: 0, y: 0 },
    },
    darkGradient: {
        colors: ['#ffffff00', '#000000C8'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    /* Скелет */
    bg: {
        backgroundColor: '#000000',
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderStyle: 'solid',
    },
    main: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderStyle: 'solid',
        borderWidth: windowHeight * .04,
        //borderRadius: windowHeight * .05,
        busy: {
            borderColor: busyColor
        },
        free: {
            borderColor: freeColor
        },
    },

    /* Компоненты */
    title: {
        marginTop: windowHeight * .1,
    },
    menu: {
        flex: 1,
        margin: windowHeight * .05,
    },
    table: {
        flex: 1,
        backgroundColor: containerColor,
        //borderRadius: windowHeight * .025,
    },
    allignBottom: {
        position: 'absolute',
        bottom: 0,
    },
    horizontalRow: {
        flexDirection: 'row',
        container: {
            marginRight: windowWidth * .01,
            marginVertical: 0,
        }
    },
    button_primary: {
        backgroundColor: primaryColor,
        borderRadius: windowWidth * .015,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: windowWidth * .015,
        marginVertical: windowWidth * .01,
    },
    logo: {
        width: windowHeight * .1,
        height: windowHeight * .04,
        objectFit: 'contain'
    },
    currentDate: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    scrollTable: {
        paddingHorizontal: windowHeight * .05,
    },
    tableEvent: {
        backgroundColor: 'white',
        paddingHorizontal: windowHeight * .025,
        marginVertical: windowHeight * .005,
        borderRadius: windowHeight * .025,
        status: {
            position: 'absolute',
            right: windowHeight * .02,
            top: windowHeight * .01,
            height: windowHeight * .03,
            width: windowHeight * .03,
        },
        busy: {
            backgroundColor: primaryColor,
        }
    },
    tablePlaceHolder: {
        flex: 1,
        margin: windowWidth * .05,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tablePlaceHolderLogo: {
        width: windowHeight * .05,
        height: windowHeight * .05,
        color: primaryColor
    },
    hr: {
        borderBottomColor: containerColor,
        borderBottomWidth: 2,
    },
    inputField: {
        backgroundColor: containerColor,
        borderRadius: windowHeight * .02,
        marginRight: windowHeight * .01,
        paddingHorizontal: windowHeight * .01,
        paddingVertical: windowHeight * .005,
        fontFamily: 'Montserrat_400Regular',
        fontSize: windowHeight * .025,
        color: 'gray',
        text: {
            marginVertical: windowHeight * .01,
            paddingHorizontal: windowHeight * .01,
            paddingVertical: windowHeight * .015,
        },
        selected: {
            borderWidth: 1,
            backgroundColor: containerColor,
            borderRadius: windowHeight * .02,
            marginRight: windowHeight * .01,
            paddingHorizontal: windowHeight * .01,
            paddingVertical: windowHeight * .005,
            fontFamily: 'Montserrat_400Regular',
            fontSize: windowHeight * .025,
            color: 'gray',
        },
    },
    inputField_inv: {
        backgroundColor: 'white',
        borderRadius: windowHeight * .02,
        paddingHorizontal: windowHeight * .01,
        paddingVertical: windowHeight * .005,
        fontFamily: 'Montserrat_400Regular',
        fontSize: windowHeight * .025,
        color: 'gray',
        text: {
            marginVertical: windowHeight * .01,
            paddingHorizontal: windowHeight * .01,
            paddingVertical: windowHeight * .015,
        },
        selected: {
            borderWidth: 1,
            backgroundColor: containerColor,
            borderRadius: windowHeight * .02,
            paddingHorizontal: windowHeight * .01,
            paddingVertical: windowHeight * .005,
            fontFamily: 'Montserrat_400Regular',
            fontSize: windowHeight * .025,
            color: 'gray',
        },
    },
    userPhoto: {
        width: windowHeight * .08,
        height: windowHeight * .08,
        borderRadius: windowHeight * .08 / 2,
        marginVertical: windowHeight * .01,
        marginRight: windowHeight * .01,
        backgroundColor: containerColor,
        overflow: "hidden",
    },
    notification: {
        show: {
            display: 'block'
        },
        hide: {
            display: 'none'
        },
        position: 'absolute',
        top: windowHeight * .03,
        left: windowHeight * .03,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: containerColor,
        borderRadius: windowHeight * .02,
        paddingHorizontal: windowHeight * .01,
        paddingVertical: windowHeight * .005,
    },
    pincode: {
        main: {
            backgroundColor: 'white',
            justifyContent: 'start',
            padding: windowHeight * .02,
        },
        enter: {
            header: { justifyContent: 'flex-start', alignItems: 'center', minHeight: 0 },
            title: {
                color: 'black',
                fontFamily: 'Montserrat_700Bold',
                fontSize: windowHeight * .03,
            },
            subTitle: { display: 'none' },
            errorText: { display: 'none' },
            buttonTextDisabled: { color: 'gray' },
            button: {
                borderRadius: windowHeight * .02,
                width: windowHeight * .08,
                height: windowHeight * .08,
                backgroundColor: containerColor,
                marginHorizontal: windowHeight * .005,
            },
            buttonRow: {
                marginVertical: windowHeight * .005,
            },
            buttonText: {
                fontFamily: 'Montserrat_700Bold',
                fontSize: windowHeight * .03,
            },
            pinContainer: {
                height: windowHeight * .04,
            },
            pin: {
                backgroundColor: primaryColor,
            },
            footer: {
                display: 'none'
            },
        },
    },
    icon: {
        height: windowHeight * .04,
        width: windowHeight * .04,
    },
    smallIcon: {
        height: windowHeight * .02,
        width: windowHeight * .02,
    },

    /* Текста */
    text_h1: {
        fontFamily: 'Montserrat_900Black',
        fontSize: windowHeight * .06,
        marginTop: windowHeight * .03,
        textTransform: "uppercase",
    },
    busyColor: {
        color: busyColor
    },
    freeColor: {
        color: freeColor
    },
    text_h2: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: windowHeight * .03,
        marginTop: windowHeight * .015,
        marginBottom: windowHeight * .015,
    },
    text_regular: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: windowHeight * .025,
        marginTop: windowHeight * .01,
        marginBottom: windowHeight * .01,
        color: 'black'
    },
    text_regularLC: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: windowHeight * .025,
        marginTop: windowHeight * .01,
        marginBottom: windowHeight * .01,
        color: 'gray'
    },
});