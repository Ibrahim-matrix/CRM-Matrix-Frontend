// src/theme.ts
import { extendTheme } from "@chakra-ui/react";
const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};
const theme = extendTheme({
  fonts: {
    body: "Roboto, sans-serif", // Specify the desired font family here
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
                // color: "blue",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              borderRadius:"10px",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 1,
             
              transformOrigin: "left top",
            },
          },
          
        },
      },
    },
  },
});

export default theme;
