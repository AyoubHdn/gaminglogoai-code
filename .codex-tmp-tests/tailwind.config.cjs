/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            typography: (/** @type {(arg0: string) => any} */ theme) => ({
                DEFAULT: {
                    css: {
                        p: {
                            marginTop: theme('spacing.5'),
                            marginBottom: theme('spacing.5'),
                            lineHeight: '1.75', // Adjust line height
                        },
                        // You can target other elements like h2, h3, ul, li
                        h2: {
                            marginTop: theme('spacing.10'),
                            marginBottom: theme('spacing.4'),
                        },
                        // ... other customizations
                    },
                },
                invert: {
                    css: {
                        // color: theme('colors.slate.300'), // Base text color for dark mode if needed
                        p: {
                        // marginTop: theme('spacing.5'), // Can also set dark mode specific spacing
                        // marginBottom: theme('spacing.5'),
                        },
                        // ...
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
module.exports = config;
export {};
