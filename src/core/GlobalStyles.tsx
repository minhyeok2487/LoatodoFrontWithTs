import { Global, css, useTheme } from "@emotion/react";

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        .text-hidden {
          font-size: 0;
          text-indent: -99999px;
        }

        * {
          margin: 0;
          padding: 0;
          font: inherit;
          color: inherit;
          font-family:
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            Roboto,
            "Helvetica Neue",
            "Segoe UI",
            "Apple SD Gothic Neo",
            "Noto Sans KR",
            "Malgun Gothic",
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            sans-serif;
          font-weight: 500;
          font-size: inherit;
        }
        *,
        :after,
        :before {
          box-sizing: border-box;
          flex-shrink: 0;
        }
        :root {
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          cursor: default;
          line-height: 1.5;
          overflow-wrap: break-word;
          word-break: break-word;
          tab-size: 4;
        }
        html {
          background: ${theme.app.bg.main};
          transition: background 0.3s;
          font-size: 16px;
        }
        html,
        body {
          width: 100%;
          height: 100%;
          -webkit-font-smoothing: antialiased;
          letter-spacing: -0.02em;
          overflow-x: hidden;
        }
        ol,
        ul,
        li {
          list-style: none;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-weight: normal;
        }
        i,
        em,
        address {
          font-style: normal;
        }
        textarea {
          resize: none;
        }
        img,
        picture,
        video,
        canvas,
        svg {
          display: block;
          max-width: 100%;
        }
        button {
          background: none;
          border: 0;
          outline: none;
          cursor: pointer;
        }
        input {
          border: 0;
          outline: none;
        }
        a,
        a:link,
        a:visited,
        a:hover,
        a:active,
        a:focus {
          text-decoration: none;
          word-break: break-all;
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px white inset;
        }
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
      `}
    />
  );
};

export default GlobalStyles;
