import React from "react";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function UseWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = React.useState(
      getWindowDimensions()
    );

    React.useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }

  export default UseWindowDimensions;