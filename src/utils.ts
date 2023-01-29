// adopted from https://github.com/chetachiezikeuzor/cMenu-Plugin/blob/master/src/util/util.ts
export async function wait(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
