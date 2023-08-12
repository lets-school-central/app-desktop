export async function sleep(timeout = 1000) {
    return await new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}