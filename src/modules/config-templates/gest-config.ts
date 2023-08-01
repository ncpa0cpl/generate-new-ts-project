import { js } from "../../utils/js";

export const GEST_CONFIG = js`
/** @type {import("@reactgjs/gest/config").ConfigGetter} */
const getConfig = () => {
    return {
        testDir: "./__tests__",
        srcDir: "./src",
    };
};

export default getConfig;
`;
