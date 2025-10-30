// Полифиллы для сред без TextEncoder/TextDecoder (Hermes/Android)
try {
    // Если TextEncoder уже есть, ничего не делаем
    if (typeof global.TextEncoder === 'undefined' || typeof global.TextDecoder === 'undefined') {
        // fast-text-encoding добавляет TextEncoder/TextDecoder в глобальную область видимости при импорте
        require('fast-text-encoding');
    }
} catch (e) {
    // Безопасный no-op, если модуль не установлен
}


