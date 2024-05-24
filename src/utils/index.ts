export function debounce<T extends Function>(
    callback: T,
    delay: number = 1000,
): T {
    let lastCall = -1;
    let timeoutId: any;
    let lastArgs: any;

    const debouncedCallback = (...args: any[]) => {
        lastArgs = args;

        clearTimeout(timeoutId);

        if (lastCall !== -1) {
            if (performance.now() - lastCall >= delay) {
                callback(...lastArgs);
                lastCall = -1;
            } else {
                timeoutId = setTimeout(
                    () => {
                        callback(...lastArgs);
                        lastCall = -1;
                    },
                    delay,
                );
            }
        }

        lastCall = performance.now();
    };

    return debouncedCallback as unknown as T;
}