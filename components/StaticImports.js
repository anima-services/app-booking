/* Шрифты */

import {
    Onest_100Thin,
    Onest_200ExtraLight,
    Onest_300Light,
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
    Onest_800ExtraBold,
    Onest_900Black
} from '@expo-google-fonts/onest';

export const fontAssets = {
    Onest_100Thin,
    Onest_200ExtraLight,
    Onest_300Light,
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
    Onest_800ExtraBold,
    Onest_900Black
};



/* Иконки */

import { library } from '@fortawesome/fontawesome-svg-core';

import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons/faFlagCheckered';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons/faLockOpen';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons/faDeleteLeft';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons/faCalendarCheck';

library.add(faFlagCheckered, faBan, faLockOpen, faLock, faChevronRight, faChevronLeft, faCalendar, faClock, faDeleteLeft, faCalendarCheck);
