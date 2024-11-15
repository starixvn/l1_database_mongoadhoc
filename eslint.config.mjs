import { defaultConfig } from "@ldb/eslint-config";
defaultConfig.push({
    rules: {
        camelcase: "off",
        "new-cap": "off",
        "no-undef": "off",
        "@typescript-eslint/no-require-imports": "off",
    },
});
export default defaultConfig;
