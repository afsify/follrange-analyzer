import PropTypes from "prop-types";
import { ConfigProvider, theme } from "antd";

function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#405de6",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
