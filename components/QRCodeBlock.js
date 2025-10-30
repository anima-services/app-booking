import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from './ThemeContext';
import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useSelector } from 'react-redux';

const buildDeepLink = (spaceId, reservationId, domain) => {
    if (!spaceId) return null;
    const base = 'anima-mobile://actions';
    const params = new URLSearchParams();
    params.append('spaceId', String(spaceId));
    if (reservationId != null && reservationId !== undefined && reservationId !== '') {
        params.append('reservationId', String(reservationId));
    }
    if (domain != null && domain !== undefined && domain !== '') {
        params.append('domain', String(domain));
    }
    return `${base}?${params.toString()}`;
};

const QRCodeBlock = ({ spaceId, reservationId, style }) => {
    const { theme } = useTheme();
    const sizes = useResponsiveSizes();
    const window = useWindowDimensions();
    const domain = useSelector(state => state?.data?.hostname_main);

    const value = buildDeepLink(spaceId, reservationId, domain);
    if (!value) return null;

    const baseSide = Math.min(Number(window?.width) || 0, Number(window?.height) || 0);
    let qrSize = Math.round(baseSide * 0.15);
    if (!Number.isFinite(qrSize) || qrSize <= 0) {
        qrSize = 160;
    }

    return (
        <View style={[{ alignItems: 'center' }, style]}>
            <QRCode
                value={value}
                size={qrSize}
                backgroundColor={theme.container}
                color={theme.light}
            />
        </View>
    );
};

export default QRCodeBlock;


