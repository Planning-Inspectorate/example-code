export async function timeDbScript(run: () => Promise<void>) {
    const start = performance.now();
    await run();
    return performance.now() - start;
}

export function printResults(results: Record<string, number>) {
    const totals = results
        .reduce((acc, curr) => {
            for (const key of Object.keys(curr)) {
                acc[key] += curr[key];
            }
            return acc;
        }, Object.fromEntries(Object.keys(results[0]).map(key => [key, 0])));
    console.log('average results:');
    for (const [k, v] of Object.entries(totals)) {
        console.log(`  ${k}: ${formatTimeMs(v / 3)}`);
    }
}

/**
 * Converts milliseconds to a string in the format "Xs Yms".
 * @param ms Time in milliseconds
 * @returns Formatted string
 */
export function formatTimeMs(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.round(ms % 1000);
    return `${seconds}s ${milliseconds}ms`;
}
