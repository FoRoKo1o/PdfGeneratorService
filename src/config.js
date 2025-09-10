const config = {
    tmpDir: "tmp",
    publicDir: "public",
    port: process.env.PORT || 3000,
    generalPdfInfo: {
        tocAriaLabel: "Spis treści",
        tocText: "Spis treści",
        bannerAriaLabel: "Nagłówek dokumentu",
        mainAriaLabel: "Treść główna",
        footerAriaLabel: "Stopka dokumentu",
        footerText: "© 2025 My Application"
    }
};

export default config;